type Props = {
  id: string;
  label: string;
  checked: boolean;
  onChange: (id: string, checked: boolean) => void;
};

export default function HallCheckbox({ id, label, checked, onChange }: Props) {
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
