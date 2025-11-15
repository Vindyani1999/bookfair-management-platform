import { useMemo, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ReusableTable from "../components/atoms/ReusableTable";
import type { Column } from "../types/types";

import { halls as adminHalls, stalls as adminStalls } from "../data/halls";

export default function ManageStallsPage() {
  const [selectedHall, setSelectedHall] = useState<string>(adminHalls[0].id);

  const halls = useMemo(() => adminHalls, []);

  const handleHallChange = (e: SelectChangeEvent<string>) => {
    setSelectedHall(e.target.value as string);
  };

  const currentStalls = useMemo(() => {
    const hall = halls.find((h) => h.id === selectedHall);
    const stallsForHall = adminStalls.filter((s) => s.hallId === selectedHall);
    // If there are no explicit stalls, create placeholder numbered stalls up to the count
    return (
      stallsForHall.map((s, idx) => ({
        id: s.id,
        stall: `${hall?.label || hall?.name || "Hall"} - ${
          s.label || `Stall ${idx + 1}`
        }`,
        cost: 0,
        size: "Medium",
      })) || []
    );
  }, [halls, selectedHall]);

  type Row = { id: string; stall: string; cost: number; size: string };

  const columns: Column<Row>[] = [
    { id: "id", header: "ID", field: "id", width: 60 },
    { id: "stall", header: "Stall", field: "stall" },
    {
      id: "cost",
      header: "Cost",
      field: "cost",
      width: 120,
      render: (row: Row) => `Rs. ${row.cost}`,
      align: "right",
      sortable: true,
    },
    { id: "size", header: "Size", field: "size", width: 120, align: "center" },
    {
      id: "edit",
      header: "Edit",
      width: 80,
      align: "center",
      render: (row: Row) => (
        <IconButton
          size="small"
          color="success"
          onClick={() => console.log("edit", row.id)}
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
          onClick={() => console.log("delete", row.id)}
          aria-label={`delete-${row.id}`}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Manage Stalls
      </Typography>

      <FormControl sx={{ minWidth: 220, mb: 2 }} size="small">
        <InputLabel id="hall-select-label">Select Hall</InputLabel>
        <Select
          labelId="hall-select-label"
          value={selectedHall}
          label="Select Hall"
          onChange={handleHallChange}
        >
          {halls.map((h) => (
            <MenuItem key={h.id} value={h.id}>
              {h.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <ReusableTable
        columns={columns}
        rows={currentStalls as Row[]}
        showSearch
        searchPlaceholder="Search stalls..."
        defaultRowsPerPage={5}
      />
    </Box>
  );
}
