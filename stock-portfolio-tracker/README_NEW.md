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

Install dependencies and start:

```bash
cd backend
npm install
npm run dev
```

The backend will run on `http://localhost:5000`

### 2. Frontend Setup

Create `frontend/.env` file:

```bash
REACT_APP_API_URL=http://localhost:5000/api
```

Install dependencies and start:

```bash
cd frontend
npm install
npm start
```

The frontend will open at `http://localhost:3000`

## 📚 API Reference

Base URL: `http://localhost:5000/api`

### Authentication

**Register**

```
POST /auth/register
Body: { username, email, password }
Response: { token, user: { id, username, email } }
```

**Login**

```
POST /auth/login
Body: { email, password }
Response: { token, user }
```

**Get Profile** (requires auth)

```
GET /auth/profile
Headers: Authorization: Bearer <token>
Response: { id, username, email, created_at }
```

### Portfolio (All require authentication)

**Get Portfolio**

```
GET /portfolio
Response: {
  transactions: [...],
  summary: {
    totalValue,
    totalInvested,
    totalGainLoss,
    totalGainLossPercent,
    numberOfStocks
  }
}
```

**Add Stock**

```
POST /portfolio/stocks
Body: { symbol, quantity, purchasePrice, purchaseDate }
Response: transaction object
```

**Remove Stock**

```
DELETE /portfolio/stocks/:id
Response: { message: "Stock removed successfully" }
```

**Get Performance**

```
GET /portfolio/performance?period=1mo
Query: period (1d, 1w, 1mo, 3mo, 6mo, 1y)
Response: { performance: [{ date, value }] }
```

### Stocks

**Get Quote**

```
GET /stocks/quote/:symbol
Response: {
  symbol,
  companyName,
  currentPrice,
  change,
  changePercent,
  previousClose,
  marketCap,
  volume
}
```

**Search Stocks**

```
GET /stocks/search?query=AAPL
Response: [{ symbol, name, exchange, type }]
```

## 🎨 Features in Detail

### Smart Caching

- Stock prices are cached for 1 minute to reduce API calls
- Automatic cache cleanup prevents memory leaks

### Input Validation

- Email format validation
- Password strength requirements (min 6 characters)
- Username length validation (3-50 characters)
- Transaction data validation (positive quantities, valid dates)

### Security Features

- Bcrypt password hashing (12 salt rounds)
- JWT token authentication with 30-day expiration
- CORS protection with configurable origins
- Security headers (XSS, clickjacking protection)
- SQL injection prevention via parameterized queries

### Error Handling

- Comprehensive error messages
- Graceful degradation
- Automatic token refresh on expiration
- Network error detection and user feedback

## 🚢 Deployment

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed deployment instructions.

Quick deploy:

```bash
npm i -g vercel
vercel login
vercel
```

## 🧪 Database Schema

The application automatically creates these tables on startup:

### users

- `id` SERIAL PRIMARY KEY
- `username` VARCHAR(50) UNIQUE NOT NULL
- `email` VARCHAR(100) UNIQUE NOT NULL
- `password` VARCHAR(255) NOT NULL
- `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### portfolio

- `user_id` INTEGER REFERENCES users(id)
- `total_value` DECIMAL(15,2)
- `total_gain_loss` DECIMAL(15,2)
- `total_gain_loss_percent` DECIMAL(10,2)
- `updated_at` TIMESTAMP

### transactions

- `id` SERIAL PRIMARY KEY
- `user_id` INTEGER REFERENCES users(id)
- `symbol` VARCHAR(10) NOT NULL
- `company_name` VARCHAR(255)
- `quantity` INTEGER NOT NULL
- `purchase_price` DECIMAL(10,2) NOT NULL
- `current_price` DECIMAL(10,2)
- `total_value` DECIMAL(15,2)
- `gain_loss` DECIMAL(15,2)
- `gain_loss_percent` DECIMAL(10,2)
- `purchase_date` DATE NOT NULL
- `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👤 Author

Created by **Alen**

---

**Note:** This application uses Yahoo Finance API which may have rate limits. For production use, consider implementing additional caching or using a paid API service.
