import { useState } from "react";
import MapWithSelector from "../components/organisms/MapWithSelector";
import MapWithStalls from "../components/organisms/MapWithStalls";
import BookingForm from "../components/organisms/BookingForm";
import type { FormData } from "../utils/types";
import ReservationConfirmation from "../components/organisms/ReservationConfirmation";
import { sampleReservation } from "../utils/data";

function TemporaryStepperPage() {
  //Temporary multi-step booking flow state
  const [step, setStep] = useState<number>(1);
  const [selectedHallIds, setSelectedHallIds] = useState<string[]>([]);
  const [selectedStallIds, setSelectedStallIds] = useState<string[]>([]);

  function handleNextFromSelector(ids: string[]) {
    setSelectedHallIds(ids);
    setStep(2);
  }

  function handleBack() {
    setStep((s) => Math.max(1, s - 1));
  }

  function handleNextFromStalls(ids: string[]) {
    setSelectedStallIds(ids);
    setStep(3);
  }

  function handleSubmitBooking(data: FormData) {
    // For now just log and reset to step 1 — replace with API call as needed.
    console.log("Booking submitted", {
      selectedHallIds,
      selectedStallIds,
      data,
    });
    // Optionally show a confirmation UI instead of navigating back
    setStep(1);
    setSelectedHallIds([]);
    setSelectedStallIds([]);
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        padding: 16,
      }}
    >
      {/* Temporary multi-step booking flow for demo purposes */}

      {/* Temporary fix for layout issue */}
      {step === 1 && <MapWithSelector onNext={handleNextFromSelector} />}

      {step === 2 && (
        <>
          <div style={{ marginBottom: 12 }}>
            <button onClick={handleBack} type="button" className="zoom-btn">
              ← Back
            </button>
          </div>
          <MapWithStalls
            selectedHallIds={selectedHallIds}
            onNext={handleNextFromStalls}
          />
        </>
      )}

      {step === 3 && (
        <>
          <div style={{ marginBottom: 12 }}>
            <button onClick={handleBack} type="button" className="zoom-btn">
              ← Back
            </button>
          </div>
          <BookingForm onBack={handleBack} onSubmit={handleSubmitBooking} />
          <ReservationConfirmation
            booking={sampleReservation.booking}
            selectedHallIds={selectedHallIds}
            selectedStallIds={selectedStallIds}
            reservationId={sampleReservation.id}
            reservationDate={sampleReservation.date}
          />
        </>
      )}
    </div>
  );
}

export default TemporaryStepperPage;
