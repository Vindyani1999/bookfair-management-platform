import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import type { FormData } from "../../utils/types";
import "../../App.css";
import { Card, CardContent, Box, TextField, Typography } from "@mui/material";

type Props = {
  onBack?: () => void;
  onSubmit?: (data: FormData) => void; // not used when controlled by stepper
  onValidityChange?: (valid: boolean) => void;
};

type BookingFormHandle = {
  isValid: () => boolean;
  getData: () => FormData;
  validateAndShow: () => boolean;
};

function BookingFormInner(_props: Props, ref: React.Ref<BookingFormHandle>) {
  const [data, setData] = useState<FormData>({
    fullName: "",
    contactNumber: "",
    email: "",
    businessName: "",
    businessAddress: "",
    note: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormData, boolean>>
  >({});

  function handleChange<K extends keyof FormData>(key: K, value: string) {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function handleBlur<K extends keyof FormData>(key: K) {
    setTouched((t) => ({ ...t, [key]: true }));
    // validate this field immediately
    validateField(key, data[key] || "", true);
  }

  function validateField(key: keyof FormData, value: string, show = false) {
    const next = { ...errors };
    if (key === "fullName") {
      next.fullName = value.trim() ? undefined : "Full name is required";
    }
    if (key === "email") {
      if (!value.trim()) next.email = "Email is required";
      else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value))
        next.email = "Enter a valid email";
      else next.email = undefined;
    }
    if (key === "contactNumber") {
      next.contactNumber = value.trim()
        ? undefined
        : "Contact number is required";
    }
    if (show) setErrors(next);
    return !next[key];
  }

  function validate(showErrors = false) {
    const next: typeof errors = {};
    if (!data.fullName.trim()) next.fullName = "Full name is required";
    if (!data.email.trim()) next.email = "Email is required";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email))
      next.email = "Enter a valid email";
    if (!data.contactNumber.trim())
      next.contactNumber = "Contact number is required";
    if (showErrors) setErrors(next);
    return Object.keys(next).length === 0;
  }

  // report validity to parent whenever core fields change
  useEffect(() => {
    const ok = validate(false);
    if (_props.onValidityChange) _props.onValidityChange(ok);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.fullName, data.email, data.contactNumber]);

  useImperativeHandle(ref, () => ({
    isValid: () => validate(false),
    getData: () => data,
    validateAndShow: () => {
      // mark all as touched so MUI shows errors
      setTouched({
        fullName: true,
        email: true,
        contactNumber: true,
        businessName: true,
        businessAddress: true,
        note: true,
      });
      const ok = validate(true);
      return ok;
    },
  }));

  return (
    <Card
      elevation={3}
      className="booking-card"
      role="region"
      aria-label="Booking form"
    >
      <CardContent>
        <Typography
          variant="h6"
          component="h3"
          className="booking-title"
          gutterBottom
        >
          Fill your personal/business information.
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
          }}
        >
          <Box>
            <TextField
              label="Full Name"
              value={data.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              onBlur={() => handleBlur("fullName")}
              fullWidth
              required
              error={!!errors.fullName && !!touched.fullName}
              helperText={touched.fullName ? errors.fullName : ""}
            />
          </Box>

          <Box>
            <TextField
              label="Phone"
              value={data.contactNumber}
              onChange={(e) => handleChange("contactNumber", e.target.value)}
              onBlur={() => handleBlur("contactNumber")}
              fullWidth
              required
              error={!!errors.contactNumber && !!touched.contactNumber}
              helperText={touched.contactNumber ? errors.contactNumber : ""}
            />
          </Box>

          <Box sx={{ gridColumn: "1 / -1" }}>
            <TextField
              label="Email Address"
              value={data.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              fullWidth
              required
              error={!!errors.email && !!touched.email}
              helperText={touched.email ? errors.email : ""}
            />
          </Box>

          <Box>
            <TextField
              label="Business Name (Optional)"
              value={data.businessName}
              onChange={(e) => handleChange("businessName", e.target.value)}
              onBlur={() => handleBlur("businessName")}
              fullWidth
            />
          </Box>

          <Box>
            <TextField
              label="Business Address (Optional)"
              value={data.businessAddress}
              onChange={(e) => handleChange("businessAddress", e.target.value)}
              onBlur={() => handleBlur("businessAddress")}
              fullWidth
            />
          </Box>

          <Box sx={{ gridColumn: "1 / -1" }}>
            <TextField
              label="Note (Optional)"
              value={data.note}
              onChange={(e) => handleChange("note", e.target.value)}
              onBlur={() => handleBlur("note")}
              fullWidth
              multiline
              rows={4}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default forwardRef(BookingFormInner);
