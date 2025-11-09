import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import type { FormData } from "../../utils/types";
import "../../App.css";

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

  function handleChange<K extends keyof FormData>(key: K, value: string) {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  // report validity to parent whenever form data changes
  useEffect(() => {
    // do a silent validation and call parent callback if provided
    const ok = validate(false);
    if (_props.onValidityChange) _props.onValidityChange(ok);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data.fullName,
    data.email,
    data.contactNumber,
    data.businessName,
    data.businessAddress,
    data.note,
  ]);

  function validate(showErrors = false) {
    const next: typeof errors = {};
    if (!data.fullName.trim()) next.fullName = "Full name is required";
    if (!data.email.trim()) next.email = "Email is required";
    if (!data.contactNumber.trim())
      next.contactNumber = "Contact number is required";
    // very small email check
    if (data.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email))
      next.email = "Enter a valid email";
    if (showErrors) setErrors(next);
    return Object.keys(next).length === 0;
  }

  useImperativeHandle(ref, () => ({
    isValid: () => validate(false),
    getData: () => data,
    validateAndShow: () => validate(true),
  }));

  return (
    <div className="booking-card">
      <h3 className="booking-title">
        Fill your personal/business information.
      </h3>

      <div className="booking-row two-cols">
        <div>
          <label className="booking-label">Full Name</label>
          <input
            className="booking-input"
            value={data.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            required
          />
          {errors.fullName && (
            <div className="booking-error">{errors.fullName}</div>
          )}
        </div>

        <div>
          <label className="booking-label">Contact Number</label>
          <input
            className="booking-input"
            value={data.contactNumber}
            onChange={(e) => handleChange("contactNumber", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="booking-row">
        <label className="booking-label">Email Address</label>
        <input
          className="booking-input"
          value={data.email}
          onChange={(e) => handleChange("email", e.target.value)}
          required
        />
        {errors.email && <div className="booking-error">{errors.email}</div>}
      </div>

      <div className="booking-row two-cols">
        <div>
          <label className="booking-label">Business Name (Optional)</label>
          <input
            className="booking-input"
            value={data.businessName}
            onChange={(e) => handleChange("businessName", e.target.value)}
          />
        </div>

        <div>
          <label className="booking-label">Business Address (Optional)</label>
          <input
            className="booking-input"
            value={data.businessAddress}
            onChange={(e) => handleChange("businessAddress", e.target.value)}
          />
        </div>
      </div>

      <div className="booking-row">
        <label className="booking-label">Note (Optional)</label>
        <textarea
          className="booking-textarea"
          value={data.note}
          onChange={(e) => handleChange("note", e.target.value)}
          rows={4}
        />
      </div>

      {/* Buttons removed - navigation controlled by the stepper */}
    </div>
  );
}

export default forwardRef(BookingFormInner);
