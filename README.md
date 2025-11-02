markdown
# 🌤️ Weather Dashboard

A modern React app for monitoring weather across multiple cities with real-time data and forecasts.

## ✨ Features

- **Multi-City Dashboard** - Monitor weather across locations
- **Real-time Data** - Live weather updates
- **5-Day Forecast** - Extended predictions
- **Favorite Cities** - Save preferred locations
- **Interactive Charts** - Temperature trends
- **Unit Conversion** - Celsius/Fahrenheit toggle

## 🚀 Quick Start

1. **Install dependencies**
```bash
npm install
Get API Key

Sign up at OpenWeatherMap

Get your free API key

Setup environment

```bash
echo "VITE_API_KEY=your_key_here" > .env
Start development
```

```bash
npm run dev
```
## 🛠️ Tech Stack
React 19 + Vite

Redux Toolkit (State management)

Tailwind CSS (Styling)

Recharts (Data visualization)

OpenWeatherMap API

## 📁 Project Structure
text
src/
├── components/     # UI components
├── pages/          # Dashboard & City views
├── store/          # Redux state
├── services/       # Weather API
└── hooks/          # Custom hooks
🔧 Scripts
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview build
```
### 🌐 Deployment
Build: npm run build

Deploy dist folder to Netlify/Vercel

Add VITE_API_KEY to your platform's environment variables.
