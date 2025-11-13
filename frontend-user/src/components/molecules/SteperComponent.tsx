/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  styled,
  ThemeProvider,
  StepConnector,
  stepConnectorClasses,
} from "@mui/material";
import CustomButton from "../atoms/CustomButton";
import CheckIcon from "@mui/icons-material/Check";
import theme from "../../utils/colorConfig";
import MapWithSelector from "../organisms/MapWithSelector";
import MapWithStalls from "../organisms/MapWithStalls";
import BookingForm from "../organisms/BookingForm";
import PaymentDetails from "../organisms/PaymentDetails";
import ReservationConfirmation from "../organisms/ReservationConfirmation";
import StatCard from "../atoms/StatCard";
import stats from "../../utils/data";
import type { FormData } from "../../utils/types";

// ===== Custom Connector (line between steps) =====
const CustomConnector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 18,
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: "#e6e6e6",
    borderTopWidth: 3,
    borderRadius: 2,
    transition: "border-color 0.25s ease",
  },
  [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
    borderColor: "#0ea5a4",
  },
  [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
    borderColor: "#0ea5a4",
  },
}));

// ===== Custom Step Icon (circle + tick) =====
// const StepIconRoot = styled("div")<{ active?: boolean; completed?: boolean }>(
//   ({ active, completed }) => ({
//     backgroundColor: completed || active ? "#14b8a6" : "#d1d5db",
//     color: "#fff",
//     width: 18,
//     height: 18,
//     borderRadius: "50%",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     transition: "all 0.3s ease",
//     fontSize: "12px",
//   })
// );

// ===== Custom Step Icon (circle + tick) =====
const StepIconRoot = styled("div", {
  shouldForwardProp: (prop) => prop !== "active" && prop !== "completed",
})<{ active?: boolean; completed?: boolean }>(
  ({ active, completed }) => ({
    backgroundColor: completed || active ? "#0ea5a4" : "#ffffff",
    color: completed || active ? "#fff" : "#6b7280",
    width: 28,
    height: 28,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.25s ease",
    fontSize: "14px",
    boxShadow:
      completed || active
        ? "0 4px 10px rgba(14,165,164,0.16)"
        : "0 1px 2px rgba(15,23,42,0.04)",
    border: completed || active ? "none" : "2px solid #eef2f7",
  })
);

function CustomStepIcon(props: any) {
  const { active, completed, icon } = props;
  return (
    <StepIconRoot active={active} completed={completed}>
      {completed ? (
        <CheckIcon sx={{ fontSize: "14px", color: "#fff" }} />
      ) : (
        <span style={{ fontSize: 13, fontWeight: 700 }}>{icon}</span>
      )}
    </StepIconRoot>
  );
}

// ===== Custom Step Label =====
const CustomStepLabel = styled(StepLabel)(() => ({
  "& .MuiStepLabel-label": {
    marginTop: "6px !important",
    fontSize: "13px",
    fontWeight: 600,
    color: "#6b7280",
    textAlign: "center",
    whiteSpace: "normal",
    lineHeight: 1.2,
    maxWidth: 120,
  },
  "& .MuiStepLabel-label.Mui-active": {
    color: "#0f766e",
    fontWeight: 700,
  },
  "& .MuiStepLabel-label.Mui-completed": {
    color: "#0f766e",
  },
}));

// ===== Custom Stepper =====
const CustomStepper = styled(Stepper)(() => ({
  backgroundColor: "transparent",
  padding: "8px 0",
  "& .MuiStep-root": {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  "@media (max-width: 600px)": {
    padding: "8px 4px",
    "& .MuiStepLabel-label": {
      fontSize: "11px",
      maxWidth: "72px",
    },
  },
}));

// ===== Component =====
const SteperComponent = () => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    "Select Hall(s)",
    "Select Stall(s)",
    "Personal/Business Info",
    "Payment Details",
    "Confirmation",
  ];

  // Booking flow state managed by the stepper (single source of truth)
  const [selectedHalls, setSelectedHalls] = useState<Record<string, boolean>>(
    {}
  );
  const [selectedStalls, setSelectedStalls] = useState<Record<string, boolean>>(
    {}
  );
  const [selectedHallIds, setSelectedHallIds] = useState<string[]>([]);
  const [selectedStallIds, setSelectedStallIds] = useState<string[]>([]);
  const [bookingData, setBookingData] = useState<FormData | null>(null);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [reservationDate, setReservationDate] = useState<string | null>(null);
  // ref to interact with the controlled BookingForm (forwardRef)
  const bookingFormRef = useRef<any>(null);
  const [bookingFormValid, setBookingFormValid] = useState<boolean>(false);
  // payment form ref & validity
  const paymentFormRef = useRef<any>(null);
  const [paymentFormValid, setPaymentFormValid] = useState<boolean>(false);

  function toggleHall(id: string, checked: boolean) {
    // Allow only one hall to be selected. Selecting a hall will deselect others.
    if (checked) {
      setSelectedHalls({ [id]: true });
    } else {
      setSelectedHalls({});
    }
  }

  function toggleStall(id: string, checked: boolean) {
    // Allow up to 3 stalls. If trying to select beyond limit, ignore and notify.
    setSelectedStalls((s) => {
      const current = Object.keys(s).filter((k) => s[k]).length;
      if (checked && current >= 3) {
        // Notify user; parent UI can replace with nicer toast
        alert("You can select up to 3 stalls only.");
        return s;
      }
      return { ...s, [id]: checked };
    });
  }

  function handleContinue() {
    // Behavior depends on current activeStep
    if (activeStep === 0) {
      const ids = Object.keys(selectedHalls).filter((k) => selectedHalls[k]);
      setSelectedHallIds(ids);
      setActiveStep(1);
      return;
    }
    if (activeStep === 1) {
      const ids = Object.keys(selectedStalls).filter((k) => selectedStalls[k]);
      setSelectedStallIds(ids);
      setActiveStep(2);
      return;
    }
    if (activeStep === 2) {
      // Validate booking form via ref and advance to payment if valid
      if (bookingFormRef.current?.isValid()) {
        const data = bookingFormRef.current.getData();
        handleSubmitBooking(data);
      } else {
        bookingFormRef.current?.validateAndShow();
      }
      return;
    }
    if (activeStep === 3) {
      // Validate payment form and advance to confirmation if valid
      if (paymentFormRef.current?.isValid()) {
        // we could collect payment data here: const p = paymentFormRef.current.getData();
        handleSubmitPayment();
      } else {
        paymentFormRef.current?.validateAndShow();
      }
      return;
    }
    // If on final step, finish the flow
    if (activeStep === steps.length - 1) {
      handleFinish();
      return;
    }

    // For other steps advance one step
    setActiveStep((prev) => Math.min(steps.length - 1, prev + 1));
  }

  function handleBack() {
    setActiveStep((prev) => Math.max(0, prev - 1));
  }

  function handleSubmitBooking(data: FormData) {
    // save booking data and advance to payment step
    setBookingData(data);
    setActiveStep(3);
  }

  function handleFinish() {
    // reset flow and redirect to dashboard (or reset to step 0)
    setSelectedHalls({});
    setSelectedStalls({});
    setSelectedHallIds([]);
    setSelectedStallIds([]);
    setBookingData(null);
    setReservationId(null);
    setReservationDate(null);
    setBookingFormValid(false);
    setPaymentFormValid(false);
    setActiveStep(0);
    // navigate to the reservations page on localhost:3000
    try {
      window.location.href = "http://localhost:3000/my-reservation";
    } catch {
      /* ignore */
    }
  }

  function handleSubmitPayment() {
    // simulate payment success, create reservation and go to confirmation
    const id = Math.random().toString(36).slice(2, 14);
    const date = new Date().toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    setReservationId(id);
    setReservationDate(date);
    setActiveStep(4);
  }

  // compute whether the `Continue` button should be enabled for current step
  const selectedHallCount = Object.keys(selectedHalls).filter((k) =>
    Boolean(selectedHalls[k])
  ).length;
  const selectedStallCount = Object.keys(selectedStalls).filter((k) =>
    Boolean(selectedStalls[k])
  ).length;

  let canContinue = true;
  if (activeStep === 0) {
    // require exactly one hall selected to proceed
    canContinue = selectedHallCount === 1;
  } else if (activeStep === 1) {
    // require 1..3 stalls selected
    canContinue = selectedStallCount >= 1 && selectedStallCount <= 3;
  } else if (activeStep === 2) {
    // require booking form to be valid before enabling Continue
    canContinue = bookingFormValid;
  } else if (activeStep === 3) {
    // require payment form valid before enabling Continue
    canContinue = paymentFormValid;
  } else if (activeStep === steps.length - 1) {
    // final step: enable Finish (Continue becomes Finish)
    canContinue = true;
  } else {
    canContinue = activeStep < steps.length - 1;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          backgroundColor: "#DACDC9",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          py: 2,
          position: "relative",
        }}
      >
        {/* Stepper */}
        <Box
          sx={{
            width: { xs: "95%", sm: "85%", md: "70%" },
            mb: 3,
            // keep the stepper pinned to the top of the viewport
            position: "sticky",
            top: 0,
            zIndex: 1200,
            // ensure sticky area has same background so it appears seamless
            backgroundColor: "#DACDC9",
            // small horizontal padding on very small screens
            px: { xs: 2, sm: 0 },
          }}
        >
          <CustomStepper
            activeStep={activeStep}
            alternativeLabel
            connector={<CustomConnector />}
          >
            {steps.map((label, index) => (
              <Step key={index} completed={index < activeStep}>
                <CustomStepLabel StepIconComponent={CustomStepIcon}>
                  {label}
                </CustomStepLabel>
              </Step>
            ))}
          </CustomStepper>
        </Box>

        {/* Stat cards row (visible only on the first step: Select Hall(s)) */}
        {activeStep === 0 && (
          <Box
            sx={{
              width: { xs: "95%", sm: "85%", md: "70%" },
              display: "flex",
              gap: 5,
              justifyContent: "center",
              mb: 3,
            }}
          >
            <StatCard title="Total Stalls" value={stats.totalStalls} />
            <StatCard title="Available Stalls" value={stats.availableStalls} />
            <StatCard title="Reserved Stalls" value={stats.reservedStalls} />
          </Box>
        )}

        {/* Render the booking stepper content (controlled by this component) */}
        <Box
          sx={{
            width: { xs: "95%", sm: "85%", md: "70%" },
            mt: 0,
            // let the content area scroll while header remains sticky
            flex: 1,
            overflowY: "auto",
            pb: 12,
          }}
        >
          {activeStep === 0 && (
            <MapWithSelector selected={selectedHalls} onToggle={toggleHall} />
          )}

          {activeStep === 1 && (
            <MapWithStalls
              selectedHallIds={selectedHallIds}
              selected={selectedStalls}
              onToggle={toggleStall}
            />
          )}

          {activeStep === 2 && (
            <BookingForm
              ref={bookingFormRef}
              onValidityChange={setBookingFormValid}
            />
          )}

          {activeStep === 3 && (
            <PaymentDetails
              ref={paymentFormRef}
              onValidityChange={setPaymentFormValid}
            />
          )}

          {activeStep === 4 &&
            reservationId &&
            reservationDate &&
            bookingData && (
              <ReservationConfirmation
                booking={bookingData}
                selectedHallIds={selectedHallIds}
                selectedStallIds={selectedStallIds}
                reservationId={reservationId}
                reservationDate={reservationDate}
              />
            )}
        </Box>

        {/* Fixed Bottom Buttons */}
        <Box
          sx={{
            position: "fixed",
            bottom: 24,
            right: { xs: "50%", sm: 32 },
            transform: { xs: "translateX(50%)", sm: "none" },
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          {activeStep > 0 && activeStep < steps.length - 1 && (
            <CustomButton
              onClick={handleBack}
              color="#000"
              textColor="#fff"
              style={{ padding: "0 24px" }}
            >
              ← Back
            </CustomButton>
          )}
          <CustomButton
            onClick={handleContinue}
            disabled={!canContinue}
            color="#000"
            textColor="#fff"
            style={{ padding: "0 24px" }}
          >
            {activeStep === steps.length - 1 ? "Finish" : "Continue →"}
          </CustomButton>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default SteperComponent;
