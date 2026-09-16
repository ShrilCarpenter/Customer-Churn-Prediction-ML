# Customer Churn Prediction System

An end-to-end Machine Learning web application that predicts telecommunications customer churn in real time. Built with a high-performance **FastAPI** backend and an intuitive, responsive **React (Vite)** frontend.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                 React + Vite Frontend                       │
│  - Modern Glassmorphism UI                                  │
│  - Instant validation & preset test cases                   │
│  - Live risk percentage & visual probability meter          │
└──────────────────────────────┬──────────────────────────────┘
                               │  POST /api/predict
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 FastAPI Backend Service                     │
│  - Scikit-learn Pipeline (ColumnTransformer + Classifier)   │
│  - Feature scaling, imputation & one-hot encoding           │
│  - In-memory model cached on lifespan startup               │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              IBM Telco Customer Churn Model                 │
│  - Trained on 7,000+ customer records                       │
│  - Evaluates Contract, Tenure, Charges, Services, etc.      │
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Frontend
- **Framework**: React 19 + Vite 6
- **Routing**: React Router DOM v7
- **Styling**: Vanilla CSS (CSS variables, responsive flexbox & grid, dark glassmorphic design)
- **Deployment**: [Vercel](https://vercel.com/)

### Backend & Machine Learning
- **API Framework**: FastAPI 0.115 + Pydantic v2
- **Server**: Uvicorn ASGI
- **ML Framework**: Scikit-Learn, Pandas, NumPy, Joblib
- **Model Pipeline**: `ColumnTransformer` (StandardScaler + OneHotEncoder) with candidate evaluation (Logistic Regression & Random Forest)
- **Deployment**: [Render](https://render.com/)

---

## Project Structure

```
Customer-Churn-Prediction/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py               # FastAPI application & CORS config
│   │   ├── schemas.py            # Pydantic input/output validation models
│   │   └── services/
│   │       ├── __init__.py
│   │       └── predictor.py      # ML pipeline loader & inference service
│   ├── ml/
│   │   ├── churn_model.pkl       # Trained ML pipeline artifact
│   │   ├── train_model.py        # Model training & benchmark script
│   │   └── dataset/
│   │       └── Telco-Customer-Churn.csv # IBM Telco dataset
│   ├── .env.example
│   ├── Procfile                  # Process definition for Render / PaaS
│   └── requirements.txt          # Python dependencies
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/           # Navbar, Hero, PredictionForm, ResultCard, Footer
│   │   ├── pages/                # Home and About pages
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   ├── vercel.json               # SPA routing rewrite rules for Vercel
│   └── vite.config.js
├── .gitignore
├── render.yaml                   # Infrastructure-as-code blueprint for Render
└── README.md
```

---

## Local Development Setup

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.10 or higher)
- **Git**

---

### 2. Backend Setup

1. Open a terminal and navigate to `backend`:
   ```bash
   cd backend
   ```

2. (Optional) Create and activate a virtual environment:
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. (Optional) Retrain the model if you modify training logic:
   ```bash
   python ml/train_model.py
   ```

5. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   - API will be live at: `http://localhost:8000`
   - Interactive Swagger Docs: `http://localhost:8000/docs`

---

### 3. Frontend Setup

1. In a separate terminal, navigate to `frontend`:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create `.env` (or copy `.env.example`):
     ```env
     VITE_API_URL=http://localhost:8000
     ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   - Frontend will be live at: `http://localhost:5173`

---

## Deployment Guide

### Part 1: Deploy Backend to Render

1. Sign in to [Render](https://dashboard.render.com/).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository: `Customer-Churn-Prediction-ML`.
4. Configure the Web Service settings:
   - **Name**: `customer-churn-api` *(or any preferred name)*
   - **Region**: Choose the closest region (e.g., Oregon, Frankfurt, Singapore)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: `Free`
5. Under **Environment Variables**, add:
   - `ALLOWED_ORIGINS`: `*` *(or your Vercel frontend URL once deployed)*
   - `PYTHON_VERSION`: `3.11.9`
6. Click **Create Web Service**.
7. Once deployment finishes, copy your live backend URL (e.g. `https://customer-churn-api.onrender.com`).
   - Verify it works by opening `https://<your-app>.onrender.com/` or `https://<your-app>.onrender.com/docs` in your browser.

> **Note on Free Render Tier**: Free instances spin down after 15 minutes of inactivity. When inactive, the first incoming request can take ~30–50 seconds to wake up the server.

---

### Part 2: Deploy Frontend to Vercel

1. Sign in to [Vercel](https://vercel.com/).
2. Click **Add New...** → **Project**.
3. Import the `Customer-Churn-Prediction-ML` repository.
4. In the **Configure Project** screen:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select `frontend`
   - **Build Command**: `npm run build` *(default)*
   - **Output Directory**: `dist` *(default)*
5. Expand **Environment Variables** and add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://<your-render-backend-url>.onrender.com` *(Do NOT include a trailing slash)*
6. Click **Deploy**.
7. In ~1 minute, your application will be live at your custom Vercel domain (e.g. `https://customer-churn-prediction-ml.vercel.app`)!

---

## API Endpoints

### 1. Root & Health Check
- `GET /` — Returns API service status, docs link, and version.
- `GET /api/health` — Returns `{"status": "ok"}`.

### 2. Predict Churn
- `POST /api/predict`
- **Request Body** (JSON):
```json
{
  "gender": "Female",
  "senior_citizen": "No",
  "partner": "Yes",
  "dependents": "No",
  "tenure": 12,
  "phone_service": "Yes",
  "multiple_lines": "No",
  "internet_service": "Fiber optic",
  "online_security": "No",
  "online_backup": "Yes",
  "device_protection": "No",
  "tech_support": "No",
  "streaming_tv": "No",
  "streaming_movies": "No",
  "contract": "Month-to-month",
  "paperless_billing": "Yes",
  "payment_method": "Electronic check",
  "monthly_charges": 70.35,
  "total_charges": 844.20
}
```

- **Response Body** (JSON):
```json
{
  "prediction": "churn",
  "label": "LIKELY TO CHURN",
  "probability": 0.6842
}
```

---

## License

This project is licensed under the MIT License.
