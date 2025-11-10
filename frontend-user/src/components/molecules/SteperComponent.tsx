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
import Confirmation from "../../pages/dash/Confirmation";
import PersonalDetails from "../../pages/dash/PersonalDetails";

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
      {completed ? <CheckIcon sx={{ fontSize: "12px", color: "#fff" }} /> : null}
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
  const [activeStep, setActiveStep] = useState(1);
  const steps = [
    "Select Hall(s)",
    "Select Stall(s)",
    "Personal/Business Info",
    "Payment Details",
    "Confirmation",
  ];



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
          py: 6,
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

        {/* Example Step Text Area */}
        <Box
          sx={{
            width: { xs: "90%", sm: "80%" },
            textAlign: "center",
            color: "#333",
            fontSize: { xs: "15px", sm: "16px" },
            fontWeight: 500,
            mt: 4,
          }}
        >
         <PersonalDetails/>
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
            onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
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
            onClick={() =>
              setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))
            }
            disabled={activeStep === steps.length - 1}
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
