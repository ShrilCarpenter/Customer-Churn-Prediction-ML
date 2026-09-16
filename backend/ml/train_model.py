"""
Customer Churn Prediction — Model Training Script

Trains a classification model on the IBM Telco Customer Churn dataset.
Compares Logistic Regression and Random Forest, selects the best by F1 (churn class).
Saves the complete preprocessing + model pipeline.
"""

import os
import sys
import warnings
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    classification_report,
    confusion_matrix,
)
import joblib

warnings.filterwarnings("ignore")

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(SCRIPT_DIR, "dataset", "Telco-Customer-Churn.csv")
MODEL_PATH = os.path.join(SCRIPT_DIR, "churn_model.pkl")

# ---------------------------------------------------------------------------
# Feature definitions
# ---------------------------------------------------------------------------
NUMERICAL_FEATURES = ["tenure", "MonthlyCharges", "TotalCharges"]

CATEGORICAL_FEATURES = [
    "gender",
    "SeniorCitizen",
    "Partner",
    "Dependents",
    "PhoneService",
    "MultipleLines",
    "InternetService",
    "OnlineSecurity",
    "OnlineBackup",
    "DeviceProtection",
    "TechSupport",
    "StreamingTV",
    "StreamingMovies",
    "Contract",
    "PaperlessBilling",
    "PaymentMethod",
]

TARGET = "Churn"


def load_and_clean(path: str) -> pd.DataFrame:
    """Load CSV and perform data cleaning."""
    print(f"Loading dataset from {path} ...")
    df = pd.read_csv(path)
    print(f"  Raw shape: {df.shape}")

    # Drop customerID — not a predictive feature
    df = df.drop(columns=["customerID"])

    # Convert TotalCharges to numeric (whitespace entries become NaN)
    df["TotalCharges"] = pd.to_numeric(df["TotalCharges"], errors="coerce")

    n_missing = df["TotalCharges"].isna().sum()
    if n_missing > 0:
        print(f"  Dropping {n_missing} rows with missing TotalCharges")
        df = df.dropna(subset=["TotalCharges"])

    # Convert SeniorCitizen from 0/1 int to "No"/"Yes" string
    # so the frontend and model pipeline use consistent string categories
    df["SeniorCitizen"] = df["SeniorCitizen"].map({0: "No", 1: "Yes"})

    print(f"  Cleaned shape: {df.shape}")
    print(f"  Target distribution:\n{df[TARGET].value_counts().to_string()}\n")
    return df


def build_pipeline(classifier) -> Pipeline:
    """Build a full preprocessing + model pipeline."""
    numerical_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
    ])

    categorical_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("encoder", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
    ])

    preprocessor = ColumnTransformer([
        ("num", numerical_pipeline, NUMERICAL_FEATURES),
        ("cat", categorical_pipeline, CATEGORICAL_FEATURES),
    ])

    return Pipeline([
        ("preprocessor", preprocessor),
        ("classifier", classifier),
    ])


def evaluate(pipeline, X_test, y_test, model_name: str) -> dict:
    """Evaluate a trained pipeline and print metrics."""
    y_pred = pipeline.predict(X_test)
    y_proba = pipeline.predict_proba(X_test)[:, 1]

    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, pos_label="Yes")
    rec = recall_score(y_test, y_pred, pos_label="Yes")
    f1 = f1_score(y_test, y_pred, pos_label="Yes")
    roc = roc_auc_score(y_test, y_proba)

    print(f"\n{'='*60}")
    print(f"  {model_name}")
    print(f"{'='*60}")
    print(f"  Accuracy:   {acc:.4f}")
    print(f"  Precision:  {prec:.4f}  (churn class)")
    print(f"  Recall:     {rec:.4f}  (churn class)")
    print(f"  F1-score:   {f1:.4f}  (churn class)")
    print(f"  ROC-AUC:    {roc:.4f}")
    print(f"\n  Confusion Matrix:")
    cm = confusion_matrix(y_test, y_pred, labels=["No", "Yes"])
    print(f"                Predicted No  Predicted Yes")
    print(f"  Actual No        {cm[0][0]:>5}         {cm[0][1]:>5}")
    print(f"  Actual Yes       {cm[1][0]:>5}         {cm[1][1]:>5}")
    print(f"\n  Classification Report:")
    print(classification_report(y_test, y_pred, target_names=["No Churn", "Churn"]))

    return {"name": model_name, "f1_churn": f1, "roc_auc": roc, "pipeline": pipeline}


def main():
    # 1. Load and clean
    df = load_and_clean(DATASET_PATH)

    # 2. Separate features and target
    X = df[NUMERICAL_FEATURES + CATEGORICAL_FEATURES]
    y = df[TARGET]

    # 3. Train/test split (stratified, 80/20)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"Train size: {len(X_train)}  |  Test size: {len(X_test)}")

    # 4. Define candidate models
    candidates = [
        ("Logistic Regression", LogisticRegression(
            max_iter=1000, random_state=42, class_weight="balanced"
        )),
        ("Random Forest", RandomForestClassifier(
            n_estimators=200, random_state=42, class_weight="balanced", n_jobs=-1
        )),
    ]

    # 5. Train and evaluate each
    results = []
    for name, clf in candidates:
        print(f"\nTraining {name} ...")
        pipeline = build_pipeline(clf)
        pipeline.fit(X_train, y_train)
        result = evaluate(pipeline, X_test, y_test, name)
        results.append(result)

    # 6. Select best model by F1 on churn class
    best = max(results, key=lambda r: r["f1_churn"])
    print(f"\n{'*'*60}")
    print(f"  SELECTED MODEL: {best['name']}")
    print(f"  F1 (churn): {best['f1_churn']:.4f}  |  ROC-AUC: {best['roc_auc']:.4f}")
    print(f"{'*'*60}")

    # 7. Save complete pipeline
    joblib.dump(best["pipeline"], MODEL_PATH)
    print(f"\nModel saved to: {MODEL_PATH}")
    print(f"File size: {os.path.getsize(MODEL_PATH) / 1024:.1f} KB")


if __name__ == "__main__":
    main()
