/* Booking reservations table page */
import React from "react";
import {
  Box,
  Paper,
  Typography,
  Chip,
  TextField,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import PageHeader from "../components/molecules/PageHeader";
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  createColumnHelper,
  flexRender,
  type SortingState,
  type HeaderGroup,
  type Header,
  type Row,
  type Cell,
} from "@tanstack/react-table";

type Reservation = {
  id: string;
  hall: string;
  stall: string;
  cost: number;
  size: "Small" | "Medium" | "Large";
  date: string;
};

const columnHelper = createColumnHelper<Reservation>();

const columns = [
  columnHelper.accessor("hall", {
    header: "Hall",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("stall", {
    header: "Stall",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("size", {
    header: "Size",
    cell: (info) => {
      const val = info.getValue() as Reservation["size"];
      // Map sizes to expressive chip colors: Small=green, Medium=amber, Large=primary
      const color:
        | "default"
        | "primary"
        | "secondary"
        | "error"
        | "info"
        | "success"
        | "warning" =
        val === "Small" ? "success" : val === "Medium" ? "warning" : "primary";
      return <Chip label={val} size="small" color={color} />;
    },
  }),
  columnHelper.accessor("cost", {
    header: "Cost",
    cell: (info) => {
      const v = info.getValue() as number;
      return `Rs. ${v.toLocaleString()}`;
    },
  }),
  columnHelper.accessor("date", {
    header: "Date",
    cell: (info) => new Date(info.getValue() as string).toLocaleDateString(),
  }),
];

const mockReservations: Reservation[] = [
  {
    id: "1",
    hall: "Hall A",
    stall: "A-12",
    cost: 1200,
    size: "Small",
    date: "2025-06-01",
  },
  {
    id: "2",
    hall: "Hall B",
    stall: "B-03",
    cost: 2500,
    size: "Medium",
    date: "2025-06-10",
  },
  {
    id: "3",
    hall: "Hall C",
    stall: "C-20",
    cost: 4800,
    size: "Large",
    date: "2025-07-02",
  },
  {
    id: "4",
    hall: "Hall B",
    stall: "B-15",
    cost: 1500,
    size: "Small",
    date: "2025-07-12",
  },
  {
    id: "5",
    hall: "Hall A",
    stall: "A-02",
    cost: 3200,
    size: "Large",
    date: "2025-08-01",
  },
  {
    id: "6",
    hall: "Hall C",
    stall: "C-09",
    cost: 900,
    size: "Small",
    date: "2025-08-15",
  },
];

const BookingsPage: React.FC = () => {
  const [globalFilter, setGlobalFilter] = React.useState("");

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pageSize, setPageSize] = React.useState<number>(5);
  const [pageIndex, setPageIndex] = React.useState<number>(0);

  const table = useReactTable({
    data: mockReservations,
    columns,
    state: { sorting, globalFilter, pagination: { pageIndex, pageSize } },
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(next.pageIndex ?? 0);
      setPageSize(next.pageSize ?? pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: false,
  });

  return (
    <Box sx={{ p: 0, bgcolor: "transparent", minHeight: "100vh" }}>
      <PageHeader
        title="Your Reservations"
        subtitle="All your stall bookings"
        height={160}
        image="/reservations.png"
      />
      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
          mt: { xs: 2, md: 3 },
          px: { xs: 3, md: 4 },
        }}
      >
        <Paper
          elevation={6}
          sx={{
            borderRadius: 3,
            p: 2,
            bgcolor: "rgba(255,255,255,0.9)",
            boxShadow: "10px 12px 20px rgba(16,24,40,0.06)",
          }}
        >
          {/* Toolbar: search + page size */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body2">Rows</Typography>
              <Select
                size="small"
                value={pageSize}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setPageSize(v);
                  table.setPageSize(v);
                }}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
              </Select>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <SearchIcon color="action" />
              <TextField
                size="small"
                placeholder="Search reservations"
                value={globalFilter}
                onChange={(e) => {
                  setGlobalFilter(e.target.value);
                  table.setGlobalFilter(e.target.value);
                }}
              />
            </Box>
          </Box>

          {/* Table */}
          <Box
            component="table"
            sx={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}
          >
            <Box
              component="thead"
              sx={{ background: "rgba(0,0,0,0.03)", borderRadius: "8px" }}
            >
              {table.getHeaderGroups().map((hg: HeaderGroup<Reservation>) => (
                <Box component="tr" key={hg.id}>
                  {hg.headers.map(
                    (header: Header<Reservation, unknown>, idx: number) => (
                      <Box
                        component="th"
                        key={header.id}
                        onClick={() =>
                          header.column.getCanSort() &&
                          header.column.toggleSorting()
                        }
                        sx={{
                          textAlign: "left",
                          fontWeight: 700,
                          padding: "12px 16px",
                          borderRight:
                            idx !== hg.headers.length - 1
                              ? "1px solid rgba(0,0,0,0.12)"
                              : undefined,
                          cursor: header.column.getCanSort()
                            ? "pointer"
                            : "default",
                          userSelect: "none",
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getIsSorted() === "asc" && (
                            <ArrowUpwardIcon fontSize="small" />
                          )}
                          {header.column.getIsSorted() === "desc" && (
                            <ArrowDownwardIcon fontSize="small" />
                          )}
                        </Box>
                      </Box>
                    )
                  )}
                </Box>
              ))}
            </Box>

            <Box component="tbody">
              {table.getRowModel().rows.map((row: Row<Reservation>) => (
                <Box
                  component="tr"
                  key={row.id}
                  sx={{
                    borderBottom: "1px solid rgba(0,0,0,0.08)",
                    "&:last-child td": { borderBottom: 0 },
                    "&:hover": { background: "rgba(0,0,0,0.02)" },
                  }}
                >
                  {row
                    .getVisibleCells()
                    .map((cell: Cell<Reservation, unknown>, cidx: number) => (
                      <Box
                        component="td"
                        key={cell.id}
                        sx={{
                          padding: "12px 16px",
                          borderRight:
                            cidx !== row.getVisibleCells().length - 1
                              ? "1px solid rgba(0,0,0,0.08)"
                              : undefined,
                          verticalAlign: "middle",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Box>
                    ))}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Pagination */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Box>
              <IconButton
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <FirstPageIcon />
              </IconButton>
              <IconButton
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <NavigateBeforeIcon />
              </IconButton>
              <IconButton
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <NavigateNextIcon />
              </IconButton>
              <IconButton
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <LastPageIcon />
              </IconButton>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body2">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </Typography>
              <Typography variant="body2">
                {table.getRowModel().rows.length} rows
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default BookingsPage;
