/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState, useEffect } from "react";
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
  Button,
  Popover,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { Checkbox } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import InputAdornment from "@mui/material/InputAdornment";
import type { Props, Column } from "../../types/types";

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
  showAllFields = false,
  allowColumnSelector = false,
  initialVisibleColumns,
  excludedColumnIds = [],
  headerMappings = {},
}: Props<T>) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [orderBy, setOrderBy] = useState<string>(columns[0]?.id || "");

  // derive columns: include provided columns + optionally fields found on rows
  const detectedExtraColumns: Column[] = useMemo(() => {
    if (!showAllFields || !rows || rows.length === 0) return [];
    const keys = new Set<string>();
    rows.forEach((r) => {
      Object.keys(r).forEach((k) => keys.add(k));
    });
    // exclude existing column ids and explicitly excluded ids
    const existing = new Set(columns.map((c) => c.id));
    const extras: Column[] = [];
    keys.forEach((k) => {
      if (existing.has(k)) return;
      if (excludedColumnIds.includes(k)) return;
      const header = headerMappings[k] ?? k;
      extras.push({ id: k, header, field: k });
    });
    return extras;
  }, [showAllFields, rows, columns, excludedColumnIds, headerMappings]);

  const allColumns = useMemo(() => {
    return [...columns, ...detectedExtraColumns].filter(
      (c) => !excludedColumnIds.includes(c.id)
    );
  }, [columns, detectedExtraColumns, excludedColumnIds]);

  // visible columns state (ids)
  const [visibleColumnIds, setVisibleColumnIds] = useState<
    string[] | undefined
  >(
    () =>
      initialVisibleColumns ??
      allColumns.filter((c) => !c.hidden).map((c) => c.id)
  );

  // keep a stable key for column ids to use in deps
  const allColumnIdsKey = useMemo(
    () => allColumns.map((c) => c.id).join(","),
    [allColumns]
  );

  useEffect(() => {
    // if columns change, ensure visibleColumnIds includes them by default
    setVisibleColumnIds((prev) => {
      const defaultIds =
        initialVisibleColumns ??
        allColumns.filter((c) => !c.hidden).map((c) => c.id);
      if (prev && prev.length > 0) {
        const setPrev = new Set(prev);
        defaultIds.forEach((id) => setPrev.add(id));
        return Array.from(setPrev);
      }
      return defaultIds;
    });
  }, [allColumnIdsKey, initialVisibleColumns, allColumns]);

  const visibleColumns = useMemo(() => {
    const ids =
      visibleColumnIds ?? allColumns.filter((c) => !c.hidden).map((c) => c.id);
    return allColumns.filter((c) => ids.includes(c.id));
  }, [allColumns, visibleColumnIds]);

  // compute column widths: respect numeric/string `column.width`, and distribute remaining space
  const computedColWidths = useMemo(() => {
    const fixedCols = visibleColumns.filter((c) => typeof c.width === "number");
    const totalFixedPx = fixedCols.reduce(
      (s, c) => s + (Number(c.width) || 0),
      0
    );
    const remaining = visibleColumns.length - fixedCols.length;
    return visibleColumns.map((c) => {
      if (typeof c.width === "number") return `${c.width}px`;
      if (typeof c.width === "string" && c.width.trim().length) return c.width;
      if (remaining > 0)
        return `calc((100% - ${totalFixedPx}px) / ${remaining})`;
      return `${100 / Math.max(1, visibleColumns.length)}%`;
    });
  }, [visibleColumns]);

  const searchableFields = useMemo(() => {
    return visibleColumns.filter((c) => c.field).map((c) => String(c.field));
  }, [visibleColumns]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows.slice();
    return rows.filter((r) => {
      if (searchableFields.length) {
        return searchableFields.some((f) =>
          ("" + ((r as any)[f] ?? "")).toLowerCase().includes(q)
        );
      }
      return JSON.stringify(r).toLowerCase().includes(q);
    });
  }, [rows, query, searchableFields]);

  useEffect(() => {
    const firstId = allColumns[0]?.id;
    setOrderBy((prev) => prev || firstId || "");
  }, [allColumnIdsKey, allColumns]);

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

  // Column selector sub-component (kept here for single-file convenience)
  function ColumnSelectorButton(props: {
    allColumns: Column[];
    visibleColumnIds?: string[];
    setVisibleColumnIds: (
      ids?: string[] | ((ids?: string[]) => string[] | undefined)
    ) => void;
  }) {
    const { allColumns, visibleColumnIds, setVisibleColumnIds } = props;
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);
    const handleOpen = (e: React.MouseEvent<HTMLElement>) =>
      setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const toggle = (id: string) => {
      setVisibleColumnIds((prev) => {
        const set = new Set(prev ?? []);
        if (set.has(id)) set.delete(id);
        else set.add(id);
        return Array.from(set);
      });
    };

    const selectAll = () => setVisibleColumnIds(allColumns.map((c) => c.id));
    const clearAll = () => setVisibleColumnIds([]);

    return (
      <>
        <Button variant="outlined" size="small" onClick={handleOpen}>
          Columns
        </Button>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Box sx={{ p: 1, maxHeight: 320, overflow: "auto", minWidth: 240 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="subtitle2">Columns</Typography>
              <Box>
                <Button size="small" onClick={selectAll} sx={{ mr: 1 }}>
                  All
                </Button>
                <Button size="small" onClick={clearAll}>
                  None
                </Button>
              </Box>
            </Box>
            <Divider />
            {allColumns.map((c) => (
              <ListItem
                key={c.id}
                button
                onClick={() => toggle(c.id)}
                sx={{ px: 0 }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Checkbox
                    size="small"
                    edge="start"
                    checked={visibleColumnIds?.includes(c.id) ?? true}
                    tabIndex={-1}
                    disableRipple
                    onChange={() => toggle(c.id)}
                  />
                </ListItemIcon>
                <ListItemText primary={headerMappings[c.id] ?? c.header} />
              </ListItem>
            ))}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
              <Button size="small" onClick={handleClose}>
                Close
              </Button>
            </Box>
          </Box>
        </Popover>
      </>
    );
  }

  return (
    <Paper
      className="reusable-table"
      elevation={2}
      sx={{ width: "100%", overflow: "hidden", backgroundColor: "transparent" }}
    >
      <Toolbar sx={{ position: "relative", minHeight: 76 }}>
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

        <Box
          className="toolbar-actions"
          sx={{ display: "flex", gap: 1, alignItems: "center" }}
        >
          {toolbarActions}
          {allowColumnSelector && (
            <ColumnSelectorButton
              allColumns={allColumns}
              visibleColumnIds={visibleColumnIds}
              setVisibleColumnIds={setVisibleColumnIds}
            />
          )}
        </Box>
      </Toolbar>

      <TableContainer sx={{ maxHeight: 520, overflowX: "hidden" }}>
        <Table
          size={dense ? "small" : "medium"}
          stickyHeader
          sx={{ tableLayout: "fixed", width: "100%" }}
        >
          <TableHead
            sx={{
              backgroundColor: "transparent",
              "& .MuiTableCell-root": {
                borderBottom: "2px solid rgba(15,23,42,0.08)",
              },
            }}
          >
            <TableRow>
              {visibleColumns.map((col, idx) => {
                const headerLabel = headerMappings[col.id] ?? col.header;
                return (
                  <TableCell
                    key={col.id}
                    align={col.align || "left"}
                    sortDirection={orderBy === col.id ? order : false}
                    sx={{
                      width: computedColWidths[idx],
                      maxWidth: computedColWidths[idx],
                      backgroundColor: "rgba(0,0,0,0.2) !important",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                    }}
                  >
                    {col.sortable ? (
                      <TableSortLabel
                        active={orderBy === col.id}
                        direction={orderBy === col.id ? order : "desc"}
                        onClick={() => handleRequestSort(col.id)}
                      >
                        {headerLabel}
                      </TableSortLabel>
                    ) : (
                      <Typography sx={{ fontWeight: 600 }}>
                        {headerLabel}
                      </Typography>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {pageSlice.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={visibleColumns.length}
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
                    "& .MuiTableCell-root": { py: 0.75 },
                  }}
                >
                  {visibleColumns.map((col, cidx) => (
                    <TableCell
                      key={col.id}
                      align={col.align || "left"}
                      sx={{
                        py: 0.75,
                        px: 1.5,
                        borderBottom: "1px solid rgba(15,23,42,0.3)",
                        width: computedColWidths[cidx],
                        maxWidth: computedColWidths[cidx],
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                      }}
                    >
                      {(() => {
                        const fieldKey = String(col.field ?? col.id);
                        const rawValue = (
                          row as unknown as Record<string, any>
                        )[fieldKey];
                        const display = col.render
                          ? col.render(row)
                          : String(rawValue ?? "");

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
