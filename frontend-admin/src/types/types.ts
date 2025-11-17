import type { CSSProperties, ReactNode } from "react";

export type Column<
  T extends Record<string, unknown> = Record<string, unknown>
> = {
  id: string; // unique id for column
  header: string; // header label
  field?: keyof T | string; // key in row object to display by default
  align?: "left" | "right" | "center";
  sortable?: boolean;
  width?: number | string;
  render?: (row: T) => React.ReactNode; // optional custom renderer
};

export type Props<T extends Record<string, unknown> = Record<string, unknown>> =
  {
    columns: Column<T>[];
    rows: T[];
    showSearch?: boolean;
    searchPlaceholder?: string;
    rowsPerPageOptions?: number[];
    defaultRowsPerPage?: number;
    onRowClick?: (row: T) => void;
    toolbarActions?: React.ReactNode; // slot for buttons/actions in toolbar
    dense?: boolean;
    showPagination?: boolean;
    emptyState?: React.ReactNode;
    /**
     * If true, ReusableTable will include any fields found on the row objects
     * that are not already present in the `columns` prop. Useful to show all
     * backend-provided fields without enumerating them.
     */
    showAllFields?: boolean;
    /**
     * Allow the user to toggle visible columns with a small column selector UI.
     */
    allowColumnSelector?: boolean;
    /**
     * Initial set of visible column ids. Defaults to all provided columns.
     */
    initialVisibleColumns?: string[];
    /**
     * Column ids to always exclude (hide) from the table and the column selector.
     */
    excludedColumnIds?: string[];
    /**
     * Optional map of backend column id -> friendly header label. Used when
     * showing autodetected columns (via `showAllFields`) to provide nicer
     * names instead of raw keys.
     */
    headerMappings?: Record<string, string>;
  };

export type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  colorKey?: string;
};

export type MapEditDialogProps = {
  open: boolean;
  hallId: string;
  hallLabel?: string;
  currentImage?: string;
  initialImage?: string;
  onClose: () => void;
  onSave: (data: { image?: string; imageFile?: File }) => void;
  /** Current availability of the hall (true = available) */
  availability?: boolean;
  /** Called when user toggles availability in the dialog */
  onToggleAvailability?: (newValue: boolean) => Promise<void> | void;
};

export type ApiHall = { id: string; label?: string; name?: string };

export type MapCanvasProps = {
  mapSrc: string;
  alt?: string;
  initialZoom?: number;
  minZoom?: number;
  maxZoom?: number;
  children?: ReactNode;
  style?: CSSProperties;
  /** Preferred min height for the canvas (px). Defaults to 520. */
  minHeight?: number;
};

export type Status = "delete" | "confirm" | "cancel" | "info" | "warning";

export type AdminFormValues = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  password: string;
  confirmPassword: string;
};

export type AdminFormDialogProps = {
  open: boolean;
  mode?: "add" | "edit";
  initial?: Partial<AdminFormValues>;
  onClose: () => void;
  onSave: (values: AdminFormValues) => void;
};

export type Stall = {
  id: string;
  hallId: string;
  label: string;
};

export type EditStallDialogProps = {
  open: boolean;
  stall?: Stall | null;
  initialHallId?: string;
  onClose: () => void;
  onSave: (
    updated: Stall & {
      price?: number;
      size?: string;
      name?: string;
      description?: string;
      status?: string;
    }
  ) => void;
  saving?: boolean;
};

export interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string;
}
