# CryptoSim - Cryptocurrency Trading Simulator

CryptoSim is a full-stack web application that provides a risk-free environment for users to practice cryptocurrency trading using real-time market data. The application allows users to simulate buying and selling cryptocurrencies without using real money, making it an ideal platform for learning and practicing trading strategies.

<p align="center">
  <a href="https://i.postimg.cc/SRCTGthm/Screenshot-2025-05-22-233201.png">
    <img src="https://i.postimg.cc/SRCTGthm/Screenshot-2025-05-22-233201.png" alt="Game Logo" width="400">
  </a>
</p>

<p align="center">
  <a href="https://i.postimg.cc/W1X9SkQq/Screenshot-2025-05-22-233214.png">
    <img src="https://i.postimg.cc/W1X9SkQq/Screenshot-2025-05-22-233214.png" alt="Game Logo" width="400">
  </a>
</p>

<p align="center">
  <a href="https://i.postimg.cc/TYjNLS09/Screenshot-2025-05-22-233312.png">
    <img src="https://i.postimg.cc/TYjNLS09/Screenshot-2025-05-22-233312.png" alt="Game Logo" width="400">
  </a>
</p>

<p align="center">
  <a href="https://i.postimg.cc/nhHRvkwt/Screenshot-2025-05-22-233458.png">
    <img src="https://i.postimg.cc/nhHRvkwt/Screenshot-2025-05-22-233458.png" alt="Game Logo" width="400">
  </a>
</p>
<p align="center">
  <a href="https://i.postimg.cc/QNTysVWv/Screenshot-2025-05-22-233524.png">
    <img src="https://i.postimg.cc/QNTysVWv/Screenshot-2025-05-22-233524.png" alt="Game Logo" width="400">
  </a>
</p>

<p align="center">
  <a href="https://i.postimg.cc/28NX5mQy/Screenshot-2025-05-22-233533.png">
    <img src="https://i.postimg.cc/28NX5mQy/Screenshot-2025-05-22-233533.png" alt="Game Logo" width="400">
  </a>
</p>


## Project Architecture

The project follows a modern client-server architecture:

### Frontend (client/)

- Built with React + TypeScript
- Real-time price updates using WebSocket
- Modern UI components and responsive design
- State management for user session and trading data

### Backend (server/)

- Spring Boot Java application
- RESTful API design
- WebSocket integration for real-time data
- JWT-based authentication
- PostgreSQL database

## Key Features

1. **User Authentication**

   - Secure registration and login
   - JWT-based session management
   - Password encryption using BCrypt

2. **Real-time Trading**

   - Live cryptocurrency price updates via WebSocket
   - Buy and sell cryptocurrencies
   - Portfolio management
   - Transaction history

3. **Account Management**
   - Initial balance allocation
   - Portfolio tracking
   - Account reset capability
   - Holdings management

## API Documentation

### Authentication Endpoints

```
POST /api/auth/register
- Register a new user
- Body: { name, email, password, repeatPassword }
- Returns: { token }

POST /api/auth/login
- Login existing user
- Body: { email, password }
- Returns: { token }
```

### Trading Endpoints

```
POST /api/orders/buy
- Place buy order
- Body: { symbol, amount }
- Returns: Order details

POST /api/orders/sell
- Place sell order
- Body: { symbol, amount }
- Returns: Order details

GET /api/orders
- Get user's order history
- Optional Query: ?symbol=BTC
- Returns: Array of orders
```

### Portfolio Endpoints

```
GET /api/holdings
- Get user's current holdings
- Optional Query: ?symbol=BTC
- Returns: Array of holdings or single holding

GET /api/users/me
- Get current user's profile
- Returns: User profile with balance

POST /api/users/reset
- Reset user's account
- Returns: Reset confirmation
```

## WebSocket API

The application uses WebSocket for real-time price updates:

```
Endpoint: /ws
Subscribe to: /prices
Message Format: {
    symbol: string,
    price: number,
    change: number,
    change_pct: number,
    high: number,
    low: number
}
```

## Error Handling

The application implements a comprehensive error handling system:

1. **Validation Errors** (400 Bad Request)

   - Invalid input data
   - Insufficient balance
   - Invalid trading amounts

2. **Authentication Errors** (401 Unauthorized)

   - Invalid credentials
   - Expired or invalid tokens

3. **Business Logic Errors** (400 Bad Request)
   - Insufficient holdings for selling
   - Invalid trading operations

## Security Measures

1. **Authentication**

   - JWT-based token system
   - Secure password hashing
   - Token expiration and validation

2. **Data Protection**
   - Input validation and sanitization
   - SQL injection prevention
   - CORS configuration

## Getting Started

### Prerequisites

- Java 17 or higher
- Node.js 16 or higher
- Maven
- npm or yarn

### Backend Setup

```bash
cd server
mvn clean install
mvn spring-boot:run
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

## Design Decisions

1. **Technology Stack**

   - Spring Boot
   - React + TypeScript
   - WebSocket

2. **Security**

   - JWT for stateless authentication
   - Global exception handling
   - Secure password storage

3. **Real-time Data**
   - WebSocket for efficient real-time updates
   - Optimized data transfer format
   - Reliable connection handling

## License

This project is licensed under the MIT License - see the LICENSE file for details.
