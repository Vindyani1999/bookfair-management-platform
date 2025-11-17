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

  useEffect(() => {
    if (!selectedHall) return;
    let mounted = true;
    fetchHall(selectedHall)
      .then((data: any) => {
        // setLastFetchRaw?.(data);

        if (!mounted) return;
        let stallsFromApi: any[] = [];
        if (Array.isArray(data)) stallsFromApi = data;
        else if (Array.isArray(data.stalls)) stallsFromApi = data.stalls;
        else if (Array.isArray(data.data?.stalls))
          stallsFromApi = data.data.stalls;
        else if (Array.isArray(data.results)) stallsFromApi = data.results;

        if (stallsFromApi.length > 0) {
          const normalized = stallsFromApi.map((s: any, idx: number) => {
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
      });

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHall]);

  // const [lastFetchRaw, setLastFetchRaw] = useState<any>(null);

  const currentStalls = useMemo(() => {
    const hall = halls.find((h) => h.id === selectedHall);
    const stallsForHall = stallsState.filter((s) => s.hallId === selectedHall);
    return (
      stallsForHall.map((s, idx) => ({
        id: s.id,
        stall: `${hall?.label || hall?.name || "Hall"} - ${
          s.label || `Stall ${idx + 1}`
        }`,
        price: (() => {
          const p = (s as any).price ?? (s as any).cost ?? 0;
          const pn = Number(p);
          return Number.isFinite(pn) ? pn : 0;
        })(),
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
          const isEdit = Boolean(editingStall);

          if (isEdit) {
            const prev = stallsState.find((s) => s.id === updated.id);
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

                const container = resp || {};
                const returned = (container.stall as any) || container;

                const normalizedReturned = (() => {
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

                setStallsState((prevState) =>
                  prevState.map((s) =>
                    s.id === normalizedReturned.id
                      ? { ...s, ...normalizedReturned }
                      : s
                  )
                );

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
                setStallsState((prev) =>
                  prev.filter((s) => s.id !== deleteTargetId)
                );
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
