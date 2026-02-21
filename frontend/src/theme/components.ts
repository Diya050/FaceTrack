import type { Components } from "@mui/material/styles";

export const components: Components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
      },
    },
  },

  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      },
    },
  },

  MuiTextField: {
    defaultProps: {
      variant: "outlined",
    },
  },
};
