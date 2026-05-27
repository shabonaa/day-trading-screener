# 📊 Stock Analysis Pro

AI-powered stock analysis application with technical indicators, ML predictions, and buy/sell signals.

## Features

### 📈 Data Sources
- **Yahoo Finance** — Live stock data via `yfinance` (free, no API key needed)
- **CSV Upload** — Upload your own historical OHLCV data

### 📉 Technical Indicators
- **Trend:** SMA (20/50/200), EMA (9/21/55), MACD, Bollinger Bands, ADX
- **Momentum:** RSI (14), Stochastic Oscillator (14,3,3), CCI (20)
- **Volume:** OBV, Volume SMA, VWAP
- **Volatility:** ATR (14)

### 🤖 AI Predictions
- **Rule-Based Engine** — Indicator crossovers, overbought/oversold conditions
- **Machine Learning** — Random Forest + Gradient Boosting ensemble
- **Combined System** — Weighted combination (40% rules + 60% ML)
- **Horizons:** Day Trading (next candle), Next Day, Next Week

### 🎯 Support & Resistance
- **Price Action** — Swing highs/lows detection
- **Fibonacci Retracement** — 0%, 23.6%, 38.2%, 50%, 61.8%, 78.6%, 100%
- **Pivot Points** — Standard (P, R1-R3, S1-S3)
- **Volume Profile** — POC, Value Area High/Low

### 💡 Buy/Sell Signals
- **Rule-Based** — MACD cross, EMA cross, RSI extremes, BB bounce, Stochastic
- **ML-Based** — Confidence threshold signals from Random Forest
- **Combined** — Merged scoring with selectable method

### 📊 Charts
- **Candlestick** and **Line** chart types
- **Timeframes:** 15min, 30min, 1H, 1D, 1W
- **Periods:** 1 Day to 2 Years
- Interactive TradingView Lightweight Charts
- Signal markers (arrows) on chart

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TailwindCSS |
| Charts | TradingView Lightweight Charts |
| Backend | Python FastAPI |
| Data | yfinance + pandas |
| Analysis | pandas-ta + scipy |
| ML | scikit-learn (Random Forest + Gradient Boosting) |
| Deployment | Firebase Hosting (frontend) + Vercel (backend) |

---

## Local Development

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm

### Quick Start

```bash
# Clone and enter directory
cd stock-analysis-app

# Run everything
./start.sh
```

Or manually:

```bash
# Backend
cd backend
pip3 install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8100 --reload

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

---

## Deployment

### Frontend → Firebase Hosting

```bash
cd frontend

# Install Firebase CLI
npm install -g firebase-tools

# Login and init
firebase login
firebase init hosting

# Update .firebaserc with your project ID

# Build and deploy
npm run build
firebase deploy --only hosting
```

### Backend → Vercel

```bash
cd backend

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set production
vercel --prod
```

### Connect Frontend to Backend

After deploying the backend to Vercel, update the API base URL in `frontend/src/utils/api.js`:

```javascript
const API_BASE = 'https://your-backend.vercel.app/api'
```

Then rebuild and redeploy the frontend.

---

## CSV Upload Format

Your CSV file should contain these columns (case-insensitive):

| Column | Required | Description |
|--------|----------|-------------|
| Date | Recommended | Date/datetime column |
| Open | ✅ | Opening price |
| High | ✅ | High price |
| Low | ✅ | Low price |
| Close | ✅ | Closing price |
| Volume | Optional | Trading volume |

Example:
```csv
Date,Open,High,Low,Close,Volume
2024-01-02,150.00,152.50,149.00,151.75,1000000
2024-01-03,151.75,153.00,150.50,152.25,1200000
```

---

## Project Structure

```
stock-analysis-app/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── ControlPanel.jsx
│   │   │   ├── StockChart.jsx
│   │   │   ├── IndicatorPanel.jsx
│   │   │   ├── PredictionPanel.jsx
│   │   │   ├── SignalPanel.jsx
│   │   │   └── SupportResistancePanel.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── firebase.json
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── backend/
│   ├── api/
│   │   ├── indicators.py
│   │   ├── predictions.py
│   │   ├── signals.py
│   │   └── support_resistance.py
│   ├── main.py
│   ├── requirements.txt
│   └── vercel.json
├── start.sh
└── README.md
```

---

## Disclaimer

⚠️ This application is for **educational and research purposes only**. It does not constitute financial advice. Always do your own research and consult with a qualified financial advisor before making investment decisions. Past performance and predictions do not guarantee future results.
# day-trading-screener
