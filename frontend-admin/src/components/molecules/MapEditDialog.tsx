import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  IconButton,
} from "@mui/material";
import type { MapEditDialogProps } from "../../types/types";
import CloseIcon from "@mui/icons-material/Close";
import StatusButton from "../atoms/StatusButton";

export default function MapEditDialog({
  open,
  hallId,
  hallLabel,
  currentImage,
  currentStallCount = 0,
  onClose,
  onSave,
}: MapEditDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>(currentImage);
  const [stallCount, setStallCount] = useState<number>(currentStallCount);

  useEffect(() => {
    setPreview(currentImage);
    setStallCount(currentStallCount);
    setFile(null);
  }, [currentImage, currentStallCount, open]);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography sx={{ fontWeight: 700 }}>
          Edit map — {hallLabel ?? hallId}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Upload new map image
            </Typography>
            <Box sx={{ mb: 1 }}>
              <input
                accept="image/*"
                id="map-upload"
                type="file"
                style={{ display: "none" }}
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              <label htmlFor="map-upload">
                <Button variant="outlined" component="span">
                  Choose file
                </Button>
              </label>
            </Box>

            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Preview
              </Typography>
              <Box
                sx={{
                  mt: 1,
                  borderRadius: 1,
                  overflow: "hidden",
                  bgcolor: "#f7faf9",
                  border: "1px solid rgba(0,0,0,0.04)",
                  height: 200,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="map preview"
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      display: "block",
                    }}
                  />
                ) : (
                  <Typography color="text.secondary">No image</Typography>
                )}
              </Box>
            </Box>
          </Box>

          <Box sx={{ width: 220 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Stall count
            </Typography>
            <TextField
              type="number"
              value={stallCount}
              onChange={(e) =>
                setStallCount(Math.max(0, parseInt(e.target.value || "0", 10)))
              }
              inputProps={{ min: 0 }}
              fullWidth
              size="small"
            />

            <Box sx={{ mt: 3 }}>
              <Typography variant="caption" color="text.secondary">
                Note: uploading an image only updates local preview. Persisting
                to server requires API integration.
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <StatusButton
          status="confirm"
          onClick={() => {
            onSave({ image: preview, stalls: stallCount });
            onClose();
          }}
        >
          Save
        </StatusButton>
      </DialogActions>
    </Dialog>
  );
}
