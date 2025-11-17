import { Button } from "@mui/material";
import type { ButtonProps, Theme } from "@mui/material";
import type { SystemStyleObject } from "@mui/system";
import type { Status } from "../../types/types";

interface Props extends Omit<ButtonProps, "color"> {
  status: Status;
}

const palette: Record<
  Status,
  { bg: string; hover: string; text: string; boxShadow?: string }
> = {
  delete: {
    bg: "linear-gradient(90deg,#fca5a5 0%,#ef4444 100%)",
    hover: "linear-gradient(90deg,#f87171 0%,#dc2626 100%)",
    text: "#fff",
    boxShadow: "0 8px 20px rgba(239,68,68,0.16)",
  },
  confirm: {
    bg: "linear-gradient(90deg,#86efac 0%,#10b981 100%)",
    hover: "linear-gradient(90deg,#34d399 0%,#059669 100%)",
    text: "#062e1a",
    boxShadow: "0 8px 20px rgba(16,185,129,0.12)",
  },
  cancel: {
    bg: "linear-gradient(90deg,#f3f4f6 0%,#e5e7eb 100%)",
    hover: "linear-gradient(90deg,#e6e7ea 0%,#d1d5db 100%)",
    text: "#0f172a",
    boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
  },
  info: {
    bg: "linear-gradient(90deg,#bfdbfe 0%,#60a5fa 100%)",
    hover: "linear-gradient(90deg,#93c5fd 0%,#3b82f6 100%)",
    text: "#042a60",
    boxShadow: "0 8px 20px rgba(59,130,246,0.12)",
  },
  warning: {
    bg: "linear-gradient(90deg,#fde68a 0%,#f97316 100%)",
    hover: "linear-gradient(90deg,#fbbf24 0%,#fb923c 100%)",
    text: "#3a2700",
    boxShadow: "0 8px 20px rgba(249,115,22,0.12)",
  },
};

export default function StatusButton({ status, children, sx, ...rest }: Props) {
  const theme = palette[status] ?? palette.info;

  const baseStyles = {
    textTransform: "none",
    borderRadius: 8,
    px: 2.2,
    py: 0.6,
    minWidth: 86,
    fontWeight: 600,
    boxShadow: theme.boxShadow,
    backgroundImage: theme.bg,
    color: theme.text,
    "&:hover": {
      backgroundImage: theme.hover,
      boxShadow: theme.boxShadow,
    },
  };

  const mergedSx = (theme: Theme) => {
    const base = baseStyles as SystemStyleObject<Theme>;
    const extra =
      typeof sx === "function"
        ? (sx as (t: Theme) => SystemStyleObject<Theme>)(theme)
        : (sx as SystemStyleObject<Theme> | undefined);
    return { ...base, ...(extra || {}) } as SystemStyleObject<Theme>;
  };

  return (
    <Button {...rest} variant="contained" sx={mergedSx}>
      {children}
    </Button>
  );
}
