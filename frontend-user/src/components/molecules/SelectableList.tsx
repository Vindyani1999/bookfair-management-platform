import HallCheckbox from "../atoms/CustomCheckbox";

type Item = { id: string; label: string };

function chunk<T>(arr: T[], size: number): T[][] {
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}

type Props = {
  items: Item[];
  selected: Record<string, boolean>;
  onToggle: (id: string, checked: boolean) => void;
  onItemClick?: (id: string) => void;
  columnSize?: number;
};

export default function SelectableList({
  items,
  selected,
  onToggle,
  onItemClick,
  columnSize = 10,
}: Props) {
  const columns = chunk(items, columnSize);

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
              onLabelClick={onItemClick}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
