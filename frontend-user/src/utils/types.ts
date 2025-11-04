import type { ImgHTMLAttributes } from "react";
import type { Hall, Stall } from "./data";

export type Props = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
};

export type HallCheckboxProps = {
  id: string;
  label: string;
  checked: boolean;
  onChange: (id: string, checked: boolean) => void;
  onLabelClick?: (id: string) => void;
};

export type HallListProps = {
  halls: Hall[];
  selected: Record<string, boolean>;
  onToggle: (id: string, checked: boolean) => void;
  onSelectHall?: (id: string) => void;
};

export type StallListProps = {
  stalls: Stall[];
  selected: Record<string, boolean>;
  onToggle: (id: string, checked: boolean) => void;
};

export type FormData = {
  fullName: string;
  contactNumber: string;
  email: string;
  businessName?: string;
  businessAddress?: string;
  note?: string;
};

export type ReservationConfirmationProps = {
  booking: FormData;
  selectedHallIds: string[];
  selectedStallIds: string[];
  reservationId: string;
  reservationDate: string;
};
