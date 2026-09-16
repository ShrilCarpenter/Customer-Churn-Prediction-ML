import { useState } from 'react';
import Hero from '../components/Hero';
import PredictionForm from '../components/PredictionForm';
import ResultCard from '../components/ResultCard';

export default function Home() {
  const [result, setResult] = useState(null);

  return (
    <main>
      <Hero />
      <PredictionForm onResult={setResult} />
      <ResultCard result={result} />
    </main>
  );
}
