# Curvvtech Backend

This repository contains the backend service for the Curvvtech assignment. It is a production-grade Node.js application built with Express, MongoDB, and Redis, featuring a complete API for user and device management.

## Features

- **User Authentication**: Secure user signup and login using JWT (Access and Refresh tokens).
- **Device Management**: Full CRUD operations for IoT devices with ownership enforcement.
- **Device Heartbeat**: Endpoint to monitor device activity and a background job to deactivate inactive devices.
- **Logging & Analytics**: Endpoints to log device events and retrieve aggregated usage data.
- **Security**: Implemented using Helmet for security headers, CORS, and password hashing with bcrypt.
- **Rate Limiting**: Per-IP rate limiting for authentication routes and per-user rate limiting for authenticated API routes, using Redis for distributed environments.
- **Validation**: Request validation using Joi to ensure data integrity.
- **Testing**: Comprehensive integration test suite using Jest and Supertest with an in-memory MongoDB server.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose)
- **In-Memory Store**: Redis (for rate limiting)
- **Authentication**: Passport.js with JWT strategy
- **Testing**: Jest, Supertest, MongoDB-Memory-Server
- **Utilities**: `dotenv`, `joi`, `bcrypt`, `node-cron`, `helmet`, `cors`

## Prerequisites

- Node.js (v14 or higher)
- npm
- MongoDB
- Redis

## Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd curvvtech-server
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory by copying the example file:
    ```bash
    cp .env.example .env
    ```
    Then, fill in the required values in the `.env` file.

## Running the Application

-   **Production mode:**
    ```bash
    npm start
    ```

-   **Development mode (with hot-reloading):**
    ```bash
    npm run dev
    ```

-   **Run tests:**
    ```bash
    npm test
    ```

-   **Using Docker Compose:**
    Make sure you have Docker installed and running. Your `.env` file will be used by Docker Compose.
    ```bash
    docker-compose up --build
    ```

## API Endpoints

All endpoints are prefixed with `/v1`.

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
