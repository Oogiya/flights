const dotenv = require("dotenv").config()
const express = require("express");
const cors = require("cors");
const app = express();

const pool = require("./db");

// TODO: replace with env variable
app.use(cors({
    origin: `http://localhost:3001`,
    methods: ['POST', 'GET', 'OPTIONS'],
}));
app.use(express.json());

const query = async (text, params) => {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log("Executed query", { text, duration, rows: res.rowCount });
    return res;
}


app.get("/test", (req, res) => {
    res.sendStatus(200);
});

app.get("/api/cities", async (req, res) => {
    try {
        const result = await query(
            "SELECT DISTINCT departure AS city FROM flights UNION SELECT DISTINCT destination " +
            "FROM flights ORDER BY city"
        );
        const cities = result.rows.map(row => row.city);
        res.json(cities);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching cities' });
    }
})

app.get('/api/flights', async (req, res) => {
  try {
    const { departure, destination, date } = req.query;
    let queryText = 'SELECT * FROM flights WHERE 1=1';
    const queryParams = [];

    if (departure) {
      queryText += ' AND LOWER(departure) LIKE LOWER($' + (queryParams.length + 1) + ')';
      queryParams.push(`%${departure}%`);
    }

    if (destination) {
      queryText += ' AND LOWER(destination) LIKE LOWER($' + (queryParams.length + 1) + ')';
      queryParams.push(`%${destination}%`);
    }

    if (date) {
      queryText += ' AND DATE(date) = $' + (queryParams.length + 1);
      queryParams.push(date);
    }

    queryText += ' ORDER BY date ASC';

    const result = await query(queryText, queryParams);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching flights' });
  }
});

app.get('/api/flights/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM flights WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Flight not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching the flight' });
  }
});

app.post('/api/bookings', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { user_id, flight_id } = req.body;

    // Check if there are available seats
    const flightResult = await client.query('SELECT seats FROM flights WHERE id = $1 FOR UPDATE', [flight_id]);
    if (flightResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Flight not found' });
    }

    const availableSeats = flightResult.rows[0].seats;
    if (availableSeats <= 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'No seats available' });
    }

    // Create booking
    const bookingResult = await client.query(
      'INSERT INTO bookings (user_id, flight_id, status) VALUES ($1, $2, $3) RETURNING id',
      [user_id, flight_id, 'confirmed']
    );

    // Update available seats
    await client.query('UPDATE flights SET seats = seats - 1 WHERE id = $1', [flight_id]);

    await client.query('COMMIT');
    res.status(201).json({ id: bookingResult.rows[0].id, message: 'Booking successful' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'An error occurred while booking the flight' });
  } finally {
    client.release();
  }
});

app.get('/api/bookings/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await query(
      'SELECT b.id, b.status, f.departure, f.destination, f.date, f.price FROM bookings b JOIN flights f ON b.flight_id = f.id WHERE b.user_id = $1 ORDER BY f.date DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching bookings' });
  }
});

app.put('/api/bookings/:id/cancel', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { id } = req.params;

    // Update booking status
    const bookingResult = await client.query(
      'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING flight_id',
      ['cancelled', id]
    );

    if (bookingResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Booking not found' });
    }

    const flightId = bookingResult.rows[0].flight_id;

    // Increase available seats
    await client.query('UPDATE flights SET seats = seats + 1 WHERE id = $1', [flightId]);

    await client.query('COMMIT');
    res.json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'An error occurred while cancelling the booking' });
  } finally {
    client.release();
  }
});


// TODO: replace with env variable
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});
