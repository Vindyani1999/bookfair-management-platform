import "./App.css";
import { useState } from "react";
import MapWithSelector from "./components/organisms/MapWithSelector";
import MapWithStalls from "./components/organisms/MapWithStalls";

export default function App() {
  const [step, setStep] = useState<number>(1);
  const [selectedHallIds, setSelectedHallIds] = useState<string[]>([]);

  function handleNextFromSelector(ids: string[]) {
    setSelectedHallIds(ids);
    setStep(2);
  }

  function handleBack() {
    setStep((s) => Math.max(1, s - 1));
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Book Fair Management System</h1>
      {/* Temporary fix for layout issue */}
      {step === 1 && <MapWithSelector onNext={handleNextFromSelector} />}

      {step === 2 && (
        <>
          <div style={{ marginBottom: 12 }}>
            <button onClick={handleBack} type="button" className="zoom-btn">
              ← Back
            </button>
          </div>
          <MapWithStalls selectedHallIds={selectedHallIds} />
        </>
      )}
    </main>
  );
}
