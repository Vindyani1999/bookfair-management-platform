import type { HallCheckboxProps } from "../../utils/types";

export default function HallCheckbox({
  id,
  label,
  checked,
  onChange,
  onLabelClick,
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
      <span
        className="hall-label"
        onClick={() => onLabelClick?.(id)}
        role={onLabelClick ? "button" : undefined}
        tabIndex={onLabelClick ? 0 : undefined}
        onKeyDown={(e) => {
          if (onLabelClick && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onLabelClick(id);
          }
        }}
      >
        {label}
      </span>
    </label>
  );
}
