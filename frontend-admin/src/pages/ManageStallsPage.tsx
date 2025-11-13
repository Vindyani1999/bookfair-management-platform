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

type Stall = {
  id: string;
  name: string;
  cost: number;
  size: "Small" | "Medium" | "Large";
};

type Hall = {
  id: string;
  name: string;
  stalls: Stall[];
};

const hallsMock: Hall[] = [
  {
    id: "hall-a",
    name: "Hall A",
    stalls: [
      { id: "01", name: "Stall 1", cost: 1500, size: "Small" },
      { id: "02", name: "Stall 2", cost: 2000, size: "Medium" },
      { id: "03", name: "Stall 3", cost: 2500, size: "Large" },
    ],
  },
  {
    id: "hall-b",
    name: "Hall B",
    stalls: [
      { id: "04", name: "Stall 4", cost: 1200, size: "Small" },
      { id: "05", name: "Stall 5", cost: 2200, size: "Large" },
    ],
  },
  {
    id: "hall-c",
    name: "Hall C",
    stalls: [
      { id: "06", name: "Stall 6", cost: 1800, size: "Medium" },
    ],
  },
];

export default function ManageStallsPage() {
  const [selectedHall, setSelectedHall] = useState<string>(hallsMock[0].id);

  const halls = useMemo(() => hallsMock, []);

  const handleHallChange = (e: SelectChangeEvent<string>) => {
    setSelectedHall(e.target.value as string);
  };

  const currentStalls = useMemo(() => {
    const hall = halls.find((h) => h.id === selectedHall);
    return (
      hall?.stalls.map((s) => ({ id: s.id, stall: `${hall.name} - ${s.name}`, cost: s.cost, size: s.size })) || []
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
        <IconButton size="small" color="success" onClick={() => console.log("edit", row.id)} aria-label={`edit-${row.id}`}>
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
        <IconButton size="small" color="error" onClick={() => console.log("delete", row.id)} aria-label={`delete-${row.id}`}>
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
        <Select labelId="hall-select-label" value={selectedHall} label="Select Hall" onChange={handleHallChange}>
          {halls.map((h) => (
            <MenuItem key={h.id} value={h.id}>
              {h.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <ReusableTable columns={columns} rows={currentStalls as Row[]} showSearch searchPlaceholder="Search stalls..." defaultRowsPerPage={5} />
    </Box>
  );
}
