import './ResultCard.css';

export default function ResultCard({ result }) {
  if (!result) return null;

  const isChurn = result.prediction === 'churn';
  const probabilityPercent = Math.round(result.probability * 100);

  return (
    <section className="result-section" aria-live="polite">
      <div className="container">
        <div className={`result-card ${isChurn ? 'result-card--churn' : 'result-card--no-churn'}`}>
          <span className="result-card__label-tag">Prediction</span>

          <h2 className="result-card__title">{result.label}</h2>

          <div className="result-card__probability">
            <span className="result-card__probability-label">
              Estimated churn probability
            </span>
            <div className="result-card__bar-track">
              <div
                className="result-card__bar-fill"
                style={{ width: `${probabilityPercent}%` }}
                role="progressbar"
                aria-valuenow={probabilityPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Churn probability: ${probabilityPercent}%`}
              />
            </div>
            <span className="result-card__probability-value">{probabilityPercent}%</span>
          </div>

          <p className="result-card__message">
            {isChurn
              ? 'This customer shows characteristics associated with a higher likelihood of churn.'
              : 'This customer shows characteristics associated with a lower likelihood of churn.'}
          </p>

          <p className="result-card__disclaimer">
            Prediction is based on the customer information provided and patterns learned from the training dataset.
          </p>
        </div>
      </div>
    </section>
  );
}
