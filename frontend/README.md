# Customer Churn Predictor — Frontend

The user-facing client application for the Customer Churn Prediction System, built with **React 19**, **Vite**, and custom responsive CSS.

> 🌐 **Live URL**: [https://customer-churn-prediction-usingml.vercel.app/](https://customer-churn-prediction-usingml.vercel.app/)

---

## Features

- **Dynamic Form**: 19 customer features organized into intuitive demographic, service, and billing sections.
- **One-Click Pre-fill**: "Fill Example Profile" button for rapid demonstration and validation.
- **Visual Probability Meter**: Animated percentage gauge with color-coded risk levels.
- **Client-Side Routing**: Built with `react-router-dom` with routes for `/` (Prediction Tool) and `/about` (Model Overview & Insights).
- **Vercel SPA Ready**: Configured with `vercel.json` rewrite rules for seamless routing and page refreshes.

---

## Environment Variables

| Variable | Description | Default (Local) | Production (Vercel) |
| :--- | :--- | :--- | :--- |
| `VITE_API_URL` | Base URL of the FastAPI backend service | `http://localhost:8000` | `https://<your-render-service>.onrender.com` |

---

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```
