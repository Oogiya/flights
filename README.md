
## **Project Overview**
The **Flight Booking Project** is a web-based application for managing flight bookings, built with a microservices architecture. It includes:
- A **frontend** built with Next.js for a seamless user experience.
- A **backend** built with Express.js for robust API services.
- A **PostgreSQL database** for data storage.


## **CI/CD**
The CI/CD pipeline automates the process of building, testing, and deploying the application.

1. **Checkout Code**:
   - Pulls the latest code from the Git repository.

2. **Build Docker Images**:
   - Frontend and backend Docker images are built using respective `Dockerfile.prod`.

3. **Run Automated Tests**:
   - Frontend tests use Jest.
   - [TODO] Backend tests use Mocha. 

4. **Push Docker Images**:
   - Docker images are tagged with the environment (e.g., `dev`, `prod`) and pushed to a Docker registry.

5. **Deploy**:
   - The application is deployed to either development or production using `docker-compose`.


## **Docker and Environment Configuration**
### **Frontend Configuration**
- `Dockerfile.dev`:
  - Supports hot reloading.
- `Dockerfile.prod`:
  - Optimized for serving static files with Next.js.

### **Backend Configuration**
- `Dockerfile.dev`:
  - Includes debugging tools.
- `Dockerfile.prod`:
  - Stripped-down production image.

### **Database Configuration**
- Uses the official `postgres` image.
- Data persistence is ensured via a Docker volume (`postgres_data`).

### **[TODO] Environment Variables**
- `NEXT_PUBLIC_API_URL`: Frontend connection to backend API.
- `DATABASE_URL`: Backend connection to the PostgreSQL database.

---

## **Deployment Steps**
### **Development**
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/flight-booking.git
   cd flight-booking
   ```
2. Start the development environment:
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```
3. Access the application:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:3001`

### **Production**
1. Build and push Docker images:
   ```bash
   docker build -f frontend/Dockerfile.prod -t your-docker-registry/vim-flights-frontend:prod frontend/
   docker build -f backend/Dockerfile.prod -t your-docker-registry/vim-flights-backend:prod backend/
   docker push your-docker-registry/vim-flights-frontend:prod
   docker push your-docker-registry/vim-flights-backend:prod
   ```
2. Deploy the application:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```
