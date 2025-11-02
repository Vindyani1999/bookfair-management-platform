import HallCheckbox from "../atoms/HallCheckbox";
import type { HallListProps } from "../../utils/types";

function chunk<T>(arr: T[], size: number): T[][] {
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}

export default function HallList({ halls, selected, onToggle }: HallListProps) {
  const columns = chunk(halls, 10);

  return (
    <div className="hall-list-columns">
      {columns.map((col, ci) => (
        <div key={ci} className="hall-list-column">
          {col.map((h) => (
            <HallCheckbox
              key={h.id}
              id={h.id}
              label={h.label}
              checked={!!selected[h.id]}
              onChange={onToggle}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
