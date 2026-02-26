import { Box, Typography, Stack } from "@mui/material";
import { COLORS } from "../../../../../theme/dashboardTheme";
import SectionLabel from "../../Kpisummery/shared/SectionLabel";

interface ChartWrapperProps {
  label: string;
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  height?: number | string;
}

export default function ChartWrapper({
  label,
  title,
  children,
  action,
  height = 250,
}: ChartWrapperProps) {
  return (
    <Box sx={{ width: "100%" }}>
      {/* Header Area */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        sx={{ mb: 3 }}
      >
        <Box>
          <SectionLabel>{label}</SectionLabel>
          <Typography
            variant="h6"
            sx={{
              color: COLORS.navy,
              fontWeight: 800,
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>
        </Box>

        
        {action && <Box>{action}</Box>}
      </Stack>

     
      <Box 
        sx={{ 
          height: height, 
          position: "relative",
         
          animation: "fadeIn 0.5s ease-in",
          "@keyframes fadeIn": {
            from: { opacity: 0, transform: "translateY(5px)" },
            to: { opacity: 1, transform: "translateY(0)" }
          }
        }}
      >
        {children}
      </Box>
    </Box>
  );
}