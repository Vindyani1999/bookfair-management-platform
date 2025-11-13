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

export default function ManageMapsPage() {
  const [selectedHall, setSelectedHall] = useState<string>(halls[0]?.id ?? "");
  const [availability, setAvailability] = useState<Record<string, boolean>>(
    () => Object.fromEntries(halls.map((h) => [h.id, true]))
  );
  const hallLabel = useMemo(
    () => halls.find((h) => h.id === selectedHall)?.label || "",
    [selectedHall]
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

          <MapCanvas
            mapSrc={hallMapImages[selectedHall] ?? "/maps/hallD.png"}
          />
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
                    {stalls.filter((s) => s.hallId === selectedHall).length}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Last upload
                  </Typography>
                  <Typography variant="body2">27/10/2025</Typography>
                </Grid>
              </Grid>

              <StatusButton
                status="confirm"
                fullWidth
                onClick={() => {
                  /* open edit page */
                }}
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
        </aside>
      </Box>
    </Box>
  );
}
