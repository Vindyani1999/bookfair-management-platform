import UserProfileForm from "../components/organisms/UserProfileForm";
import { Box } from "@mui/material";
import PageHeader from "../components/molecules/PageHeader";
const SettingsPage = () => {
  return (
    <Box sx={{ p: 0 }}>
      <PageHeader
        title="Settings"
        subtitle="Manage your account and preferences"
        height={160}
        image="/settings.png"
      />
      <Box sx={{ px: { xs: 3, md: 6 }, py: 4 }}>
        <Box
          sx={{
            width: "100%",
            height: "100vh",
            bgcolor: "#DACDC9",
            overflowY: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: "900px",
              bgcolor: "#EDF1F3",
              borderRadius: "30px",
              boxShadow: "5px 5px 8px 0px rgba(0, 0, 0, 0.25)",
              p: { xs: 3, sm: 4, md: 5 },
              my: 2,
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
