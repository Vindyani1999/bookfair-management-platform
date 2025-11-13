import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  IconButton,
  InputAdornment,
  Typography,
  LinearProgress,
} from "@mui/material";
import StatusButton from "../atoms/StatusButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Close from "@mui/icons-material/Close";

export type AdminFormValues = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  password: string;
  confirmPassword: string;
};

type Props = {
  open: boolean;
  mode?: "add" | "edit";
  initial?: Partial<AdminFormValues>;
  onClose: () => void;
  onSave: (values: AdminFormValues) => void;
};

export default function AdminFormDialog({
  open,
  mode = "add",
  initial = {},
  onClose,
  onSave,
}: Props) {
  const [values, setValues] = useState<AdminFormValues>({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (open) {
      setValues({
        firstName: (initial.firstName as string) || "",
        lastName: (initial.lastName as string) || "",
        email: (initial.email as string) || "",
        contact: (initial.contact as string) || "",
        password: "",
        confirmPassword: "",
        id: initial.id,
      });
      setErrors({});
    }
  }, [open, initial]);

  function update<K extends keyof AdminFormValues>(
    key: K,
    value: AdminFormValues[K]
  ) {
    setValues((s) => ({ ...s, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!values.firstName.trim()) e.firstName = "First name is required";
    if (!values.lastName.trim()) e.lastName = "Last name is required";
    if (!values.email.trim()) e.email = "Email is required";
    // simple email regex
    if (values.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email))
      e.email = "Invalid email";
    if (!values.contact.trim()) e.contact = "Contact number is required";
    if (mode === "add") {
      if (!values.password) e.password = "Password is required";
      if (values.password !== values.confirmPassword)
        e.confirmPassword = "Passwords do not match";
    } else {
      // in edit mode password is optional but if provided must match
      if (values.password && values.password !== values.confirmPassword)
        e.confirmPassword = "Passwords do not match";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function passwordStrength(pw: string) {
    // Very small heuristic: length + variety of char classes
    let score = 0;
    if (!pw) return { score: 0, label: "" };
    if (pw.length >= 8) score += 30;
    if (pw.length >= 12) score += 10;
    if (/[0-9]/.test(pw)) score += 20;
    if (/[A-Z]/.test(pw)) score += 20;
    if (/[^A-Za-z0-9]/.test(pw)) score += 20;
    const clamped = Math.min(100, score);
    const label = clamped < 40 ? "Weak" : clamped < 70 ? "Fair" : "Strong";
    return { score: clamped, label };
  }

  function handleSubmit() {
    if (!validate()) return;
    onSave(values);
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ className: "admin-dialog-paper", sx: { width: 800 } }}
    >
      <DialogTitle sx={{ pb: 1, pt: 3, position: "relative" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            mb: 0.5,
          }}
        >
          {/* absolute-positioned header icon (overlaps the top edge) */}
          <Box
            className="admin-dialog-header-icon"
            aria-hidden
            sx={{
              position: "absolute",
              left: "50%",
              top: 15,
              transform: "translateX(-50%)",
            }}
          >
            {mode === "add" ? (
              <Box
                component="img"
                src="/adminadd.png"
                alt="Admins Icon"
                sx={{ height: 80 }}
              />
            ) : (
              <Box
                component="img"
                src="/adminedit.png"
                alt="Admins Icon"
                sx={{ height: 80 }}
              />
            )}
          </Box>

          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: 700, mt: 8 }}
          >
            {mode === "add" ? "Add New Admin" : "Edit Admin"}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: -1 }}>
            {mode === "add"
              ? "Create a new administrator with access to the admin portal."
              : "Update administrator details. Leave password blank to keep the existing password."}
          </Typography>
        </Box>

        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[600],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Box
          sx={{
            mt: 1,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          <Box>
            <TextField
              fullWidth
              label="First name"
              value={values.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              error={!!errors.firstName}
              helperText={errors.firstName || "Given name"}
              autoFocus
            />
          </Box>

          <Box>
            <TextField
              fullWidth
              label="Last name"
              value={values.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              error={!!errors.lastName}
              helperText={errors.lastName}
            />
          </Box>

          <Box>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={values.email}
              onChange={(e) => update("email", e.target.value)}
              error={!!errors.email}
              helperText={
                errors.email || "We'll send important notices to this address"
              }
            />
          </Box>

          <Box>
            <TextField
              fullWidth
              label="Contact number"
              value={values.contact}
              onChange={(e) => update("contact", e.target.value)}
              error={!!errors.contact}
              helperText={
                errors.contact || "Include country code if outside local area"
              }
            />
          </Box>

          <Box>
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              value={values.password}
              onChange={(e) => update("password", e.target.value)}
              error={!!errors.password}
              helperText={errors.password || "Min 8 characters recommended"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword((s) => !s)}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {/* password strength */}
            {values.password ? (
              <Box sx={{ mt: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={passwordStrength(values.password).score}
                  sx={{ height: 8, borderRadius: 2 }}
                />
                <Typography variant="caption" color="text.secondary">
                  {passwordStrength(values.password).label}
                </Typography>
              </Box>
            ) : null}
          </Box>

          <Box>
            <TextField
              fullWidth
              label="Confirm password"
              type={showConfirmPassword ? "text" : "password"}
              value={values.confirmPassword}
              onChange={(e) => update("confirmPassword", e.target.value)}
              error={!!errors.confirmPassword}
              helperText={
                errors.confirmPassword || "Re-enter password to confirm"
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowConfirmPassword((s) => !s)}
                      edge="end"
                      size="large"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        {/* Primary full-width confirm button using StatusButton */}
        <StatusButton
          status="confirm"
          onClick={handleSubmit}
          fullWidth
          size="large"
        >
          {mode === "add" ? "Confirm" : "Confirm"}
        </StatusButton>
      </DialogActions>
    </Dialog>
  );
}
