import { Box, Typography } from "@mui/material";

type Props = {
  title: string;
  value: string | number;
};

export default function StatCard({ title, value }: Props) {
  return (
    <Box
      sx={{
        background: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(6px)",
        borderRadius: "16px",
        /* directional shadow to the right and bottom for a stronger 3D appearance */
        boxShadow: "8px 18px 40px rgba(16,24,40,0.12)",
        px: { xs: 4, sm: 5 },
        py: { xs: 1, sm: 2 },
        minWidth: 240,
        textAlign: "center",
        border: "1px solid rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography
        variant="body2"
        sx={{ color: "#6b6b6b", fontWeight: 700, fontFamily: "Roboto Slab" }}
      >
        {title}
      </Typography>
      <Typography
        variant="h4"
        sx={{
          color: "#111827",
          fontWeight: 800,
          mt: 1.25,
          fontFamily: "Roboto Slab",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}
