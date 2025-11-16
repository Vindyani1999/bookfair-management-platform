import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Typography,
  Avatar,
  Divider,
  Stack,
  Chip,
} from "@mui/material";
import MapCanvas from "../components/atoms/MapCanvas";
import { hallMapImages, stalls as adminStalls } from "../data/halls";
import {
  fetchHalls,
  fetchHall,
  updateHall,
  uploadHallImage,
} from "../services/hallsApi";
import type { ApiHall } from "../services/hallsApi";
import MapIcon from "@mui/icons-material/Map";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VisibilityIcon from "@mui/icons-material/Visibility";
import StatusButton from "../components/atoms/StatusButton";
import MapEditDialog from "../components/molecules/MapEditDialog";

export default function ManageMapsPage() {
  const [halls, setHalls] = useState<ApiHall[]>([]);
  const [selectedHall, setSelectedHall] = useState<string>("");
  const [availability, setAvailability] = useState<Record<string, boolean>>({});
  const hallLabel = useMemo(
    () => halls.find((h) => h.id === selectedHall)?.label || "",
    [selectedHall, halls]
  );

  // local state for images and stall counts so admin edits can be previewed immediately
  const [hallImages, setHallImages] = useState<Record<string, string>>({});

  // `stallCounts` was previously used to show and edit counts in the dialog.
  // Since stall counts are no longer editable from the map edit popup, keep
  // a lightweight store for any server-provided counts but avoid editing it
  // from this page.
  const [, setStallCounts] = useState<Record<string, number>>({});

  const [editOpen, setEditOpen] = useState(false);
  const [lastUpload, setLastUpload] = useState<Record<string, string>>({});

  const navigate = useNavigate();

  function formatUploadDate(value?: string) {
    if (!value) return "";
    const parsed = Date.parse(value);
    if (Number.isNaN(parsed)) return value;
    const d = new Date(parsed);
    const now = new Date();

    const isToday = d.toDateString() === now.toDateString();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();

    const time = d.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });

    if (isToday) return `Today at ${time}`;
    if (isYesterday) return `Yesterday at ${time}`;

    return (
      d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) + ` — ${time}`
    );
  }

  useEffect(() => {
    let mounted = true;
    fetchHalls()
      .then((list) => {
        if (!mounted) return;
        setHalls(list);
        // initialize selected hall if empty
        if (!selectedHall && list.length > 0) setSelectedHall(list[0].id);

        // init availability, images, stalls and lastUpload for each hall
        const avail: Record<string, boolean> = {};
        const imgs: Record<string, string> = {};
        const counts: Record<string, number> = {};
        const last: Record<string, string> = {};
        for (const h of list) {
          avail[h.id] = true;
          imgs[h.id] =
            (hallMapImages[h.id as keyof typeof hallMapImages] as string) ||
            (hallMapImages[h.label as keyof typeof hallMapImages] as string) ||
            `/maps/${(h.label || h.id).replace(/\s+/g, "")}.png` ||
            "/maps/hallD.png";
          counts[h.id] = adminStalls.filter((s) => s.hallId === h.id).length;
          last[h.id] = "-";
        }
        setAvailability(avail);
        setHallImages(imgs);
        setStallCounts(counts);
        setLastUpload(last);
      })
      .catch(() => {
        // fallback to local data/hardcoded halls if API fails
        const fallback = Object.keys(hallMapImages).map((k) => ({
          id: k,
          label: k,
        }));
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

  // When selectedHall changes, fetch detailed hall data from backend
  useEffect(() => {
    if (!selectedHall) return;
    let mounted = true;
    fetchHall(selectedHall)
      .then((data) => {
        if (!mounted) return;
        if (!data) return;

        const image = data.imageUrl || data.image || undefined;
        if (image) setHallImages((m) => ({ ...m, [selectedHall]: image }));

        const stallsCount = Array.isArray(data.stalls) ? data.stalls.length : 0;
        setStallCounts((s) => ({ ...s, [selectedHall]: stallsCount }));

        if (data.status) {
          setAvailability((a) => ({
            ...a,
            [selectedHall]: data.status === "available",
          }));
        }

        if (data.updatedAt) {
          setLastUpload((l) => ({
            ...l,
            [selectedHall]: new Date(data.updatedAt).toLocaleString(),
          }));
        }

        // Sync provided stalls into adminStalls store so ManageStallsPage reflects backend
        if (Array.isArray(data.stalls)) {
          for (let i = adminStalls.length - 1; i >= 0; i--) {
            if (adminStalls[i].hallId === selectedHall)
              adminStalls.splice(i, 1);
          }
          data.stalls.forEach((s: unknown) => {
            const si = s as Record<string, unknown>;
            adminStalls.push({
              id: String(si.id),
              hallId: selectedHall,
              label:
                (si.name as string) || (si.label as string) || String(si.id),
            });
          });
        }
      })
      .catch((err: unknown) => {
        const e = err as { status?: number };
        if (e && (e.status === 401 || e.status === 404)) {
          navigate("/login");
          return;
        }
      });

    return () => {
      mounted = false;
    };
  }, [selectedHall, navigate]);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
        <Box sx={{ width: "calc(100% - 320px)", bgcolor: "transparent" }}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel id="hall-select-label">Hall</InputLabel>
              <Select
                labelId="hall-select-label"
                value={selectedHall}
                label="Hall"
                onChange={(e) => setSelectedHall(String(e.target.value))}
              >
                {halls.map((h) => (
                  <MenuItem key={h.id} value={h.id}>
                    {h.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <MapCanvas mapSrc={hallImages[selectedHall] ?? "/maps/hallD.png"} />
        </Box>

        <aside style={{ width: 300 }}>
          <Card
            elevation={2}
            sx={{
              borderRadius: 2,
              p: 1.5,
              background: "linear-gradient(180deg, #ffffff, #fbfdff)",
            }}
          >
            <CardContent>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
                  <MapIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    {hallLabel || "Select a hall"}
                  </Typography>
                  <Chip
                    label={availability[selectedHall] ? "Available" : "Booked"}
                    color={availability[selectedHall] ? "success" : "default"}
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </Stack>

              <Divider sx={{ my: 1 }} />

              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mb: 1 }}
                >
                  Last upload
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    bgcolor: "#f6fffb",
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    border: "1px solid rgba(0,0,0,0.04)",
                  }}
                >
                  {/* <Avatar
                    sx={{
                      bgcolor: "transparent",
                      color: "primary.main",
                      width: 40,
                      height: 40,
                      border: "1px solid rgba(16,185,129,0.08)",
                      boxShadow: "none",
                      mr: 1,
                    }}
                    variant="rounded"
                  >
                    <AccessTimeIcon fontSize="small" />
                  </Avatar> */}
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {lastUpload[selectedHall]
                        ? formatUploadDate(lastUpload[selectedHall])
                        : "No uploads yet"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {lastUpload[selectedHall]
                        ? "Most recent map upload"
                        : "You can upload a map from Edit"}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <StatusButton
                status="confirm"
                fullWidth
                onClick={() => setEditOpen(true)}
                sx={{ mb: 1 }}
              >
                Edit map
              </StatusButton>

              <StatusButton
                status="info"
                fullWidth
                onClick={() => {
                  const src = hallImages[selectedHall] ?? "/maps/hallD.png";
                  try {
                    // open image in new tab for quick preview
                    window.open(src, "_blank");
                  } catch (e) {
                    console.warn("Unable to open map preview", e);
                  }
                }}
                sx={{ mt: 1 }}
                startIcon={<VisibilityIcon />}
              >
                View map
              </StatusButton>

              {/* moved Disable/Enable control into the Edit dialog for clearer UX */}
            </CardContent>
          </Card>

          <MapEditDialog
            open={editOpen}
            hallId={selectedHall}
            hallLabel={hallLabel}
            currentImage={hallImages[selectedHall]}
            onClose={() => setEditOpen(false)}
            availability={availability[selectedHall]}
            onToggleAvailability={async (newVal: boolean) => {
              const id = selectedHall;
              // optimistic UI
              setAvailability((a) => ({ ...a, [id]: newVal }));
              try {
                // backend expects 'available' or 'booked'
                await updateHall(id, {
                  status: newVal ? "available" : "booked",
                });
              } catch (err: unknown) {
                const e = err as { status?: number };
                if (e && (e.status === 401 || e.status === 404)) {
                  navigate("/login");
                  return;
                }
                // revert on error
                setAvailability((a) => ({ ...a, [id]: !newVal }));
                throw err;
              }
            }}
            onSave={async ({ image, imageFile }) => {
              const id = selectedHall;
              // immediate optimistic UI updates: record last upload and image preview
              setLastUpload((l) => ({
                ...l,
                [id]: new Date().toLocaleDateString(),
              }));

              if (image) setHallImages((m) => ({ ...m, [id]: image }));

              // Persist changes to backend
              try {
                // If a file was selected, upload it first to the dedicated endpoint
                if (imageFile) {
                  const uploadResp = await uploadHallImage(id, imageFile);
                  // If backend returns a new image URL, update it
                  const newUrl =
                    uploadResp?.imageUrl ||
                    uploadResp?.url ||
                    uploadResp?.data?.imageUrl;
                  if (newUrl) setHallImages((m) => ({ ...m, [id]: newUrl }));
                }

                // Note: stall counts are not managed from this dialog anymore.
              } catch (err: unknown) {
                const e2 = err as { status?: number };
                if (e2 && (e2.status === 401 || e2.status === 404)) {
                  navigate("/login");
                  return;
                }
                console.error("Failed to persist hall changes", err);
              } finally {
                setEditOpen(false);
              }
            }}
          />
        </aside>
      </Box>
    </Box>
  );
}
