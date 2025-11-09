import type { CustomButtonProps } from "../../utils/types";

export default function CustomButton({
  label,
  children,
  color,
  textColor = "#fff",
  iconRight,
  iconLeft,
  style,
  className = "",
  ...rest
}: CustomButtonProps) {
  const isDisabled = Boolean(
    (rest as unknown as { disabled?: boolean }).disabled
  );

  return (
    <button
      {...rest}
      className={`atom-button ${className}`}
      style={{
        backgroundColor: isDisabled ? "#bdbdbd" : color ?? undefined,
        color: isDisabled ? "#757575" : textColor,
        height: "45px",
        padding: `0 20px`,
        lineHeight: "45px",
        borderRadius: 10,
        cursor: isDisabled ? "not-allowed" : undefined,
        opacity: isDisabled ? 0.7 : undefined,
        boxShadow: isDisabled ? "none" : undefined,
        ...style,
      }}
    >
      {iconLeft && <span className="atom-button__icon">{iconLeft}</span>}
      {children ?? label}
      {iconRight && <span className="atom-button__icon">{iconRight}</span>}
    </button>
  );
}
