/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  styled,
  ThemeProvider,
  StepConnector,
  stepConnectorClasses,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import theme from "../../utils/colorConfig";
import MapWithSelector from "../organisms/MapWithSelector";
import MapWithStalls from "../organisms/MapWithStalls";
import BookingForm from "../organisms/BookingForm";
import ReservationConfirmation from "../organisms/ReservationConfirmation";
import type { FormData } from "../../utils/types";

// ===== Custom Connector (line between steps) =====
const CustomConnector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 14,
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: "#a3a3a3",
    borderTopWidth: 2,
    borderRadius: 1,
  },
  [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
    borderColor: "#14b8a6",
  },
  [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
    borderColor: "#14b8a6",
  },
}));

// ===== Custom Step Icon (circle + tick) =====
const StepIconRoot = styled("div")<{ active?: boolean; completed?: boolean }>(
  ({ active, completed }) => ({
    backgroundColor: completed || active ? "#14b8a6" : "#d1d5db",
    color: "#fff",
    width: 18,
    height: 18,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    fontSize: "12px",
  })
);

function CustomStepIcon(props: any) {
  const { active, completed } = props;
  return (
    <StepIconRoot active={active} completed={completed}>
      {completed ? (
        <CheckIcon sx={{ fontSize: "12px", color: "#fff" }} />
      ) : null}
    </StepIconRoot>
  );
}

// ===== Custom Step Label =====
const CustomStepLabel = styled(StepLabel)(() => ({
  "& .MuiStepLabel-label": {
    marginTop: "2px !important", // minimal spacing to circle
    fontSize: "13px",
    fontWeight: 600,
    color: "#6b6b6b",
    textAlign: "center",
    whiteSpace: "normal",
  },
  "& .MuiStepLabel-label.Mui-active": {
    color: "#14b8a6",
  },
  "& .MuiStepLabel-label.Mui-completed": {
    color: "#14b8a6",
  },
}));

// ===== Custom Stepper =====
const CustomStepper = styled(Stepper)(() => ({
  backgroundColor: "#DACDC9",
  padding: "24px 32px",
  borderRadius: "12px",
  "& .MuiStep-root": {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  "@media (max-width: 600px)": {
    padding: "16px 8px",
    "& .MuiStepLabel-label": {
      fontSize: "11px",
      maxWidth: "60px",
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
      // require exactly one hall
      if (ids.length !== 1) {
        alert("Please select exactly one hall to continue.");
        return;
      }
      setSelectedHallIds(ids);
      setActiveStep(1);
      return;
    }
    if (activeStep === 1) {
      const ids = Object.keys(selectedStalls).filter((k) => selectedStalls[k]);
      // require at least one and at most 3 stalls
      if (ids.length < 1) {
        alert("Please select at least one stall before continuing.");
        return;
      }
      if (ids.length > 3) {
        alert("You can select up to 3 stalls only.");
        return;
      }
      setSelectedStallIds(ids);
      setActiveStep(2);
      return;
    }
    // For booking step (2) we move forward when booking form submits
    setActiveStep((prev) => Math.min(steps.length - 1, prev + 1));
  }

  function handleBack() {
    setActiveStep((prev) => Math.max(0, prev - 1));
  }

  function handleSubmitBooking(data: FormData) {
    setBookingData(data);
    const id = Math.random().toString(36).slice(2, 14);
    const date = new Date().toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    setReservationId(id);
    setReservationDate(date);
    setActiveStep(4); // jump to confirmation
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
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
        <Box sx={{ width: { xs: "95%", sm: "85%", md: "70%" }, mb: 6 }}>
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

        {/* Render the booking stepper content (controlled by this component) */}
        <Box sx={{ width: { xs: "95%", sm: "85%", md: "70%" }, mt: 4 }}>
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
            <BookingForm onBack={handleBack} onSubmit={handleSubmitBooking} />
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
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
            sx={{
              backgroundColor: "#000000",
              color: "#ffffff",
              px: 4,
              py: 1,
              borderRadius: "8px",
              textTransform: "none",
              "&:hover": { backgroundColor: "#1f1f1f" },
              fontSize: { xs: "13px", sm: "14px" },
            }}
          >
            ← Back
          </Button>
          <Button
            onClick={handleContinue}
            disabled={activeStep === steps.length - 1 || activeStep === 2}
            sx={{
              backgroundColor: "#000000",
              color: "#ffffff",
              px: 4,
              py: 1,
              borderRadius: "8px",
              textTransform: "none",
              "&:hover": { backgroundColor: "#1f1f1f" },
              fontSize: { xs: "13px", sm: "14px" },
            }}
          >
            Continue →
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default SteperComponent;
