import SelectableList from "./SelectableList";
import type { HallListProps } from "../../utils/types";

export default function HallList({
  halls,
  selected,
  onToggle,
  onSelectHall,
}: HallListProps) {
  return (
    <SelectableList
      items={halls}
      selected={selected}
      onToggle={onToggle}
      onItemClick={onSelectHall}
    />
  );
}
