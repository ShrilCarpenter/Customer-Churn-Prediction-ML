"""
Pydantic schemas for request validation and response serialization.
"""

from pydantic import BaseModel, Field, field_validator
from typing import Literal


class CustomerInput(BaseModel):
    """Validated customer data for churn prediction."""

    gender: Literal["Male", "Female"]
    senior_citizen: Literal["Yes", "No"]
    partner: Literal["Yes", "No"]
    dependents: Literal["Yes", "No"]
    tenure: int = Field(ge=0, le=72, description="Months with the company")

    phone_service: Literal["Yes", "No"]
    multiple_lines: Literal["Yes", "No", "No phone service"]
    internet_service: Literal["DSL", "Fiber optic", "No"]
    online_security: Literal["Yes", "No", "No internet service"]
    online_backup: Literal["Yes", "No", "No internet service"]
    device_protection: Literal["Yes", "No", "No internet service"]
    tech_support: Literal["Yes", "No", "No internet service"]
    streaming_tv: Literal["Yes", "No", "No internet service"]
    streaming_movies: Literal["Yes", "No", "No internet service"]

    contract: Literal["Month-to-month", "One year", "Two year"]
    paperless_billing: Literal["Yes", "No"]
    payment_method: Literal[
        "Electronic check",
        "Mailed check",
        "Bank transfer (automatic)",
        "Credit card (automatic)",
    ]
    monthly_charges: float = Field(ge=0, le=500, description="Monthly charge amount")
    total_charges: float = Field(ge=0, le=50000, description="Total charges to date")

    model_config = {"str_strip_whitespace": True}


class PredictionResponse(BaseModel):
    """Prediction result returned to the client."""

    prediction: Literal["churn", "no_churn"]
    label: str
    probability: float = Field(ge=0, le=1, description="Churn probability from model")
