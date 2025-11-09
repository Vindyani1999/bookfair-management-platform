import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import "../../App.css";

type Props = {
  // parent can listen to validity changes (to enable stepper Continue)
  onValidityChange?: (valid: boolean) => void;
};

type PaymentHandle = {
  isValid: () => boolean;
  getData: () => {
    cardHolder: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
  };
  validateAndShow: () => boolean;
};

function PaymentDetailsInner(_props: Props, ref: React.Ref<PaymentHandle>) {
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(showErrors = true) {
    const e: Record<string, string> = {};
    if (!cardHolder.trim()) e.cardHolder = "Card holder name is required";
    if (!cardNumber.trim() || cardNumber.replace(/\s+/g, "").length < 12)
      e.cardNumber = "Enter a valid card number";
    if (!expiry.trim()) e.expiry = "Expiry date is required";
    if (!cvv.trim() || cvv.trim().length < 3) e.cvv = "Enter CVV";
    if (showErrors) setErrors(e);
    return Object.keys(e).length === 0;
  }

  useImperativeHandle(ref, () => ({
    isValid: () => validate(false),
    getData: () => ({ cardHolder, cardNumber, expiry, cvv }),
    validateAndShow: () => validate(true),
  }));

  // report validity to parent whenever fields change
  useEffect(() => {
    const ok = validate(false);
    _props.onValidityChange?.(ok);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardHolder, cardNumber, expiry, cvv]);

  return (
    <div className="booking-card">
      <h3 className="booking-title">Payment Details</h3>

      <div className="booking-row two-cols">
        <div>
          <label className="booking-label">Card Holder Name</label>
          <input
            className="booking-input"
            value={cardHolder}
            onChange={(e) => setCardHolder(e.target.value)}
          />
          {errors.cardHolder && (
            <div className="booking-error">{errors.cardHolder}</div>
          )}
        </div>
        <div>
          <label className="booking-label">Card Number</label>
          <input
            className="booking-input"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
          {errors.cardNumber && (
            <div className="booking-error">{errors.cardNumber}</div>
          )}
        </div>
      </div>

      <div className="booking-row two-cols">
        <div>
          <label className="booking-label">Expiry (MM/YY)</label>
          <input
            className="booking-input"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
          />
        </div>
        <div>
          <label className="booking-label">CVV</label>
          <input
            className="booking-input"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
          />
          {errors.cvv && <div className="booking-error">{errors.cvv}</div>}
        </div>
      </div>

      {/* Buttons intentionally removed — navigation controlled by the stepper */}
    </div>
  );
}

export default forwardRef(PaymentDetailsInner);
