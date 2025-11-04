import { useState } from "react";
import type { FormData } from "../../utils/types";
import "../../App.css";

type Props = {
  onBack?: () => void;
  onSubmit?: (data: FormData) => void;
};

export default function BookingForm({ onSubmit }: Props) {
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

  function validate() {
    const next: typeof errors = {};
    if (!data.fullName.trim()) next.fullName = "Full name is required";
    if (!data.email.trim()) next.email = "Email is required";
    // very small email check
    if (data.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email))
      next.email = "Enter a valid email";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!validate()) return;
    onSubmit?.(data);
  }

  return (
    <form onSubmit={handleSubmit} className="booking-card">
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
          />
        </div>
      </div>

      <div className="booking-row">
        <label className="booking-label">Email Address</label>
        <input
          className="booking-input"
          value={data.email}
          onChange={(e) => handleChange("email", e.target.value)}
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
    </form>
  );
}
