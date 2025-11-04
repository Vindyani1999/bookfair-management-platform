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
  return (
    <button
      {...rest}
      className={`atom-button ${className}`}
      style={{
        backgroundColor: color ?? undefined,
        color: textColor,
        height: "45px",
        padding: `0 20px`,
        lineHeight: "45px",
        borderRadius: 10,
        ...style,
      }}
    >
      {iconLeft && <span className="atom-button__icon">{iconLeft}</span>}
      {children ?? label}
      {iconRight && <span className="atom-button__icon">{iconRight}</span>}
    </button>
  );
}
