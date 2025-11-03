import SelectableList from "./SelectableList";
import type { StallListProps } from "../../utils/types";

export default function StallList({
  stalls,
  selected,
  onToggle,
}: StallListProps) {
  return (
    <SelectableList items={stalls} selected={selected} onToggle={onToggle} />
  );
}
