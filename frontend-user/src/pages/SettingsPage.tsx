import { Box, Typography } from "@mui/material";
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
        <Typography>Settings will be available here.</Typography>
      </Box>
    </Box>
  );
};

export default SettingsPage;
