import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <p className="footer__text">
          Customer Churn Predictor &mdash; Built with scikit-learn &amp; FastAPI
        </p>
        <p className="footer__privacy">
          Customer information entered for prediction is not stored.
        </p>
      </div>
    </footer>
  );
}
