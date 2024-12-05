const request = require('supertest');
const express = require('express');
const cors = require('cors');

jest.mock('./db', () => ({
  query: jest.fn(),
  connect: jest.fn(() => ({
    query: jest.fn(),
    release: jest.fn(),
  })),
}));

const app = require('./server');

describe('Flight Booking API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/cities', () => {
    it('should return all cities', async () => {
      const mockCities = [{ city: 'New York' }, { city: 'London' }];
      require('./db').query.mockResolvedValue({ rows: mockCities });

      const response = await request(app).get('/api/cities');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(['New York', 'London']);
    });

    it('should handle errors', async () => {
      require('./db').query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/cities');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'An error occurred while fetching cities' });
    });
  });

  describe('GET /api/flights', () => {
    it('should return all flights', async () => {
      const mockFlights = [
        { id: 1, departure: 'New York', destination: 'London', date: '2023-07-01' },
        { id: 2, departure: 'London', destination: 'Paris', date: '2023-07-02' },
      ];
      require('./db').query.mockResolvedValue({ rows: mockFlights });

      const response = await request(app).get('/api/flights');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockFlights);
    });

    it('should filter flights', async () => {
      const mockFlights = [
        { id: 1, departure: 'New York', destination: 'London', date: '2023-07-01' },
      ];
      require('./db').query.mockResolvedValue({ rows: mockFlights });

      const response = await request(app)
        .get('/api/flights')
        .query({ departure: 'New York', destination: 'London', date: '2023-07-01' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockFlights);
    });

    it('should handle errors', async () => {
      require('./db').query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/flights');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'An error occurred while fetching flights' });
    });
  });

  describe('GET /api/flights/:id', () => {
    it('should return a specific flight', async () => {
      const mockFlight = { id: 1, departure: 'New York', destination: 'London', date: '2023-07-01' };
      require('./db').query.mockResolvedValue({ rows: [mockFlight] });

      const response = await request(app).get('/api/flights/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockFlight);
    });

    it('should return 404 for non-existent flight', async () => {
      require('./db').query.mockResolvedValue({ rows: [] });

      const response = await request(app).get('/api/flights/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Flight not found' });
    });

    it('should handle errors', async () => {
      require('./db').query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/flights/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'An error occurred while fetching the flight' });
    });
  });

  describe('POST /api/bookings', () => {
    it('should create a booking', async () => {
      const mockClient = require('./db').connect();
      mockClient.query
        .mockResolvedValueOnce({ rows: [{ seats: 1 }] })
        .mockResolvedValueOnce({ rows: [{ id: 1 }] })
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({});

      const response = await request(app)
        .post('/api/bookings')
        .send({ user_id: 1, flight_id: 1 });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ id: 1, message: 'Booking successful' });
    });

    it('should return 404 for non-existent flight', async () => {
      const mockClient = require('./db').connect();
      mockClient.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .post('/api/bookings')
        .send({ user_id: 1, flight_id: 999 });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Flight not found' });
    });

    it('should return 400 when no seats available', async () => {
      const mockClient = require('./db').connect();
      mockClient.query.mockResolvedValueOnce({ rows: [{ seats: 0 }] });

      const response = await request(app)
        .post('/api/bookings')
        .send({ user_id: 1, flight_id: 1 });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'No seats available' });
    });

    it('should handle errors', async () => {
      const mockClient = require('./db').connect();
      mockClient.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/bookings')
        .send({ user_id: 1, flight_id: 1 });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'An error occurred while booking the flight' });
    });
  });

  describe('GET /api/bookings/:userId', () => {
    it('should return user bookings', async () => {
      const mockBookings = [
        { id: 1, status: 'confirmed', departure: 'New York', destination: 'London', date: '2023-07-01', price: 500 },
      ];
      require('./db').query.mockResolvedValue({ rows: mockBookings });

      const response = await request(app).get('/api/bookings/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockBookings);
    });

    it('should handle errors', async () => {
      require('./db').query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/bookings/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'An error occurred while fetching bookings' });
    });
  });

  describe('PUT /api/bookings/:id/cancel', () => {
    it('should cancel a booking', async () => {
      const mockClient = require('./db').connect();
      mockClient.query
        .mockResolvedValueOnce({ rows: [{ flight_id: 1 }] })
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({});

      const response = await request(app).put('/api/bookings/1/cancel');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Booking cancelled successfully' });
    });

    it('should return 404 for non-existent booking', async () => {
      const mockClient = require('./db').connect();
      mockClient.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app).put('/api/bookings/999/cancel');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Booking not found' });
    });

    it('should handle errors', async () => {
      const mockClient = require('./db').connect();
      mockClient.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).put('/api/bookings/1/cancel');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'An error occurred while cancelling the booking' });
    });
  });
});

