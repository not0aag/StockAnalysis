# Stock Portfolio Tracker

A full-stack web app to track your stock holdings, view real-time quotes, and visualize portfolio performance.

## Overview

- Users register, log in, and manage a portfolio of stock transactions.
- Real-time quotes and historical data are fetched via yahoo-finance2 (no API key required).
- Portfolio summary (current value, invested, gain/loss) and performance over time.
- React frontend (Redux Toolkit + MUI) with a Node/Express API and PostgreSQL database.

## Tech Stack

- Backend: Node.js, Express, PostgreSQL (pg), JWT, bcrypt, yahoo-finance2
- Frontend: React, Redux Toolkit, React Router, Material UI, Chart.js

## Monorepo Structure

```
backend/
  server.js
  routes/        # auth, portfolio, stocks
  controllers/   # logic for each route
  config/        # database pool + bootstrap
  middleware/    # auth JWT middleware
  utils/         # stock API wrappers
frontend/
  src/           # React app (Redux store, components, services)
```

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 13+ with a database you can connect to

## Quick Start (Local)

1) Backend

- Create `backend/.env` from the example:

```
# backend/.env
DATABASE_URL=postgres://user:password@localhost:5432/stockdb
JWT_SECRET=your_long_random_secret
PORT=5000
```

- Install and start the API:

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
