import { useMemo, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import MapCanvas from "../components/atoms/MapCanvas";
import { halls, hallMapImages, stalls } from "../data/halls";
import { Avatar, Divider, Stack, Chip, Grid } from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import StatusButton from "../components/atoms/StatusButton";
import MapEditDialog from "../components/molecules/MapEditDialog";
import { stalls as adminStalls } from "../data/halls";

export default function ManageMapsPage() {
  const [selectedHall, setSelectedHall] = useState<string>(halls[0]?.id ?? "");
  const [availability, setAvailability] = useState<Record<string, boolean>>(
    () => Object.fromEntries(halls.map((h) => [h.id, true]))
  );
  const hallLabel = useMemo(
    () => halls.find((h) => h.id === selectedHall)?.label || "",
    [selectedHall]
  );

  // local state for images and stall counts so admin edits can be previewed immediately
  const [hallImages, setHallImages] = useState<Record<string, string>>(() => {
    // prefer explicit thumbnails, then the hallMapImages mapping, finally a fallback image
    const map: Record<string, string> = {};
    for (const h of halls) {
      map[h.id] =
        (hallMapImages[h.id as keyof typeof hallMapImages] as string) ||
        (halls.find((x) => x.id === h.id)
          ? (hallMapImages[h.label as keyof typeof hallMapImages] as string)
          : undefined) ||
        `/maps/${h.label.replace(/\s+/g, "") || h.id}.png` ||
        "/maps/hallD.png";
    }
    return map;
  });

  const [stallCounts, setStallCounts] = useState<Record<string, number>>(() =>
    Object.fromEntries(
      halls.map((h) => [h.id, stalls.filter((s) => s.hallId === h.id).length])
    )
  );

  const [editOpen, setEditOpen] = useState(false);
  const [lastUpload, setLastUpload] = useState<Record<string, string>>(() =>
    Object.fromEntries(halls.map((h) => [h.id, "-"]))
  );

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
                    label={
                      availability[selectedHall] ? "Available" : "Not available"
                    }
                    color={availability[selectedHall] ? "success" : "default"}
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </Stack>

              <Divider sx={{ my: 1 }} />

              <Grid container spacing={1} sx={{ mb: 2 }}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Total stalls
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {stallCounts[selectedHall] ?? 0}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Last upload
                  </Typography>
                  <Typography variant="body2">
                    {lastUpload[selectedHall]}
                  </Typography>
                </Grid>
              </Grid>

              <StatusButton
                status="confirm"
                fullWidth
                onClick={() => setEditOpen(true)}
                sx={{ mb: 1 }}
              >
                Edit map
              </StatusButton>

              <StatusButton
                status={availability[selectedHall] ? "cancel" : "confirm"}
                fullWidth
                onClick={() =>
                  setAvailability((a) => ({
                    ...a,
                    [selectedHall]: !a[selectedHall],
                  }))
                }
              >
                {availability[selectedHall] ? "Disable hall" : "Enable hall"}
              </StatusButton>
            </CardContent>
          </Card>

          <MapEditDialog
            open={editOpen}
            hallId={selectedHall}
            initialImage={hallImages[selectedHall]}
            initialStalls={stallCounts[selectedHall]}
            onClose={() => setEditOpen(false)}
            onSave={({ image, stalls: newCount }) => {
              const id = selectedHall;
              // update stall counts in local state
              setStallCounts((s) => ({ ...s, [id]: newCount }));
              setLastUpload((l) => ({
                ...l,
                [id]: new Date().toLocaleDateString(),
              }));

              // update image preview if provided
              if (image) {
                setHallImages((m) => ({ ...m, [id]: image }));
              }

              // Mutate the adminStalls array exported from data/halls so other pages can read the changes.
              // Ensure there are exactly `newCount` stalls for this hall.
              const existing = adminStalls.filter((s) => s.hallId === id);
              const existingCount = existing.length;
              if (newCount > existingCount) {
                // add new stalls
                const toAdd = newCount - existingCount;
                for (let i = 0; i < toAdd; i++) {
                  const newId = `stall-${Date.now()}-${Math.floor(
                    Math.random() * 1000
                  )}`;
                  adminStalls.push({
                    id: newId,
                    hallId: id,
                    label: `Stall ${existingCount + i + 1}`,
                  });
                }
              } else if (newCount < existingCount) {
                // remove extra stalls (remove from end)
                let removed = 0;
                for (
                  let i = adminStalls.length - 1;
                  i >= 0 && removed < existingCount - newCount;
                  i--
                ) {
                  if (adminStalls[i].hallId === id) {
                    adminStalls.splice(i, 1);
                    removed++;
                  }
                }
              }

              setEditOpen(false);
            }}
          />
        </aside>
      </Box>
    </Box>
  );
}
