import React from "react";
import { Box, Paper, Typography, Avatar, Link, useTheme } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import PageHeader from "../components/molecules/PageHeader";

const ContactItem: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string;
  href?: string;
}> = ({ icon, title, value, href }) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
      <Avatar
        variant="circular"
        sx={{
          bgcolor: "#f3efee",
          color: theme.palette.text.primary,
          width: 72,
          height: 72,
          boxShadow: "0 8px 18px rgba(16,24,40,0.12)",
        }}
      >
        {icon}
      </Avatar>

      <Box>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            textTransform: "uppercase",
            letterSpacing: 0.6,
          }}
        >
          {title}
        </Typography>
        {href ? (
          <Link
            href={href}
            underline="none"
            sx={{
              fontWeight: 700,
              display: "block",
              mt: 0.5,
              color: "text.primary",
              fontSize: "1.05rem",
            }}
          >
            {value}
          </Link>
        ) : (
          <Typography sx={{ fontWeight: 700, mt: 0.5, fontSize: "1.05rem" }}>
            {value}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

const HelpPage: React.FC = () => {
  return (
    <Box sx={{ p: 0, minHeight: "100vh", bgcolor: "transparent" }}>
      <PageHeader
        title="Reach Out to US"
        subtitle="We're happy to help — choose a contact method below"
        height={160}
        image="/contactus.png"
      />
      <Box
        sx={{
          //   pt: 22,
          maxWidth: "1000px",
          mx: "auto",
          mt: { xs: 2, md: 4 },
          px: { xs: 3, md: 6 },
        }}
      >
        <Paper
          elevation={2}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "stretch",
            minHeight: 520,
          }}
        >
          {/* Left content */}
          <Box sx={{ flex: 1, p: { xs: 4, md: 6 }, bgcolor: "#e6d6d2" }}>
            {/* <Typography
              variant="h4"
              sx={{
                mb: 1,
                fontWeight: 700,
                fontFamily: "Roboto Slab, serif",
                fontSize: { xs: "1.25rem", md: "1.5rem" },
                color: "#2c2c2c",
              }}
            >
              Reach Out to US
            </Typography> */}

            <Typography
              variant="body1"
              sx={{ color: "text.secondary", mb: 4, lineHeight: 1.7 }}
            >
              If you need assistance with your stall reservation or have
              questions about the booking process, our team is ready to help. We
              aim to respond within one business day. Choose a contact method
              and we'll take it from there.
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <ContactItem
                icon={<PhoneIcon fontSize="large" />}
                title="Phone"
                value="+94 89 3676"
                href="tel:+94893676"
              />
              <ContactItem
                icon={<EmailIcon fontSize="large" />}
                title="Email"
                value="bookme@gmail.com"
                href="mailto:bookme@gmail.com"
              />
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default HelpPage;
