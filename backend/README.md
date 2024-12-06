### **Base URL**
- Development: `http://localhost:3001`

---

### **1. Health Check**
**Endpoint**: `/test`  
**Method**: `GET`  
**Description**:  
Returns a `200 OK` status to confirm the server is running.

**Response**:
```json
200 OK
```

---

### **2. Get Cities**
**Endpoint**: `/api/cities`  
**Method**: `GET`  
**Description**:  
Fetches a list of distinct cities (both departure and destination) from the flights database.

**Response**:
```json
[
    "New York",
    "Los Angeles",
    "Chicago"
]
```

**Error Response**:
- `500 Internal Server Error`: If there's an issue with the database query.

---

### **3. Search Flights**
**Endpoint**: `/api/flights`  
**Method**: `GET`  
**Description**:  
Search for flights based on departure city, destination city, and/or date.

**Query Parameters**:
- `departure` (optional): Departure city (partial matches allowed).
- `destination` (optional): Destination city (partial matches allowed).
- `date` (optional): Flight date in `YYYY-MM-DD` format.

**Response**:
```json
[
    {
        "id": 1,
        "departure": "New York",
        "destination": "Los Angeles",
        "date": "2024-12-05T10:00:00Z",
        "price": 300.00,
        "seats": 5
    }
]
```

**Error Response**:
- `500 Internal Server Error`: If the query fails.

---

### **4. Get Flight by ID**
**Endpoint**: `/api/flights/:id`  
**Method**: `GET`  
**Description**:  
Fetches details of a specific flight by its ID.

**Path Parameter**:
- `id`: Flight ID.

**Response**:
```json
{
    "id": 1,
    "departure": "New York",
    "destination": "Los Angeles",
    "date": "2024-12-05T10:00:00Z",
    "price": 300.00,
    "seats": 5
}
```

**Error Response**:
- `404 Not Found`: If the flight does not exist.
- `500 Internal Server Error`: If the query fails.

---

### **5. Book a Flight**
**Endpoint**: `/api/bookings`  
**Method**: `POST`  
**Description**:  
Creates a booking for a flight.

**Request Body**:
```json
{
    "user_id": 123,
    "flight_id": 1
}
```

**Response**:
```json
{
    "id": 456,
    "message": "Booking successful"
}
```

**Error Response**:
- `404 Not Found`: If the flight does not exist.
- `400 Bad Request`: If no seats are available.
- `500 Internal Server Error`: If the booking process fails.

---

### **6. Get User Bookings**
**Endpoint**: `/api/bookings/:userId`  
**Method**: `GET`  
**Description**:  
Fetches all bookings for a specific user.

**Path Parameter**:
- `userId`: User ID.

**Response**:
```json
[
    {
        "id": 456,
        "status": "confirmed",
        "departure": "New York",
        "destination": "Los Angeles",
        "date": "2024-12-05T10:00:00Z",
        "price": 300.00
    }
]
```

**Error Response**:
- `500 Internal Server Error`: If the query fails.

---

### **7. Cancel a Booking**
**Endpoint**: `/api/bookings/:id/cancel`  
**Method**: `PUT`  
**Description**:  
Cancels a specific booking and updates available seats for the flight.

**Path Parameter**:
- `id`: Booking ID.

**Response**:
```json
{
    "message": "Booking cancelled successfully"
}
```

**Error Response**:
- `404 Not Found`: If the booking does not exist.
- `500 Internal Server Error`: If the cancellation process fails.

---

### **Error Handling**
- **500 Internal Server Error**: Indicates an issue with database operations.
- **404 Not Found**: Returned when a resource (flight or booking) is not found.
- **400 Bad Request**: Returned for invalid booking requests (e.g., no seats available).

---

### **Environment Variables**
- `PORT`: The port on which the server runs (default is `3001`).

---
