import React from "react";
import { Box, Typography } from "@mui/material";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  /** CSS background-image url string (optional) */
  image?: string;
  /** height in px or any CSS unit */
  height?: number | string;
  /** Dim the background image for better text contrast (default: true) */
  dim?: boolean;
};

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  image,
  height = 180,
}) => {
  const dimOverlay = true;
  const bg = image
    ? `linear-gradient(${
        dimOverlay ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.72)"
      }, ${
        dimOverlay ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.72)"
      }), url(${image})`
    : "linear-gradient(180deg, rgba(245,243,242,1), rgba(238,232,230,1))";

  return (
    <Box
      component="header"
      className="app-page-header"
      sx={{
        width: "100%",
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: bg,
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.06)",
        // Make the header stick to the top of its scroll container so pages
        // can keep it fixed while content below scrolls
        position: "sticky",
        top: 0,
        zIndex: 1100,
        backdropFilter: "saturate(120%) blur(4px)",
      }}
    >
      <Box sx={{ textAlign: "center", px: 2 }}>
        <Typography
          variant="h3"
          sx={{
            fontFamily: "Roboto Slab, serif",
            fontWeight: 700,
            color: image ? "#ffffff" : "#2c2c2c",
            fontSize: { xs: "1.5rem", md: "2rem" },
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="body2"
            sx={{
              color: image ? "rgba(255,255,255,0.85)" : "text.secondary",
              mt: 0.5,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default PageHeader;
