"""
Predictor service — loads the trained ML pipeline and runs predictions.
"""

import os
import pandas as pd
import joblib
from app.schemas import CustomerInput, PredictionResponse

# Path to saved model
MODEL_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "..", "..", "ml", "churn_model.pkl"
)

# Module-level model reference (loaded once at startup)
_pipeline = None


def load_model() -> None:
    """Load the trained pipeline from disk. Called once at application startup."""
    global _pipeline
    resolved = os.path.normpath(MODEL_PATH)
    if not os.path.exists(resolved):
        raise FileNotFoundError(
            f"Model file not found at {resolved}. Run train_model.py first."
        )
    _pipeline = joblib.load(resolved)
    print(f"Model loaded from {resolved}")


def predict(data: CustomerInput) -> PredictionResponse:
    """Run the model pipeline on a single customer and return the prediction."""
    if _pipeline is None:
        raise RuntimeError("Model not loaded. Call load_model() first.")

    # Build a single-row DataFrame with column names matching training data
    row = {
        "gender": data.gender,
        "SeniorCitizen": data.senior_citizen,
        "Partner": data.partner,
        "Dependents": data.dependents,
        "tenure": data.tenure,
        "PhoneService": data.phone_service,
        "MultipleLines": data.multiple_lines,
        "InternetService": data.internet_service,
        "OnlineSecurity": data.online_security,
        "OnlineBackup": data.online_backup,
        "DeviceProtection": data.device_protection,
        "TechSupport": data.tech_support,
        "StreamingTV": data.streaming_tv,
        "StreamingMovies": data.streaming_movies,
        "Contract": data.contract,
        "PaperlessBilling": data.paperless_billing,
        "PaymentMethod": data.payment_method,
        "MonthlyCharges": data.monthly_charges,
        "TotalCharges": data.total_charges,
    }
    df = pd.DataFrame([row])

    # Predict
    prediction = _pipeline.predict(df)[0]  # "Yes" or "No"
    proba = _pipeline.predict_proba(df)[0]  # [P(No), P(Yes)]

    churn_prob = float(proba[1])  # probability of "Yes" (churn)

    if prediction == "Yes":
        return PredictionResponse(
            prediction="churn",
            label="LIKELY TO CHURN",
            probability=round(churn_prob, 4),
        )
    else:
        return PredictionResponse(
            prediction="no_churn",
            label="NOT LIKELY TO CHURN",
            probability=round(churn_prob, 4),
        )
