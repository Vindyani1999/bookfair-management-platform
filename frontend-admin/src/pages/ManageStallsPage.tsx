/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import StatusButton from "../components/atoms/StatusButton";
import ReusableTable from "../components/atoms/ReusableTable";
import type { Column } from "../types/types";
import type { SelectChangeEvent } from "@mui/material";
import EditStallDialog from "../components/molecules/EditStallDialog";

import { stalls as adminStalls } from "../data/halls";
import { fetchHalls, fetchHall } from "../services/hallsApi";
import { updateStall, createStall, deleteStall } from "../services/stallsApi";
import type { ApiHall } from "../types/types";

export default function ManageStallsPage() {
  const [halls, setHalls] = useState<ApiHall[]>([]);
  const [selectedHall, setSelectedHall] = useState<string>("");
  // local editable copy of stalls so we can replace them when fetched from backend
  const [stallsState, setStallsState] = useState(() => [...adminStalls]);
  const [editingStall, setEditingStall] = useState<{
    id: string;
    hallId: string;
    label: string;
  } | null>(null);

  const handleOpenEdit = (rowId: string) => {
    const s = stallsState.find((x) => x.id === rowId);
    if (s) setEditingStall({ id: s.id, hallId: s.hallId, label: s.label });
  };
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    fetchHalls()
      .then((list) => {
        if (!mounted) return;
        setHalls(list);
        if (!selectedHall && list.length > 0) setSelectedHall(list[0].id);
      })
      .catch((err: any) => {
        if (err && (err.status === 401 || err.status === 404)) {
          navigate("/login");
          return;
        }
        // fallback: use halls derived from adminStalls if available
        const fallback = Array.from(
          new Set(adminStalls.map((s) => s.hallId))
        ).map((id) => ({ id, label: id }));
        if (!mounted) return;
        setHalls(fallback);
        if (!selectedHall && fallback.length > 0)
          setSelectedHall(fallback[0].id);
      });
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleHallChange = (e: SelectChangeEvent<string>) => {
    setSelectedHall(e.target.value as string);
  };

  // When selected hall changes, try to fetch its details (including stalls) from backend
  useEffect(() => {
    if (!selectedHall) return;
    let mounted = true;
    fetchHall(selectedHall)
      .then((data: any) => {
        // record raw response for debug panel
        setLastFetchRaw?.(data);
        console.debug("fetchHall raw response:", data);
        console.group(`📥 fetchHall(${selectedHall}) — RAW DATA`);
        console.log("Full response:", data);
        console.log("data.stalls:", data?.stalls);
        console.log("data.data?.stalls:", data?.data?.stalls);
        if (!mounted) return;
        // Try to find stalls in common locations (also accept the response being the array itself)
        let stallsFromApi: any[] = [];
        if (Array.isArray(data)) stallsFromApi = data;
        else if (Array.isArray(data.stalls)) stallsFromApi = data.stalls;
        else if (Array.isArray(data.data?.stalls))
          stallsFromApi = data.data.stalls;
        else if (Array.isArray(data.results)) stallsFromApi = data.results;

        if (stallsFromApi.length > 0) {
          const normalized = stallsFromApi.map((s: any, idx: number) => {
            // helper to read nested properties safely
            const lookup = (obj: any, path: string[]) => {
              for (const p of path) {
                const parts = p.split(".");
                let cur = obj;
                let found = true;
                for (const part of parts) {
                  if (cur == null) {
                    found = false;
                    break;
                  }
                  cur = cur[part];
                }
                if (found && cur !== undefined) return cur;
              }
              return undefined;
            };

            const rawPrice = lookup(s, [
              "price",
              "cost",
              "attributes.price",
              "stall.price",
              "data.price",
            ]);

            // parse price robustly: treat non-finite values as missing
            const parsedPriceRaw =
              rawPrice == null ? undefined : Number(rawPrice);
            const parsedPrice = Number.isFinite(parsedPriceRaw)
              ? parsedPriceRaw
              : undefined;

            const rawSize = lookup(s, [
              "size",
              "sizeLabel",
              "type",
              "attributes.size",
              "stall.size",
              "data.size",
            ]);

            // treat string 'undefined'/'null' as missing
            const normalizedSize =
              typeof rawSize === "string" &&
              (rawSize.toLowerCase() === "undefined" ||
                rawSize.toLowerCase() === "null")
                ? undefined
                : rawSize;

            return {
              id: String(s.id || s._id || s.code || `s-${selectedHall}-${idx}`),
              hallId: selectedHall,
              label: s.label || s.name || s.title || `Stall ${idx + 1}`,
              // preserve server-provided values when available (parse decimals)
              price: parsedPrice,
              size: normalizedSize || "Medium",
              description: lookup(s, [
                "description",
                "attributes.description",
                "stall.description",
                "data.description",
              ]),
              status:
                lookup(s, [
                  "status",
                  "attributes.status",
                  "stall.status",
                  "data.status",
                ]) ?? "available",
            };
          });
          setStallsState((prev) => {
            const filtered = prev.filter((p) => p.hallId !== selectedHall);
            return [...filtered, ...normalized];
          });
        } else if (typeof data.stallCount === "number") {
          const count = data.stallCount;
          const placeholders = Array.from({ length: count }).map((_, i) => ({
            id: `${selectedHall}-p-${i + 1}`,
            hallId: selectedHall,
            label: `Stall ${i + 1}`,
            price: data.price,
            size: data.size,
          }));
          setStallsState((prev) => {
            const filtered = prev.filter((p) => p.hallId !== selectedHall);
            return [...filtered, ...placeholders];
          });
        }
      })
      .catch((err: any) => {
        if (err && (err.status === 401 || err.status === 404)) {
          navigate("/login");
        }
        // otherwise keep existing stallsState (fallback)
      });

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHall]);

  // store the last raw fetch response for debugging in the UI
  const [lastFetchRaw, setLastFetchRaw] = useState<any>(null);

  const currentStalls = useMemo(() => {
    const hall = halls.find((h) => h.id === selectedHall);
    const stallsForHall = stallsState.filter((s) => s.hallId === selectedHall);
    // If there are no explicit stalls, create placeholder numbered stalls up to the count
    return (
      stallsForHall.map((s, idx) => ({
        id: s.id,
        stall: `${hall?.label || hall?.name || "Hall"} - ${
          s.label || `Stall ${idx + 1}`
        }`,
        // ensure price is a finite number, fallback to 0
        price: (() => {
          const p = (s as any).price ?? (s as any).cost ?? 0;
          const pn = Number(p);
          return Number.isFinite(pn) ? pn : 0;
        })(),
        // sanitize size: avoid literal 'undefined' strings and normalize capitalization
        size: (() => {
          const raw = (
            (s as any).size ||
            (s as any).sizeLabel ||
            "Medium"
          ).toString();
          if (raw.toLowerCase() === "undefined" || raw.toLowerCase() === "null")
            return "Medium";
          return raw.replace(/^./, (c: string) => c.toUpperCase());
        })(),
        status: (s as any).status ?? "available",
      })) || []
    );
  }, [halls, selectedHall, stallsState]);

  type Row = {
    id: string;
    stall: string;
    price: number;
    size: string;
    status?: string;
  };

  // Debug: log rows passed to the table to verify visualization data
  useEffect(() => {
    const rows = currentStalls as unknown as Record<string, unknown>[];
    console.debug("currentStalls for hall", selectedHall, rows);
  }, [currentStalls, selectedHall]);

  const columns: Column<Row>[] = [
    { id: "id", header: "ID", field: "id", width: 60 },
    { id: "stall", header: "Stall", field: "stall" },
    {
      id: "price",
      header: "Price",
      field: "price",
      width: 120,
      render: (row: Row) => `Rs. ${Number(row.price ?? 0).toFixed(2)}`,
      align: "right",
      sortable: true,
    },
    { id: "size", header: "Size", field: "size", width: 120, align: "center" },
    {
      id: "status",
      header: "Status",
      field: "status",
      width: 140,
      align: "center",
      render: (row: Row) => {
        const stat = (row as any).status ?? "available";
        const color =
          stat === "available"
            ? "success"
            : stat === "booked"
            ? "warning"
            : "default";
        return (
          <Chip
            label={stat.charAt(0).toUpperCase() + stat.slice(1)}
            color={color as any}
            size="small"
          />
        );
      },
    },
    {
      id: "edit",
      header: "Edit",
      width: 80,
      align: "center",
      render: (row: Row) => (
        <IconButton
          size="small"
          color="success"
          onClick={() => handleOpenEdit(row.id)}
          aria-label={`edit-${row.id}`}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      ),
    },
    {
      id: "delete",
      header: "Delete",
      width: 80,
      align: "center",
      render: (row: Row) => (
        <IconButton
          size="small"
          color="error"
          onClick={() => {
            setDeleteTargetId(row.id);
            setDeleteDialogOpen(true);
          }}
          aria-label={`delete-${row.id}`}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  const [addOpen, setAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Manage Stalls
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          px: 3,
        }}
      >
        <FormControl sx={{ minWidth: 220 }} size="small">
          <InputLabel id="hall-select-label">Select Hall</InputLabel>
          <Select
            labelId="hall-select-label"
            value={selectedHall}
            label="Select Hall"
            onChange={handleHallChange}
          >
            {halls.map((h) => (
              <MenuItem key={h.id} value={h.id}>
                {h.label || (h as any).name || h.id}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box>
          <StatusButton
            status="confirm"
            onClick={() => setAddOpen(true)}
            startIcon={<AddIcon />}
            sx={{ textTransform: "none" }}
          >
            Add Stall
          </StatusButton>
        </Box>
      </Box>

      <ReusableTable
        columns={columns}
        rows={currentStalls as Row[]}
        showSearch
        searchPlaceholder="Search stalls..."
        defaultRowsPerPage={10}
      />

      {/* Debug panel: shows last raw fetch and current stalls (toggleable) */}
      <Box sx={{ mt: 2 }}>
        <details>
          <summary style={{ cursor: "pointer" }}>
            Debug: show last fetch & stall data
          </summary>
          <Box
            sx={{ mt: 1, p: 1, bgcolor: "background.paper", borderRadius: 1 }}
          >
            <Typography variant="caption">Last raw fetch response:</Typography>
            <pre style={{ maxHeight: 240, overflow: "auto" }}>
              {JSON.stringify(lastFetchRaw, null, 2)}
            </pre>

            <Typography variant="caption">stallsState (filtered):</Typography>
            <pre style={{ maxHeight: 240, overflow: "auto" }}>
              {JSON.stringify(
                stallsState.filter((s) => s.hallId === selectedHall),
                null,
                2
              )}
            </pre>

            <Typography variant="caption">
              currentStalls (table rows):
            </Typography>
            <pre style={{ maxHeight: 240, overflow: "auto" }}>
              {JSON.stringify(currentStalls, null, 2)}
            </pre>
          </Box>
        </details>
      </Box>

      <EditStallDialog
        open={Boolean(editingStall) || addOpen}
        stall={editingStall ?? null}
        initialHallId={selectedHall}
        saving={saving}
        onClose={() => {
          setEditingStall(null);
          setAddOpen(false);
        }}
        onSave={async (updated) => {
          // if editingStall is set, we are editing; otherwise creating
          const isEdit = Boolean(editingStall);

          if (isEdit) {
            const prev = stallsState.find((s) => s.id === updated.id);
            // optimistic update
            setStallsState((prevState) =>
              prevState.map((s) =>
                s.id === updated.id
                  ? {
                      ...s,
                      label: updated.label,
                      price: (updated as any).price ?? (s as any).price,
                      size: (updated as any).size ?? (s as any).size,
                    }
                  : s
              )
            );

            // also update adminStalls in-memory store optimistically
            for (let i = 0; i < adminStalls.length; i++) {
              if (adminStalls[i].id === updated.id) {
                adminStalls[i] = {
                  ...adminStalls[i],
                  label: updated.label,
                  price:
                    (updated as any).price ?? (adminStalls[i] as any).price,
                  size: (updated as any).size ?? (adminStalls[i] as any).size,
                };
              }
            }

            setEditingStall(null);

            // persist to backend and replace optimistic update with authoritative server response
            (async () => {
              try {
                const resp = await updateStall(updated.id, {
                  name: updated.name || updated.label,
                  hallId: Number(updated.hallId),
                  size: (updated.size || "small").toLowerCase(),
                  price: Number(Number((updated as any).price ?? 0).toFixed(2)),
                  description: (updated as any).description,
                  status: (updated as any).status,
                });

                // server may return { message, stall } or a stall object
                const container = resp || {};
                const returned = (container.stall as any) || container;

                // normalize returned stall to our UI shape
                const normalizedReturned = (() => {
                  // sanitize returned price and size
                  let rp = Number(
                    returned?.price ??
                      returned?.cost ??
                      (updated as any).price ??
                      0
                  );
                  if (!Number.isFinite(rp)) {
                    const up = Number((updated as any).price ?? 0);
                    rp = Number.isFinite(up) ? up : 0;
                  }

                  let rs = returned?.size ?? (updated as any).size ?? "Medium";
                  if (
                    typeof rs === "string" &&
                    (rs.toLowerCase() === "undefined" ||
                      rs.toLowerCase() === "null")
                  )
                    rs = "Medium";

                  return {
                    id: String(returned?.id ?? updated.id),
                    hallId: String(returned?.hallId ?? updated.hallId),
                    label: (returned?.label ||
                      returned?.name ||
                      updated.label ||
                      updated.name) as string,
                    price: rp,
                    size: rs as string,
                    description:
                      returned?.description ?? (updated as any).description,
                    status: returned?.status ?? (updated as any).status,
                  };
                })();

                // replace the item in stallsState with authoritative values
                setStallsState((prevState) =>
                  prevState.map((s) =>
                    s.id === normalizedReturned.id
                      ? { ...s, ...normalizedReturned }
                      : s
                  )
                );

                // update adminStalls fallback store as well
                for (let i = 0; i < adminStalls.length; i++) {
                  if (adminStalls[i].id === normalizedReturned.id) {
                    adminStalls[i] = {
                      ...adminStalls[i],
                      ...normalizedReturned,
                    } as any;
                  }
                }
              } catch (err: any) {
                console.error("Failed to update stall on server", err);
                // revert optimistic update on failure
                if (prev) {
                  setStallsState((s) =>
                    s.map((x) => (x.id === prev.id ? prev : x))
                  );
                  for (let i = 0; i < adminStalls.length; i++) {
                    if (adminStalls[i].id === prev.id) adminStalls[i] = prev;
                  }
                }
              }
            })();

            return;
          }

          // Create new stall flow - persist first, then add to UI on success
          setSaving(true);
          try {
            const resp = await createStall({
              name: updated.name || updated.label,
              hallId: Number(updated.hallId),
              size: (updated.size || "small").toLowerCase(),
              price: Number(Number((updated as any).price ?? 0).toFixed(2)),
              description: (updated as any).description,
              status: (updated as any).status ?? "available",
            });

            // backend usually returns { message, stall } — normalize to the actual stall object
            const createdContainer = resp || {};
            const created = createdContainer.stall || createdContainer;

            const newStall = {
              id: String(created?.id ?? updated.id),
              hallId: String(created?.hallId ?? updated.hallId),
              label: (created?.label ||
                created?.name ||
                updated.label ||
                updated.name) as string,
              price: (() => {
                let cp = Number(
                  created?.price ?? created?.cost ?? (updated as any).price ?? 0
                );
                if (!Number.isFinite(cp)) {
                  const up = Number((updated as any).price ?? 0);
                  cp = Number.isFinite(up) ? up : 0;
                }
                return cp;
              })(),
              size: (() => {
                let cs = created?.size ?? (updated as any).size ?? "Medium";
                if (
                  typeof cs === "string" &&
                  (cs.toLowerCase() === "undefined" ||
                    cs.toLowerCase() === "null")
                )
                  cs = "Medium";
                return cs as string;
              })(),
              description: created?.description ?? (updated as any).description,
              status: created?.status ?? (updated as any).status,
            };

            setStallsState((prev) => [...prev, newStall]);
            adminStalls.push(newStall);
            setAddOpen(false);
          } catch (err: any) {
            console.error("Failed to create stall on server", err);
            // optionally show user-facing error or keep dialog open
          } finally {
            setSaving(false);
          }
        }}
      />

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          if (!deleting) {
            setDeleteDialogOpen(false);
            setDeleteTargetId(null);
          }
        }}
      >
        <DialogTitle>Delete stall</DialogTitle>
        <DialogContent>
          <Typography>
            Do you want to delete this stall? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
              setDeleteTargetId(null);
            }}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            color="error"
            onClick={async () => {
              if (!deleteTargetId) return;
              setDeleting(true);
              try {
                await deleteStall(deleteTargetId);
                // remove from stallsState
                setStallsState((prev) =>
                  prev.filter((s) => s.id !== deleteTargetId)
                );
                // remove from adminStalls fallback
                for (let i = adminStalls.length - 1; i >= 0; i--) {
                  if (adminStalls[i].id === deleteTargetId)
                    adminStalls.splice(i, 1);
                }
              } catch (err) {
                console.error("Failed to delete stall", err);
              } finally {
                setDeleting(false);
                setDeleteDialogOpen(false);
                setDeleteTargetId(null);
              }
            }}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
