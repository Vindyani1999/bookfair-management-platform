import { useAuth } from "../context/AuthContext";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  Paper,
} from "@mui/material";
import ReusableTable from "../components/atoms/ReusableTable";
import { LogoutOutlined } from "@mui/icons-material";

export default function Dashboard() {
  const { admin, logout } = useAuth();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{ bgcolor: "#fff", color: "#333" }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 600 }}
          >
            Admin Dashboard
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body1">Welcome, {admin?.adminName}</Typography>

            <Button
              variant="contained"
              startIcon={<LogoutOutlined />}
              onClick={logout}
              sx={{
                bgcolor: "#000",
                "&:hover": {
                  bgcolor: "#ee5a6f",
                },
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2, minHeight: "70vh" }}>
          <Typography variant="h4" gutterBottom fontWeight={600}>
            Book Fair Management System
          </Typography>

          {/* Example usage of reusable table component */}
          <ReusableTable
            columns={[
              { id: "stall", header: "Stall", field: "stall", sortable: true },
              {
                id: "halls",
                header: "Halls Allocated",
                field: "halls",
                sortable: true,
              },
              {
                id: "available",
                header: "Available",
                field: "available",
                sortable: true,
              },
              {
                id: "reserved",
                header: "Reserved",
                field: "reserved",
                sortable: true,
              },
              {
                id: "cost",
                header: "Cost",
                field: "cost",
                align: "right",
                render: (r: Record<string, unknown>) =>
                  `Rs. ${String(r.cost ?? "")}`,
              },
            ]}
            rows={[
              {
                stall: "A-101",
                halls: 3,
                available: 2,
                reserved: 1,
                cost: 5000,
              },
              {
                stall: "A-102",
                halls: 2,
                available: 1,
                reserved: 1,
                cost: 3000,
              },
              {
                stall: "B-201",
                halls: 1,
                available: 1,
                reserved: 0,
                cost: 1500,
              },
              {
                stall: "B-202",
                halls: 4,
                available: 2,
                reserved: 2,
                cost: 8000,
              },
              {
                stall: "C-301",
                halls: 2,
                available: 0,
                reserved: 2,
                cost: 4200,
              },
              {
                stall: "C-302",
                halls: 5,
                available: 3,
                reserved: 2,
                cost: 12000,
              },
              {
                stall: "D-401",
                halls: 2,
                available: 2,
                reserved: 0,
                cost: 2500,
              },
            ]}
            toolbarActions={
              <Button variant="contained" size="small">
                New Booking
              </Button>
            }
            onRowClick={(r) => console.log("row clicked", r)}
          />
        </Paper>
      </Container>
    </Box>
  );
}
