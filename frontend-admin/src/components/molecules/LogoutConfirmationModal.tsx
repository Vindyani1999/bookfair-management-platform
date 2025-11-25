import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  IconButton,
  CircularProgress,
} from "@mui/material";
import StatusButton from "../atoms/StatusButton";
import LogoutIcon from "@mui/icons-material/Logout";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Close from "@mui/icons-material/Close";
import type { LogoutConfirmationModalProps } from "../../types/types";

export default function LogoutConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  userName = "Admin",
}: LogoutConfirmationModalProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutSuccess, setLogoutSuccess] = useState(false);

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    
    // Simulate logout process
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLogoutSuccess(true);
    
    // Show success message briefly
    await new Promise((resolve) => setTimeout(resolve, 600));
    
    onConfirm();
  };

  const handleClose = () => {
    if (!isLoggingOut) {
      setLogoutSuccess(false);
      onClose();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "24px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
          bgcolor: "#ffffff",
          minHeight: "280px",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 800,
          fontSize: "24px",
          color: "#1F3A4A",
          bgcolor: "#F8F9FA",
          borderBottom: "none",
          px: 4,
          py: 3,
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: logoutSuccess
                ? "linear-gradient(135deg, #10b981 0%, #34d399 100%)"
                : "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: logoutSuccess
                ? "0 6px 16px rgba(16,185,129,0.3)"
                : "0 6px 16px rgba(245,158,11,0.3)",
              transition: "all 0.3s ease",
            }}
          >
            {logoutSuccess ? (
              <CheckCircleIcon sx={{ fontSize: 32, color: "#fff" }} />
            ) : (
              <WarningAmberIcon sx={{ fontSize: 32, color: "#fff" }} />
            )}
          </Box>

          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 700,
              color: logoutSuccess ? "#10b981" : "#f59e0b",
              transition: "color 0.3s ease",
            }}
          >
            {logoutSuccess ? "Logout Successful" : "Confirm Logout"}
          </Typography>
        </Box>

        {!isLoggingOut && !logoutSuccess && (
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 12,
              top: 12,
              color: "#64748b",
              "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
            }}
          >
            <Close />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 3, bgcolor: "#F8F9FA", px: 4 }}>
        {logoutSuccess ? (
          <Box sx={{ textAlign: "center" }}>
            <Typography
              sx={{
                color: "#10b981",
                fontWeight: 600,
                fontSize: "15px",
                mb: 1,
              }}
            >
              You have been successfully logged out
            </Typography>
            <Typography
              sx={{
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              Redirecting to login page...
            </Typography>
          </Box>
        ) : (
          <>
            <Typography
              sx={{
                color: "#475569",
                mb: 2,
                textAlign: "center",
                fontSize: "15px",
              }}
            >
              Are you sure you want to logout, {userName}?
            </Typography>
            <Typography
              sx={{
                color: "#94a3b8",
                fontSize: "14px",
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              You will need to log in again to access the admin dashboard
            </Typography>
          </>
        )}
      </DialogContent>

      {!logoutSuccess && (
        <DialogActions
          sx={{
            p: 2.5,
            gap: 2,
            display: "flex",
            justifyContent: "center",
            bgcolor: "#F8F9FA",
            borderTop: "1px solid #E2E8F0",
          }}
        >
          <StatusButton
            status="cancel"
            onClick={handleClose}
            disabled={isLoggingOut}
            sx={{ minWidth: 120 }}
          >
            Cancel
          </StatusButton>

          <StatusButton
            status="delete"
            onClick={handleConfirmLogout}
            disabled={isLoggingOut}
            startIcon={
              isLoggingOut ? (
                <CircularProgress size={16} sx={{ color: "#fff" }} />
              ) : (
                <LogoutIcon />
              )
            }
            sx={{ minWidth: 120 }}
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </StatusButton>
        </DialogActions>
      )}
    </Dialog>
  );
}