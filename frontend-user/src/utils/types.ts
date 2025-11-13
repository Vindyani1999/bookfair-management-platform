import type { ImgHTMLAttributes, JSX } from "react";
import type { Hall, Stall } from "./data";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { User } from "../types";

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

export type CustomButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Visible label (if children not provided) */
  label?: string;
  /** Background color (overrides default theme) */
  color?: string;
  /** Text color (defaults to white) */
  textColor?: string;
  /** Right-side icon (optional) */
  iconRight?: ReactNode;
  iconLeft?: ReactNode;
};

export type DrawerItem = {
  name: string;
  icon: JSX.Element;
  navPath: string;
};

export type StepCount = {
  step: number
};

export type LogoutConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string;
};

export type UserProfileData = {
  fullName: string;
  contactNumber: string;
  email: string;
  businessName?: string;
  businessAddress?: string;
};

export interface UpdateProfileData {
  contactPerson?: string;
  email?: string;
  phoneNumber?: string;
  businessName?: string;
  businessAddress?: string;
  password?: string;
}

export interface SettingsUpdateResponse {
  message: string;
  user: User;
}