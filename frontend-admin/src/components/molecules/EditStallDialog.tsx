import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Box,
  Avatar,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import StatusButton from "../atoms/StatusButton";

type Stall = {
  id: string;
  hallId: string;
  label: string;
};

type Props = {
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

export default function EditStallDialog({
  open,
  stall,
  initialHallId,
  onClose,
  onSave,
  saving = false,
}: Props) {
  const [label, setLabel] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [size, setSize] = useState<string>("small");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<string>("available");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (stall) {
      setLabel(stall.label || "");
    } else {
      setLabel("");
    }
    setPrice("");
    setSize("small");
    setName("");
    setDescription("");
    setStatus("available");
    setTouched(false);
  }, [stall]);

  const invalid = touched && label.trim().length === 0;
  const nameInvalid = !stall && touched && name.trim().length === 0;

  const handleSave = () => {
    setTouched(true);
    if (stall) {
      if (label.trim().length === 0) return;
    } else {
      if (name.trim().length === 0) return;
    }
    const id = stall?.id ?? `s-${initialHallId ?? "new"}-${Date.now()}`;
    const hallId = stall?.hallId ?? initialHallId ?? "unknown";
    // normalize price to a numeric value with two decimals
    const normalizedPrice =
      typeof price === "number" && !isNaN(price)
        ? Number(Number(price).toFixed(2))
        : 0;

    onSave({
      id,
      hallId,
      // when creating, use the provided name as the label if label is empty
      label: label.trim() || name.trim(),
      price: normalizedPrice,
      size,
      name: name || undefined,
      description: description || undefined,
      status: status || undefined,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
            <EditIcon />
          </Avatar>
          <Box>
            <Typography variant="h6">
              {stall ? "Edit Stall" : "Add Stall"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {stall
                ? "Modify stall details for management and pricing"
                : "Create a new stall for the selected hall"}
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 1 }}>
          {!stall ? (
            <TextField
              label="Stall name"
              value={name}
              onChange={(e) => setName(String(e.target.value))}
              onBlur={() => setTouched(true)}
              fullWidth
              size="small"
              error={nameInvalid}
              helperText={
                nameInvalid ? "Provide a non-empty name (e.g. 1, 2, A)" : " "
              }
              sx={{ mb: 1 }}
            />
          ) : (
            <TextField
              label="Stall label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onBlur={() => setTouched(true)}
              fullWidth
              size="small"
              error={invalid}
              helperText={invalid ? "Stall label is required" : " "}
            />
          )}

          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <TextField
              label="Price (Rs.)"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value === "" ? "" : Number(e.target.value))
              }
              type="number"
              inputProps={{ step: "0.01", min: 0 }}
              fullWidth
              size="small"
              helperText="Enter amount like 1000.00"
            />

            <TextField
              label="Size"
              select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              sx={{ width: 160 }}
              size="small"
            >
              <MenuItem value="small">Small</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="large">Large</MenuItem>
            </TextField>
          </Stack>

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            size="small"
            multiline
            rows={2}
            sx={{ mt: 2 }}
          />

          <TextField
            label="Status"
            select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            size="small"
            sx={{ mt: 2, width: 180 }}
          >
            <MenuItem value="available">Available</MenuItem>
            <MenuItem value="booked">Booked</MenuItem>
          </TextField>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2 }}>
        <StatusButton status="cancel" onClick={onClose} disabled={saving}>
          Cancel
        </StatusButton>
        <StatusButton status="confirm" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </StatusButton>
      </DialogActions>
    </Dialog>
  );
}
