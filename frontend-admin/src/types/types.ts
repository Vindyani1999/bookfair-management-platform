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
