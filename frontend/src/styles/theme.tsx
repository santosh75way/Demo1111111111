import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#0F70F0",
      light: "#EDF2FF",
      dark: "#0A52CC",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#6C63FF",
      light: "#F0ECFF",
      dark: "#5A54DB",
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#10B981",
      light: "#D1FAE5",
      dark: "#059669",
    },
    warning: {
      main: "#F59E0B",
      light: "#FEF3C7",
      dark: "#D97706",
    },
    error: {
      main: "#EF4444",
      light: "#FEE2E2",
      dark: "#DC2626",
    },
    info: {
      main: "#3B82F6",
      light: "#DBEAFE",
      dark: "#1D4ED8",
    },
    background: {
      default: "#F9FAFB",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#111827",
      secondary: "#6B7280",
      disabled: "#9CA3AF",
    },
    divider: "#E5E7EB",
    action: {
      hover: "#F3F4F6",
      selected: "#EDF2FF",
      disabled: "#F3F4F6",
      disabledBackground: "#F9FAFB",
    },
  },
  typography: {
    fontFamily: "'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', sans-serif",
    h1: {
      fontSize: "2rem",
      fontWeight: 700,
      letterSpacing: "-0.02em",
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "1.75rem",
      fontWeight: 700,
      letterSpacing: "-0.01em",
      lineHeight: 1.3,
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 700,
      letterSpacing: "-0.01em",
      lineHeight: 1.4,
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: 700,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: "1.125rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: 1.6,
    },
    caption: {
      fontSize: "0.75rem",
      fontWeight: 500,
      lineHeight: 1.4,
    },
    button: {
      fontWeight: 600,
      textTransform: "none",
      fontSize: "0.875rem",
      letterSpacing: "0.01em",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "0.5rem",
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.875rem",
          padding: "0.5rem 1rem",
          transition: "all 0.2s ease",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          },
        },
        contained: {
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          },
        },
        outlined: {
          border: "1px solid #E5E7EB",
          "&:hover": {
            border: "1px solid #D1D5DB",
            backgroundColor: "#F9FAFB",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid #E5E7EB",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
          borderRadius: "0.75rem",
          transition: "all 0.2s ease",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "0.75rem",
          backgroundImage: "none",
        },
        outlined: {
          border: "1px solid #E5E7EB",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        },
        elevation1: {
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        },
        elevation2: {
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        },
        elevation3: {
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "0.5rem",
            transition: "all 0.2s ease",
            "& fieldset": {
              borderColor: "#E5E7EB",
            },
            "&:hover fieldset": {
              borderColor: "#D1D5DB",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#0F70F0",
              borderWidth: "2px",
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "0.5rem",
          "& fieldset": {
            borderColor: "#E5E7EB",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "0.375rem",
          fontWeight: 500,
          fontSize: "0.75rem",
        },
        outlined: {
          border: "1px solid #E5E7EB",
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          "& thead th": {
            backgroundColor: "#F9FAFB",
            borderBottom: "2px solid #E5E7EB",
            fontWeight: 600,
          },
          "& tbody tr": {
            borderBottom: "1px solid #E5E7EB",
            "&:hover": {
              backgroundColor: "#F9FAFB",
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: "#E5E7EB",
          padding: "1rem",
        },
        head: {
          fontWeight: 600,
          backgroundColor: "#F9FAFB",
          color: "#111827",
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: "0.375rem",
          height: "6px",
          backgroundColor: "#E5E7EB",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: "0.5rem",
          border: "1px solid",
        },
        standardInfo: {
          backgroundColor: "#DBEAFE",
          color: "#1D4ED8",
          borderColor: "#93C5FD",
        },
        standardSuccess: {
          backgroundColor: "#D1FAE5",
          color: "#059669",
          borderColor: "#A7F3D0",
        },
        standardWarning: {
          backgroundColor: "#FEF3C7",
          color: "#D97706",
          borderColor: "#FCD34D",
        },
        standardError: {
          backgroundColor: "#FEE2E2",
          color: "#DC2626",
          borderColor: "#FECACA",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: "0.5rem",
          transition: "all 0.2s ease",
          color: "#6B7280",
          "&:hover": {
            backgroundColor: "#F3F4F6",
            color: "#111827",
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#FFFFFF",
          borderRight: "1px solid #E5E7EB",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: "0.5rem",
          border: "1px solid #E5E7EB",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: "0.375rem",
          margin: "0.25rem 0.5rem",
          "&:hover": {
            backgroundColor: "#EDF2FF",
          },
          "&.Mui-selected": {
            backgroundColor: "#EDF2FF",
            "&:hover": {
              backgroundColor: "#DBEAFE",
            },
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: "0.875rem",
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
});

export default theme;