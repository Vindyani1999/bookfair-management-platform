import type { ImgHTMLAttributes } from "react";
import type { Hall } from "./data";

export type Props = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
};

export type HallCheckboxProps = {
  id: string;
  label: string;
  checked: boolean;
  onChange: (id: string, checked: boolean) => void;
};

export type HallListProps = {
  halls: Hall[];
  selected: Record<string, boolean>;
  onToggle: (id: string, checked: boolean) => void;
};
