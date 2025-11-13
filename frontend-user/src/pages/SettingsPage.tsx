import UserProfileForm from "../components/organisms/UserProfileForm";
import { Box } from "@mui/material";
import PageHeader from "../components/molecules/PageHeader";
const SettingsPage = () => {
  return (
    <Box sx={{ overflowY: "auto", p: 0 }}>
      <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1100 }}>
        <PageHeader
          title="Settings"
          subtitle="Manage your account and preferences"
          height={160}
          image="/settings.png"
        />
      </Box>

      <Box sx={{ pt: 25, px: { xs: 3, md: 6 } }}>
        <Box
          sx={{
            width: "100%",
            bgcolor: "transparent",
            // let the parent scroll container handle height; align items to top so
            // the form sits just below the PageHeader with minimal gap
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            p: { xs: 1, sm: 2, md: 3 },
            overflowY: "auto",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: "900px",
              bgcolor: "#EDF1F3",
              borderRadius: "20px",
              boxShadow: "5px 5px 12px rgba(0,0,0,0.08)",
              p: { xs: 3, sm: 4, md: 5 },
              mt: -3,
            }}
          >
            <UserProfileForm />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SettingsPage;
