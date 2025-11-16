/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  TextField,
  IconButton,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import InputAdornment from "@mui/material/InputAdornment";
import { type Props } from "../../types/types";

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilized = array.map((el, index) => [el, index] as [T, number]);
  stabilized.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilized.map((el) => el[0]);
}

function getComparator<T extends Record<string, unknown>>(
  order: "asc" | "desc",
  orderBy: string
) {
  return function (a: T, b: T) {
    const av = a[orderBy as keyof T] as unknown;
    const bv = b[orderBy as keyof T] as unknown;
    if (av === undefined || bv === undefined) return 0;
    try {
      if ((av as any) < (bv as any)) return order === "asc" ? -1 : 1;
      if ((av as any) > (bv as any)) return order === "asc" ? 1 : -1;
    } catch {
      return 0;
    }
    return 0;
  };
}

export default function ReusableTable<T extends Record<string, unknown>>({
  columns,
  rows,
  showSearch = true,
  searchPlaceholder = "Search…",
  rowsPerPageOptions = [12, 24, 48],
  defaultRowsPerPage = 12,
  onRowClick,
  toolbarActions,
  dense = false,
  showPagination = true,
  emptyState,
}: Props<T>) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [orderBy, setOrderBy] = useState<string>(columns[0]?.id || "");

  const searchableFields = useMemo(() => {
    // fields that are safe to search: columns with `field` defined
    return columns.filter((c) => c.field).map((c) => String(c.field));
  }, [columns]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows.slice();
    return rows.filter((r) => {
      // if columns provide field names, search those; otherwise stringify row
      if (searchableFields.length) {
        return searchableFields.some((f) =>
          ("" + (r[f as keyof T] ?? "")).toLowerCase().includes(q)
        );
      }
      return JSON.stringify(r).toLowerCase().includes(q);
    });
  }, [rows, query, searchableFields]);

  const sorted = useMemo(() => {
    if (!orderBy) return filtered;
    return stableSort(filtered, getComparator<T>(order, orderBy));
  }, [filtered, order, orderBy]);

  const pageSlice = useMemo(() => {
    if (!showPagination) return sorted;
    const start = page * rowsPerPage;
    return sorted.slice(start, start + rowsPerPage);
  }, [sorted, page, rowsPerPage, showPagination]);

  const handleRequestSort = (id: string) => {
    const isAsc = orderBy === id && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(id);
  };

  return (
    <Paper
      className="reusable-table"
      elevation={2}
      sx={{ width: "100%", overflow: "hidden", backgroundColor: "transparent" }}
    >
      <Toolbar sx={{ position: "relative", minHeight: 76 }}>
        {/* centered search area */}
        {showSearch && (
          <Box
            sx={{
              width: { xs: "100%", sm: "60%" },
              mx: "auto",
              display: "flex",
              alignItems: "center",
              gap: 1,
              justifyContent: "center",
            }}
          >
            <TextField
              variant="outlined"
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  height: 44,
                  borderRadius: 12,
                  // background: '#ffffff',
                  boxShadow: "0 6px 16px rgba(16,24,40,0.06)",
                  border: "2px solid #565656",
                },
                "& .MuiOutlinedInput-input": {
                  padding: "10px 14px",
                  fontSize: 14,
                },
              }}
              size="small"
              placeholder={searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            {query && (
              <IconButton
                size="small"
                onClick={() => setQuery("")}
                aria-label="clear search"
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        )}

        {/* toolbar actions float to the right */}
        <Box className="toolbar-actions">{toolbarActions}</Box>
      </Toolbar>

      <TableContainer sx={{ maxHeight: 520 }}>
        <Table size={dense ? "small" : "medium"} stickyHeader>
          <TableHead
            sx={{
              backgroundColor: "transparent",
              // add a subtle border under the header row to separate it from body
              "& .MuiTableCell-root": {
                borderBottom: "2px solid rgba(15,23,42,0.08)",
              },
            }}
          >
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align || "left"}
                  sortDirection={orderBy === col.id ? order : false}
                  sx={{
                    minWidth: col.width ?? 120,
                    backgroundColor: "rgba(0,0,0,0.2) !important",
                  }}
                >
                  {col.sortable ? (
                    <TableSortLabel
                      active={orderBy === col.id}
                      direction={orderBy === col.id ? order : "desc"}
                      onClick={() => handleRequestSort(col.id)}
                    >
                      {col.header}
                    </TableSortLabel>
                  ) : (
                    <Typography sx={{ fontWeight: 600 }}>
                      {col.header}
                    </Typography>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {pageSlice.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  sx={{ py: 6, textAlign: "center" }}
                >
                  {emptyState ?? (
                    <Typography color="text.secondary">No rows</Typography>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              pageSlice.map((row, idx) => (
                <TableRow
                  hover
                  key={idx}
                  onClick={() => onRowClick?.(row)}
                  sx={{
                    cursor: onRowClick ? "pointer" : "default",
                    // slightly tighter rows
                    "& .MuiTableCell-root": { py: 0.75 },
                  }}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.id}
                      align={col.align || "left"}
                      sx={{
                        py: 0.75,
                        px: 1.5,
                        borderBottom: "1px solid rgba(15,23,42,0.3)",
                      }}
                    >
                      {(() => {
                        // Determine the raw field key we use for this column
                        const fieldKey = String(col.field ?? col.id);
                        const rawValue = (
                          row as unknown as Record<string, any>
                        )[fieldKey];
                        const display = col.render
                          ? col.render(row)
                          : String(rawValue ?? "");

                        // Temporary debug: log exact values used when rendering Price and Size cells
                        if (
                          col.id === "price" ||
                          fieldKey === "price" ||
                          col.id === "size" ||
                          fieldKey === "size"
                        ) {
                          try {
                            console.debug("ReusableTable cell render", {
                              rowId: (row as any).id ?? idx,
                              colId: col.id,
                              fieldKey,
                              rawValue,
                              display,
                            });
                          } catch {
                            /* ignore logging errors */
                          }
                        }

                        return display;
                      })()}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {showPagination && (
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={sorted.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      )}
    </Paper>
  );
}
