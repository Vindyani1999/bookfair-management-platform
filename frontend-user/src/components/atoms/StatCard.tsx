import { Box, Typography } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import type { JSX } from "react";

type Props = {
  title: string;
  value: string | number;
  /** optional small subtitle / metric (e.g. "Available") */
  subtitle?: string;
  /** optional color key to pick a gradient */
  colorKey?: string;
};

export default function StatCard({ title, value, subtitle, colorKey }: Props) {
  // three curated gradients (orange -> purple -> blue) to match the provided mock
  const gradients = [
    // greenish (warm teal -> green)
    "linear-gradient(135deg,#297746 0%,#34d399 100%)",
    // vibrant purple -> magenta
    "linear-gradient(135deg,#7c3aed 0%,#ec4899 100%)",
    // deep blue -> sky
    "linear-gradient(135deg,#2563eb 0%,#60a5fa 100%)",
  ];

  // allow explicit mapping of semantic keys to a gradient
  const gradientMap: Record<string, string> = {
    total: gradients[0],
    users: gradients[0],
    available: gradients[1],
    companies: gradients[1],
    reserved: gradients[2],
    products: gradients[2],
  };

  // choose background: prefer explicit colorKey mapping, otherwise fall back
  // to a deterministic selection based on title
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
        borderRadius: "20px",
        px: { xs: 3, sm: 4 },
        py: { xs: 2.5, sm: 3.5 },
        minWidth: 180,
        minHeight: 96,
        textAlign: "left",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0 8px 24px rgba(15,23,42,0.12)",
        border: "1px solid rgba(255,255,255,0.08)",
        // ensure decorative icons that are intentionally offset outside the card
        // do not visually bleed outside the rounded tile
        overflow: "hidden",
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            opacity: 0.98,
            fontFamily: "Roboto Slab",
            fontSize: { xs: "0.95rem", md: "1.05rem" },
            letterSpacing: 0.2,
          }}
        >
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
        <Typography
          variant="h3"
          sx={{
            fontWeight: 900,
            fontSize: { xs: "1.5rem", md: "2rem" },
            lineHeight: 1,
          }}
        >
          {value}
        </Typography>
        {subtitle && (
          <Typography
            variant="body2"
            sx={{ opacity: 0.95, fontSize: { xs: "0.75rem", md: "0.9rem" } }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
      {/* Decorative bottom-right icon (faint) */}
      {(() => {
        // choose a decorative icon based on semantic key or title
        const key = (colorKey || title || "").toString().toLowerCase();
        const map: Record<string, JSX.Element> = {
          total: <BusinessIcon sx={{ fontSize: 96 }} />,
          users: <BusinessIcon sx={{ fontSize: 96 }} />,
          available: <CheckCircleOutlineIcon sx={{ fontSize: 96 }} />,
          companies: <CheckCircleOutlineIcon sx={{ fontSize: 96 }} />,
          reserved: <BookmarkBorderIcon sx={{ fontSize: 96 }} />,
          products: <BookmarkBorderIcon sx={{ fontSize: 96 }} />,
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
              opacity: 0.5,
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
