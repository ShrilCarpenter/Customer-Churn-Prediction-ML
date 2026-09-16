import './About.css';

export default function About() {
  return (
    <main className="about-page">
      <div className="container">
        <h1 className="about__title">About Customer Churn Prediction</h1>

        <section className="about__section">
          <p>
            Customer churn means a customer stops using a company's service. Identifying
            customers who are likely to churn helps businesses take proactive steps to
            retain them.
          </p>
          <p>
            This application uses machine learning to estimate the likelihood that a
            customer will churn based on customer demographics, services, contract
            details, and billing information.
          </p>
        </section>

        <section className="about__section">
          <h2 className="about__heading">How It Works</h2>
          <ol className="about__steps">
            <li>Enter customer information in the prediction form.</li>
            <li>Data is validated and processed by the server.</li>
            <li>A machine-learning model analyzes the input.</li>
            <li>A churn prediction with estimated probability is returned.</li>
          </ol>
        </section>

        <section className="about__section">
          <h2 className="about__heading">Dataset</h2>
          <p>
            The model is trained on the <strong>IBM Telco Customer Churn</strong> dataset,
            which contains historical data for approximately 7,000 customers including
            demographics, account information, services subscribed, and whether the
            customer churned.
          </p>
        </section>

        <section className="about__section">
          <h2 className="about__heading">Model</h2>
          <p>
            A Logistic Regression classifier is used with a full preprocessing pipeline
            that includes numerical scaling and categorical one-hot encoding. The model
            was selected by comparing multiple classifiers and evaluating precision,
            recall, F1-score, and ROC-AUC on held-out test data.
          </p>
        </section>

        <section className="about__section about__disclaimer-section">
          <h2 className="about__heading">Important Note</h2>
          <p>
            Predictions are estimates based on patterns in the training data and should
            not be treated as certainties. The model cannot perfectly predict every
            customer's behavior. Always combine model predictions with domain expertise
            and business context.
          </p>
        </section>

        <section className="about__section about__privacy-section">
          <h2 className="about__heading">Privacy</h2>
          <p>
            Customer information entered for prediction is processed in real time and
            is not stored. No user data is saved to any database or log.
          </p>
        </section>
      </div>
    </main>
  );
}
