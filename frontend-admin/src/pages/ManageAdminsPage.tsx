import { Box, Button } from "@mui/material";
import StatusButton from "../components/atoms/StatusButton";
import ReusableTable from "../components/atoms/ReusableTable";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import type { Column } from "../types/types";
import { useMemo, useState } from "react";
import AdminFormDialog from "../components/layouts/AdminFormDialog";
import type { AdminFormValues } from "../components/layouts/AdminFormDialog";

type AdminRow = {
  id: string;
  fullName: string;
  email: string;
  contact: string;
};

const initialAdmins: AdminRow[] = Array.from({ length: 8 }).map((_, i) => ({
  id: String(i + 1).padStart(2, "0"),
  fullName: `Admin User ${i + 1}`,
  email: `admin${i + 1}@book.me`,
  contact: `+91 90000${1000 + i}`,
}));

export default function ManageAdminsPage() {
  const [admins, setAdmins] = useState<AdminRow[]>(initialAdmins);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AdminRow | null>(null);

  const columns: Column<AdminRow>[] = [
    { id: "id", header: "ID", field: "id", width: 60 },
    { id: "fullName", header: "Full Name", field: "fullName" },
    { id: "email", header: "Email Address", field: "email" },
    { id: "contact", header: "Contact number", field: "contact" },
    {
      id: "edit",
      header: "Edit",
      width: 100,
      align: "center",
      render: (row: AdminRow) => (
        <Button
          variant="outlined"
          size="small"
          color="success"
          startIcon={<EditIcon />}
          onClick={() => handleEdit(row)}
        >
          Edit
        </Button>
      ),
    },
    {
      id: "remove",
      header: "Remove",
      width: 120,
      align: "center",
      render: (row: AdminRow) => (
        <Button
          variant="contained"
          size="small"
          color="error"
          startIcon={<DeleteOutlineIcon />}
          onClick={() => handleRemove(row.id)}
        >
          Remove
        </Button>
      ),
    },
  ];

  function handleAdd() {
    setEditing(null);
    setDialogOpen(true);
  }

  function handleEdit(row: AdminRow) {
    setEditing(row);
    setDialogOpen(true);
  }

  function handleRemove(id: string) {
    if (!window.confirm("Delete this admin?")) return;
    setAdmins((a) => a.filter((x) => x.id !== id));
  }

  function handleClose() {
    setDialogOpen(false);
    setEditing(null);
  }

  function handleSave(values: AdminFormValues) {
    if (editing) {
      // update
      setAdmins((a) =>
        a.map((r) =>
          r.id === editing.id
            ? {
                ...r,
                fullName: `${values.firstName} ${values.lastName}`,
                email: values.email,
                contact: values.contact,
              }
            : r
        )
      );
    } else {
      // create new
      const nextId = String(admins.length + 1).padStart(2, "0");
      const newAdmin: AdminRow = {
        id: nextId,
        fullName: `${values.firstName} ${values.lastName}`,
        email: values.email,
        contact: values.contact,
      };
      setAdmins((a) => [newAdmin, ...a]);
    }
    handleClose();
  }

  const rows = useMemo(() => admins, [admins]);

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box />
        <StatusButton
          status="confirm"
          onClick={handleAdd}
          size="small"
          sx={{ borderRadius: 4, boxShadow: "0 6px 18px rgba(20,60,120,0.08)" }}
        >
          + Add new Admin
        </StatusButton>
      </Box>

      <ReusableTable
        columns={columns}
        rows={rows}
        showSearch
        toolbarActions={null}
        searchPlaceholder="Search admins, emails..."
        defaultRowsPerPage={6}
      />

      <AdminFormDialog
        open={dialogOpen}
        mode={editing ? "edit" : "add"}
        initial={
          editing
            ? {
                id: editing.id,
                firstName: editing.fullName.split(" ")[0],
                lastName: editing.fullName.split(" ").slice(1).join(" "),
                email: editing.email,
                contact: editing.contact,
              }
            : undefined
        }
        onClose={handleClose}
        onSave={handleSave}
      />
    </Box>
  );
}
