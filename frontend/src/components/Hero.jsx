import './Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <h1 className="hero__title">Predict Customer Churn</h1>
        <p className="hero__subtitle">
          Enter customer details to estimate whether the customer is likely to leave the service.
        </p>
      </div>
    </section>
  );
}
