import type { ReactElement } from "react";
import { Box, Typography } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { type StatCardProps } from "../../types/types";

export default function StatCard({
  title,
  value,
  subtitle,
  colorKey,
}: StatCardProps) {
  const gradients = [
    "linear-gradient(135deg,#86efac 0%,#34d399 100%)",
    "linear-gradient(135deg,#7c3aed 0%,#ec4899 100%)",
    "linear-gradient(135deg,#2563eb 0%,#60a5fa 100%)",
  ];

  const gradientMap: Record<string, string> = {
    total: gradients[0],
    users: gradients[0],
    available: gradients[1],
    companies: gradients[1],
    reserved: gradients[2],
    products: gradients[2],
  };

  const fallbackIdx =
    Math.abs(
      (title || "")
        .split("")
        .reduce((acc: number, ch: string) => acc + ch.charCodeAt(0), 0)
    ) % gradients.length;

  const bg =
    (colorKey && gradientMap[colorKey]) ||
    gradientMap[title?.toLowerCase()] ||
    gradients[fallbackIdx];

  return (
    <Box
      sx={{
        background: bg,
        color: "rgba(255,255,255,0.95)",
        position: "relative",
        borderRadius: 2,
        px: 3,
        py: 3,
        minWidth: 180,
        textAlign: "left",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
        border: "1px solid rgba(255,255,255,0.08)",
        overflow: "hidden",
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, opacity: 0.95 }}>
          {title}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "baseline",
          gap: 1,
          flexDirection: "column",
          zIndex: 1,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 800, fontSize: "1.5rem" }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="caption" sx={{ opacity: 0.95 }}>
            {subtitle}
          </Typography>
        )}
      </Box>

      {/* Decorative bottom-right icon (faint) */}
      {(() => {
        const key = (colorKey || title || "").toString().toLowerCase();
        const map: Record<string, ReactElement> = {
          total: <BusinessIcon sx={{ fontSize: 84 }} />,
          users: <BusinessIcon sx={{ fontSize: 84 }} />,
          available: <CheckCircleOutlineIcon sx={{ fontSize: 84 }} />,
          companies: <CheckCircleOutlineIcon sx={{ fontSize: 84 }} />,
          reserved: <BookmarkBorderIcon sx={{ fontSize: 84 }} />,
          products: <BookmarkBorderIcon sx={{ fontSize: 84 }} />,
        };
        const deco = map[key] || map[Object.keys(map)[0]];
        return (
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              bottom: -12,
              right: -12,
              zIndex: 0,
              opacity: 0.45,
              color: "rgba(255,255,255,0.5)",
              transform: "rotate(-12deg)",
              pointerEvents: "none",
            }}
          >
            {deco}
          </Box>
        );
      })()}
    </Box>
  );
}
