"use client"

import { useEffect, useState } from "react"
import { Stepper, Step, StepLabel, Box, Button, styled, ThemeProvider } from "@mui/material"
import type { StepCount } from "../../utils/types"
import theme from "../../utils/colorConfig"

const CustomStepIcon = styled("div")(({ theme }) => ({
  display: "flex",
  height: 24,
  alignItems: "center",
  "& .MuiStepIcon-root": {
    fontSize: "1.4rem",
    color: "#999",
    "&.Mui-completed": {
      color: "#14b8a6",
    },
    "&.Mui-active": {
      color: "#14b8a6",
      fontSize: "1.4rem",
    },
  },
}))

const CustomStepLabel = styled(StepLabel)(({ theme }) => ({
  "& .MuiStepLabel-label": {
    marginTop: "8px !important",
    fontSize: "12px",
    fontWeight: 500,
    textAlign: "center",
    maxWidth: "100px",
    wordWrap: "break-word",
    whiteSpace: "normal",
    order: -1,
  },
  "& .MuiStepLabel-label.Mui-active": {
    color: "#14b8a6",
    fontWeight: 600,
  },
  "& .MuiStepLabel-label.Mui-completed": {
    color: "#14b8a6",
  },
}))

const CustomStepper = styled(Stepper)(({ theme }) => ({
  backgroundColor: "#e5e7eb",
  padding: "24px 32px",
  "& .MuiStep-root": {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  "& .MuiStepConnector-root": {
    top: "12px",
    left: "calc(-50% + 12px)",
    right: "calc(50% + 12px)",
    "& .MuiStepConnector-line": {
      borderColor: "#999",
      borderTopWidth: 2,
    },
  },
  "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line": {
    borderColor: "#14b8a6",
  },
  "& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line": {
    borderColor: "#14b8a6",
  },
}))

const SteperComponent = () => {
  const [activeStep, setActiveStep] = useState(0)

  const steps = ["Select Stall(s)", "Select Stall(s)", "Personal/Business Info", "Payment Details", "Confirmation"]

  return (
    <ThemeProvider theme={theme}>
    <Box sx={{ width: "100%", height:'100vh', bgcolor:'red' }}>
      <CustomStepper activeStep={activeStep} nonLinear>
        {steps.map((label, index) => (
          <Step key={index} completed={index < activeStep}>
            <CustomStepLabel>{label}</CustomStepLabel>
          </Step>
        ))}
      </CustomStepper>

      {/* Content Area */}
      <Box sx={{ p: 4, backgroundColor: "white" }}>
        <Box component="h2" sx={{ fontSize: "24px", fontWeight: 600, color: "#1f2937", mb: 3 }}>
          Step {activeStep + 1}: {steps[activeStep]}
        </Box>
        <Box sx={{ color: "#4b5563", mb: 4 }}>
          {activeStep === 0 && "step 1"}
          {activeStep === 1 && "step 1"}
          {activeStep === 2 && "step 1"}
          {activeStep === 3 && "step 1"}
          {activeStep === 4 && "step 1"}
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
          <Button
            onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
            disabled={activeStep === 0}
            variant="contained"
            sx={{
              backgroundColor: activeStep === 0 ? "#d1d5db" : "#374151",
              color: activeStep === 0 ? "#9ca3af" : "white",
              "&:hover": {
                backgroundColor: activeStep === 0 ? "#d1d5db" : "#1f2937",
              },
            }}
          >
            ← Back
          </Button>
          <Button
            onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
            disabled={activeStep === steps.length - 1}
            variant="contained"
            sx={{
              backgroundColor: activeStep === steps.length - 1 ? "#d1d5db" : "#14b8a6",
              color: activeStep === steps.length - 1 ? "#9ca3af" : "white",
              "&:hover": {
                backgroundColor: activeStep === steps.length - 1 ? "#d1d5db" : "#0d9488",
              },
            }}
          >
            Continue →
          </Button>
        </Box>
      </Box>
    </Box>
    </ThemeProvider>
  )
}

export default SteperComponent
