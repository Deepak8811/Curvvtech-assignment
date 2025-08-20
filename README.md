#  Curvvtech Backend API

A robust, production-ready backend service for managing users and IoT devices. Built with Node.js, Express, and MongoDB, this API provides secure authentication, device management, and real-time monitoring capabilities.

##  Key Features

###  Authentication & Security
- JWT-based authentication with access tokens
- Secure password hashing using bcrypt
- Rate limiting to prevent abuse
- Helmet.js for setting secure HTTP headers
- CORS protection

###  Device Management
- Full CRUD operations for IoT devices
- Device ownership verification
- Device status tracking (active/inactive)
- Automatic deactivation of inactive devices (24h threshold)

###  Monitoring & Logging
- Device activity tracking
- Detailed logging system
- Background jobs for maintenance tasks

###  Testing
- Comprehensive unit tests
- Integration testing with Jest
- In-memory MongoDB for testing
- Test coverage reporting

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with Passport.js
- **Testing**: Jest, Supertest, MongoDB-Memory-Server
- **Utilities**:
  - `dotenv` for environment variables
  - `joi` for validation
  - `bcrypt` for password hashing
  - `node-cron` for scheduled jobs
  - `helmet` & `cors` for security
  - `express-rate-limit` for basic rate limiting

## Prerequisites

- Node.js (v14 or higher)
- npm
- MongoDB

##  Getting Started

### Prerequisites
- Node.js v14 or higher
- npm (comes with Node.js)
- MongoDB (local or cloud instance)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/curvvtech-server.git
   cd curvvtech-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env  # If example file exists
   ```
   
   Configure the following environment variables:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/curvvtech
   
   # JWT
   JWT_SECRET=your_secure_jwt_secret_here
   JWT_EXPIRES_IN=1d
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=15*60*1000  # 15 minutes
   RATE_LIMIT_MAX_REQUESTS=100
   ```

##  Running the Application

### Development Mode
```bash
npm run dev
```
- Starts the server with nodemon for automatic reloading
- Runs on http://localhost:3000 by default
- Debug logs enabled

### Production Mode
```bash
npm start
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run test coverage
npm test -- --coverage
```

### Using Docker
```bash
# Build and start containers
docker-compose up --build

# Stop containers
docker-compose down
```

### Available Scripts
- `npm start`: Start production server
- `npm run dev`: Start development server
- `npm test`: Run tests
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier

##  API Documentation

### Base URL
All endpoints are prefixed with `/v1`.

### Postman Documentation
For detailed API documentation with examples, please refer to our Postman collection:
[![Run in Postman](https://run.pstmn.io/button.svg)](https://documenter.getpostman.com/view/47707645/2sB3BKFU2U)

### Authentication
All endpoints except `/auth/*` require a valid JWT token in the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

### Response Format
All responses follow this format:
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

### Error Responses
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

### Authentication

-   **`POST /auth/signup`**: Register a new user.
    -   **Body**: `{ "email": "user@example.com", "password": "Password123!" }`
    -   **Response**: User object and JWT tokens.

-   **`POST /auth/login`**: Log in an existing user.
    -   **Body**: `{ "email": "user@example.com", "password": "Password123!" }`
    -   **Response**: User object and JWT tokens.

### Devices

*All device routes require a Bearer Token in the `Authorization` header.*

-   **`POST /devices`**: Create a new device.
    -   **Body**: `{ "name": "My Device", "type": "sensor" }`

-   **`GET /devices`**: Get all devices for the authenticated user.

-   **`GET /devices/:id`**: Get a single device by its ID.

-   **`PATCH /devices/:id`**: Update a device's details.
    -   **Body**: `{ "name": "New Device Name" }`

-   **`DELETE /devices/:id`**: Delete a device.

-   **`POST /devices/:id/heartbeat`**: Update the device's `lastActiveAt` timestamp and set its status to `active`.

### Logs & Analytics

-   **`POST /devices/:id/logs`**: Create a log entry for a device.
    -   **Body**: `{ "event": "units_consumed", "value": 10 }`

-   **`GET /devices/:id/logs`**: Get recent logs for a device (defaults to the last 10).

-   **`GET /devices/:id/usage`**: Get aggregated usage analytics for a device.
    -   **Query Params**: `range` (e.g., `24h`, `7d`, `1w`). Defaults to `24h`.

## Testing

Run tests:
```bash
npm test
```

## Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Port for the server to listen on | `3000` | No |
| `NODE_ENV` | Application environment (`development`/`production`/`test`) | `development` | No |
| `MONGODB_URI` | MongoDB connection string | - | Yes |
| `JWT_SECRET` | Secret key for JWT signing | - | Yes |
| `JWT_EXPIRES_IN` | JWT expiration time | `1d` | No |
| `RATE_LIMIT_WINDOW_MS` | Rate limiting window in milliseconds | `900000` (15 min) | No |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window per IP | `100` | No |

##  Development

### Code Style
- ESLint for code linting
- Prettier for code formatting
- Follows Airbnb JavaScript Style Guide

### Git Hooks
Pre-commit hooks are set up to:
- Run linter
- Run tests
- Format code

### Project Structure
```
src/
├── api/               # API components
│   ├── controllers/   # Route controllers
│   ├── middlewares/   # Custom middleware
│   └── routes/        # Route definitions
├── config/            # Configuration files
├── jobs/              # Background jobs
├── models/            # Database models
├── services/          # Business logic
└── utils/             # Utility functions
```

##  License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.



