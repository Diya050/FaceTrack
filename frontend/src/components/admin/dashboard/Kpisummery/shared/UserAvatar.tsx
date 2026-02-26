import { Avatar, alpha } from "@mui/material";
import { COLORS } from "../../../../../theme/dashboardTheme";

export default function UserAvatar({ name, size = 36 }: { name: string; size?: number }) {
  const palette = [
    COLORS.present || "#6ECA97",
    COLORS.early   || "#7A9FC2",
    COLORS.unknown || "#A78BFA", 
    COLORS.late    || "#D4A85A",
    COLORS.absent  || "#E07070",
  ];
  const rawColor = palette[(name?.charCodeAt(0) ?? 0) % palette.length];
  const color = rawColor || COLORS.navy || "#343B55";
 return (
    <Avatar
      sx={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        fontWeight: 800,
        bgcolor: alpha(color, 0.12), 
        color: color,
        border: `1.5px solid ${alpha(color, 0.2)}`,
      }}
    >
      {name?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
    </Avatar>
  );
}