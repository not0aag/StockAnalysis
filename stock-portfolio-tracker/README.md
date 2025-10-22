# Stock Portfolio Tracker

A modern, full-stack web application for tracking your stock portfolio with real-time quotes, performance analytics, and beautiful visualizations.

## 🌟 Features

- **User Authentication** - Secure registration and login with JWT tokens
- **Portfolio Management** - Add, track, and remove stock holdings
- **Real-Time Data** - Live stock prices from Yahoo Finance (no API key needed)
- **Performance Analytics** - Visualize portfolio performance over time
- **Responsive Design** - Beautiful dark/light theme with Material-UI
- **Cloud Ready** - Configured for Vercel deployment

## 🛠 Tech Stack

### Backend
- **Runtime:** Node.js with Express
- **Database:** PostgreSQL with connection pooling
- **Authentication:** JWT with bcrypt password hashing
- **Stock Data:** yahoo-finance2 API
- **Security:** CORS, input validation, error handling

### Frontend
- **Framework:** React 19
- **State Management:** Redux Toolkit
- **UI Library:** Material-UI (MUI)
- **Routing:** React Router v7
- **Charts:** Chart.js with react-chartjs-2
- **HTTP Client:** Axios with interceptors

## 📁 Project Structure

```
stock-portfolio-tracker/
├── backend/
│   ├── server.js              # Express app configuration
│   ├── config/
│   │   └── database.js        # PostgreSQL connection & schema
│   ├── controllers/
│   │   ├── authController.js  # Register, login, profile
│   │   ├── portfolioController.js  # Portfolio CRUD operations
│   │   └── stockController.js # Stock quotes & search
│   ├── middleware/
│   │   └── auth.js            # JWT authentication
│   ├── routes/                # API route definitions
│   └── utils/
│       └── stockAPI.js        # Yahoo Finance integration
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── redux/             # Redux store & slices
│   │   ├── services/          # API service
│   │   ├── contexts/          # Theme context
│   │   └── utils/             # Utility functions
│   └── public/                # Static assets
├── api/
│   └── index.js               # Vercel serverless wrapper
└── vercel.json                # Vercel deployment config
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 13+

### 1. Backend Setup

Create `backend/.env` file:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database (update with your credentials)
DATABASE_URL=postgresql://user:password@localhost:5432/stock_portfolio

# JWT Secret (generate a random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

```
cd backend
npm install
npm run dev
```

The server will run on http://localhost:5000.

2) Frontend

- Create `frontend/.env` from the example:

```
# frontend/.env
REACT_APP_API_URL=http://localhost:5000/api
```

- Install and start the client:

```
cd frontend
npm install
npm start
```

The app will open on http://localhost:3000.

## Environment Variables

Backend (`backend/.env`):
- DATABASE_URL: PostgreSQL connection string
- JWT_SECRET: Secret for signing JWTs
- PORT: Optional API port (defaults to 5000)

Frontend (`frontend/.env`):
- REACT_APP_API_URL: Base URL to the API, e.g. http://localhost:5000/api

Example files are provided at `backend/.env.example` and `frontend/.env.example`.

## Database Notes

- On startup, the backend creates the necessary tables if they don’t exist:
  - users (id, username, email, password, created_at)
  - portfolio (user_id, totals)
  - transactions (user_id, symbol, quantity, prices, dates)
- No manual migrations are required for local dev.

## API Reference

Base URL: `${PORT || 5000}/api`

Auth
- POST /auth/register
  - body: { username, email, password }
  - 201: { token, user: { id, username, email } }
- POST /auth/login
  - body: { email, password }
  - 200: { token, user }
- GET /auth/profile (Bearer token)
  - 200: { id, username, email, created_at }

Portfolio (Bearer token required for all)
- GET /portfolio
  - Returns { transactions: [...], summary: { totalValue, totalInvested, totalGainLoss, totalGainLossPercent, numberOfStocks } }
- POST /portfolio/stocks
  - body: { symbol, quantity, purchasePrice, purchaseDate }
  - 201: inserted transaction row
- DELETE /portfolio/stocks/:id
  - 200: { message }
- GET /portfolio/performance?period=1mo|3mo|6mo|1y|... (Yahoo periods)
  - 200: { performance: [{ date, value }, ...] }

Stocks (Bearer token)
- GET /stocks/quote/:symbol
  - 200: { symbol, companyName, currentPrice, ... }
- GET /stocks/search?query=apple
  - 200: [{ symbol, name, exchange, type }, ...]

## Frontend

- React app using Redux Toolkit and React Router.
- Axios interceptor adds the JWT from localStorage to every API request.
- Key pages/components:
  - Authentication (Login/Register)
  - Dashboard/Portfolio view
  - Add/Remove positions
  - Performance chart

## Development Tips

- If PostgreSQL requires SSL locally and you face ECONNRESET, ensure your `DATABASE_URL` is correct. The app uses `ssl: { rejectUnauthorized: false }` by default; adjust for your environment as needed.
- Clear localStorage token if you rotate `JWT_SECRET` and see auth issues.

## Deployment

- Set the same environment variables in your hosting platform.
- Serve the frontend build (via `npm run build`) behind the API; or host them separately and set `REACT_APP_API_URL` accordingly.

## License

MIT
