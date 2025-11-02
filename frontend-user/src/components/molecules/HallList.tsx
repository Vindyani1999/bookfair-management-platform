import HallCheckbox from '../atoms/HallCheckbox';
import type { Hall } from '../../utils/data';

type Props = {
  halls: Hall[];
  selected: Record<string, boolean>;
  onToggle: (id: string, checked: boolean) => void;
};

function chunk<T>(arr: T[], size: number): T[][] {
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}

export default function HallList({ halls, selected, onToggle }: Props) {
  const columns = chunk(halls, 10);

  return (
    <div className="hall-list-columns">
      {columns.map((col, ci) => (
        <div key={ci} className="hall-list-column">
          {col.map((h) => (
            <HallCheckbox key={h.id} id={h.id} label={h.label} checked={!!selected[h.id]} onChange={onToggle} />
          ))}
        </div>
      ))}
    </div>
  );
}
