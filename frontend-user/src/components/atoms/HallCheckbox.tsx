import type { HallCheckboxProps } from "../../utils/types";

export default function HallCheckbox({
  id,
  label,
  checked,
  onChange,
}: HallCheckboxProps) {
  return (
    <label className="hall-checkbox">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(id, e.target.checked)}
        aria-checked={checked}
        aria-label={label}
      />
      <span className="hall-label">{label}</span>
    </label>
  );
}
