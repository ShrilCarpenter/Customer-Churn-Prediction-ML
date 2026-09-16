import { useState } from 'react';
import './PredictionForm.css';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '');

const INITIAL_STATE = {
  gender: '',
  senior_citizen: '',
  partner: '',
  dependents: '',
  tenure: '',
  phone_service: '',
  multiple_lines: '',
  internet_service: '',
  online_security: '',
  online_backup: '',
  device_protection: '',
  tech_support: '',
  streaming_tv: '',
  streaming_movies: '',
  contract: '',
  paperless_billing: '',
  payment_method: '',
  monthly_charges: '',
  total_charges: '',
};

const EXAMPLE_DATA = {
  gender: 'Female',
  senior_citizen: 'No',
  partner: 'Yes',
  dependents: 'No',
  tenure: '12',
  phone_service: 'Yes',
  multiple_lines: 'No',
  internet_service: 'Fiber optic',
  online_security: 'No',
  online_backup: 'Yes',
  device_protection: 'No',
  tech_support: 'No',
  streaming_tv: 'Yes',
  streaming_movies: 'Yes',
  contract: 'Month-to-month',
  paperless_billing: 'Yes',
  payment_method: 'Electronic check',
  monthly_charges: '75.50',
  total_charges: '906.00',
};

function SelectField({ id, label, value, onChange, options, error }) {
  return (
    <div className="form-field">
      <label htmlFor={id} className="form-field__label">{label}</label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className={`form-field__select ${error ? 'form-field__select--error' : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {error && <span id={`${id}-error`} className="form-field__error" role="alert">{error}</span>}
    </div>
  );
}

function NumberField({ id, label, value, onChange, placeholder, error, min, step }) {
  return (
    <div className="form-field">
      <label htmlFor={id} className="form-field__label">{label}</label>
      <input
        id={id}
        name={id}
        type="number"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min || 0}
        step={step || 'any'}
        className={`form-field__input ${error ? 'form-field__input--error' : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && <span id={`${id}-error`} className="form-field__error" role="alert">{error}</span>}
    </div>
  );
}

export default function PredictionForm({ onResult }) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (apiError) setApiError('');
  };

  const validate = () => {
    const newErrors = {};

    // Check all select fields are filled
    const selectFields = [
      'gender', 'senior_citizen', 'partner', 'dependents',
      'phone_service', 'multiple_lines', 'internet_service',
      'online_security', 'online_backup', 'device_protection',
      'tech_support', 'streaming_tv', 'streaming_movies',
      'contract', 'paperless_billing', 'payment_method',
    ];

    selectFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required.';
      }
    });

    // Tenure
    if (formData.tenure === '') {
      newErrors.tenure = 'This field is required.';
    } else {
      const t = Number(formData.tenure);
      if (isNaN(t) || !Number.isInteger(t)) {
        newErrors.tenure = 'Please enter a whole number.';
      } else if (t < 0) {
        newErrors.tenure = 'Tenure cannot be negative.';
      } else if (t > 72) {
        newErrors.tenure = 'Tenure must be 72 months or less.';
      }
    }

    // Monthly Charges
    if (formData.monthly_charges === '') {
      newErrors.monthly_charges = 'This field is required.';
    } else {
      const mc = Number(formData.monthly_charges);
      if (isNaN(mc)) {
        newErrors.monthly_charges = 'Please enter a valid number.';
      } else if (mc < 0) {
        newErrors.monthly_charges = 'Monthly charges cannot be negative.';
      } else if (mc > 500) {
        newErrors.monthly_charges = 'Please enter a reasonable value.';
      }
    }

    // Total Charges
    if (formData.total_charges === '') {
      newErrors.total_charges = 'This field is required.';
    } else {
      const tc = Number(formData.total_charges);
      if (isNaN(tc)) {
        newErrors.total_charges = 'Please enter a valid number.';
      } else if (tc < 0) {
        newErrors.total_charges = 'Total charges cannot be negative.';
      } else if (tc > 50000) {
        newErrors.total_charges = 'Please enter a reasonable value.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) return;

    setLoading(true);
    onResult(null); // Clear previous result

    try {
      const payload = {
        ...formData,
        tenure: parseInt(formData.tenure, 10),
        monthly_charges: parseFloat(formData.monthly_charges),
        total_charges: parseFloat(formData.total_charges),
      };

      const response = await fetch(`${API_URL}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 422) {
          const data = await response.json();
          const detail = data.detail;
          if (Array.isArray(detail)) {
            const fieldErrors = {};
            detail.forEach((err) => {
              const field = err.loc?.[err.loc.length - 1];
              if (field) fieldErrors[field] = err.msg;
            });
            setErrors(fieldErrors);
          } else {
            setApiError('Invalid input. Please check your entries.');
          }
        } else {
          setApiError('Something went wrong while generating the prediction.');
        }
        return;
      }

      const result = await response.json();
      onResult(result);
    } catch (err) {
      console.error('Prediction request error:', err);
      setApiError(
        'Unable to reach the prediction service. If using a free tier on Render, the server may take 30–60 seconds to wake up from idle. Please wait a few moments and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_STATE);
    setErrors({});
    setApiError('');
    onResult(null);
  };

  const handleUseExample = () => {
    setFormData(EXAMPLE_DATA);
    setErrors({});
    setApiError('');
  };

  return (
    <section className="prediction-form-section">
      <div className="container">
        <form className="prediction-form" onSubmit={handleSubmit} noValidate>

          {/* Section A — Customer Details */}
          <fieldset className="form-section">
            <legend className="form-section__title">Customer Details</legend>
            <div className="form-grid">
              <SelectField id="gender" label="Gender" value={formData.gender} onChange={handleChange} options={['Male', 'Female']} error={errors.gender} />
              <SelectField id="senior_citizen" label="Senior Citizen" value={formData.senior_citizen} onChange={handleChange} options={['Yes', 'No']} error={errors.senior_citizen} />
              <SelectField id="partner" label="Partner" value={formData.partner} onChange={handleChange} options={['Yes', 'No']} error={errors.partner} />
              <SelectField id="dependents" label="Dependents" value={formData.dependents} onChange={handleChange} options={['Yes', 'No']} error={errors.dependents} />
              <NumberField id="tenure" label="Tenure (months)" value={formData.tenure} onChange={handleChange} placeholder="e.g. 12" min={0} step={1} error={errors.tenure} />
            </div>
          </fieldset>

          {/* Section B — Services */}
          <fieldset className="form-section">
            <legend className="form-section__title">Services</legend>
            <div className="form-grid">
              <SelectField id="phone_service" label="Phone Service" value={formData.phone_service} onChange={handleChange} options={['Yes', 'No']} error={errors.phone_service} />
              <SelectField id="multiple_lines" label="Multiple Lines" value={formData.multiple_lines} onChange={handleChange} options={['Yes', 'No', 'No phone service']} error={errors.multiple_lines} />
              <SelectField id="internet_service" label="Internet Service" value={formData.internet_service} onChange={handleChange} options={['DSL', 'Fiber optic', 'No']} error={errors.internet_service} />
              <SelectField id="online_security" label="Online Security" value={formData.online_security} onChange={handleChange} options={['Yes', 'No', 'No internet service']} error={errors.online_security} />
              <SelectField id="online_backup" label="Online Backup" value={formData.online_backup} onChange={handleChange} options={['Yes', 'No', 'No internet service']} error={errors.online_backup} />
              <SelectField id="device_protection" label="Device Protection" value={formData.device_protection} onChange={handleChange} options={['Yes', 'No', 'No internet service']} error={errors.device_protection} />
              <SelectField id="tech_support" label="Tech Support" value={formData.tech_support} onChange={handleChange} options={['Yes', 'No', 'No internet service']} error={errors.tech_support} />
              <SelectField id="streaming_tv" label="Streaming TV" value={formData.streaming_tv} onChange={handleChange} options={['Yes', 'No', 'No internet service']} error={errors.streaming_tv} />
              <SelectField id="streaming_movies" label="Streaming Movies" value={formData.streaming_movies} onChange={handleChange} options={['Yes', 'No', 'No internet service']} error={errors.streaming_movies} />
            </div>
          </fieldset>

          {/* Section C — Billing Information */}
          <fieldset className="form-section">
            <legend className="form-section__title">Billing Information</legend>
            <div className="form-grid">
              <SelectField id="contract" label="Contract" value={formData.contract} onChange={handleChange} options={['Month-to-month', 'One year', 'Two year']} error={errors.contract} />
              <SelectField id="paperless_billing" label="Paperless Billing" value={formData.paperless_billing} onChange={handleChange} options={['Yes', 'No']} error={errors.paperless_billing} />
              <SelectField id="payment_method" label="Payment Method" value={formData.payment_method} onChange={handleChange} options={['Electronic check', 'Mailed check', 'Bank transfer (automatic)', 'Credit card (automatic)']} error={errors.payment_method} />
              <NumberField id="monthly_charges" label="Monthly Charges ($)" value={formData.monthly_charges} onChange={handleChange} placeholder="e.g. 75.50" error={errors.monthly_charges} />
              <NumberField id="total_charges" label="Total Charges ($)" value={formData.total_charges} onChange={handleChange} placeholder="e.g. 906.00" error={errors.total_charges} />
            </div>
          </fieldset>

          {/* API Error */}
          {apiError && (
            <div className="form-api-error" role="alert">
              {apiError}
            </div>
          )}

          {/* Buttons */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn--primary"
              disabled={loading}
              id="predict-btn"
            >
              {loading ? 'Analyzing Customer...' : 'Predict Churn'}
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={handleReset}
              disabled={loading}
              id="reset-btn"
            >
              Reset
            </button>
            <button
              type="button"
              className="btn btn--tertiary"
              onClick={handleUseExample}
              disabled={loading}
              id="example-btn"
            >
              Use Example
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
