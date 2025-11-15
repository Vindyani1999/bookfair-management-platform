import { Box, Button } from "@mui/material";
import ReusableTable from "../components/atoms/ReusableTable";
import StatCard from "../components/atoms/StatCard";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import type { Column } from "../types/types";

type Row = {
  id: string;
  stall: string;
  date: string;
  name: string;
  business?: string;
};

const mockRows: Row[] = [
  {
    id: "01",
    stall: "Hall D - Stall 4",
    date: "October 28, 2025",
    name: "John Smith",
    business: "-",
  },
  {
    id: "02",
    stall: "Hall D - Stall 7",
    date: "October 28, 2025",
    name: "John Smith",
    business: "-",
  },
  {
    id: "03",
    stall: "Hall D - Stall 20",
    date: "October 28, 2025",
    name: "John Smith",
    business: "-",
  },
];

export default function BookingsPage() {
  // derive stats from rows so cards stay in sync with the table
  const total = mockRows.length + 247; // mimic larger pool (show 250)
  const reserved = 130; // example static
  const available = total - reserved;

  const columns: Column<Row>[] = [
    { id: "id", header: "ID", field: "id", width: 60 },
    { id: "stall", header: "Stall", field: "stall" },
    { id: "date", header: "Date", field: "date", width: 160 },
    { id: "name", header: "Name", field: "name" },
    { id: "business", header: "Business name", field: "business" },
    {
      id: "remove",
      header: "Remove",
      align: "center",
      width: 120,
      render: (row: Row) => (
        <Button
          color="error"
          size="small"
          startIcon={<DeleteOutlineIcon />}
          onClick={() => console.log("remove", row.id)}
        >
          Remove
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          mb: 2,
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3,1fr)" },
        }}
      >
        <StatCard
          title="Total Stalls"
          value={total}
          subtitle={`Halls allocated for reservation: 12`}
          colorKey="total"
        />
        <StatCard
          title="Available Stalls"
          value={available}
          subtitle={`Currently available`}
          colorKey="available"
        />
        <StatCard
          title="Reserved Stalls"
          value={reserved}
          subtitle={`Reserved`}
          colorKey="reserved"
        />
      </Box>

      <ReusableTable
        columns={columns}
        rows={mockRows}
        showSearch
        searchPlaceholder="Search stalls, names..."
        defaultRowsPerPage={5}
        rowsPerPageOptions={[5, 10, 25]}
        toolbarActions={null}
      />
    </Box>
  );
}
