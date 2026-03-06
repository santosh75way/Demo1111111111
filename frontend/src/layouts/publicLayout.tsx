import { Outlet, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container, Box, Stack } from "@mui/material";

const NAV_ITEMS = [
  { label: "Home", path: "/" },
  { label: "Features", path: "/#features" },
  { label: "Pricing", path: "/#pricing" },
  { label: "About", path: "/#about" },
  { label: "Contact", path: "/#contact" },
];

export default function PublicLayout() {
  const navigate = useNavigate();

  return (
    <Box sx={styles.root}>
      <AppBar position="sticky" color="inherit" elevation={0} sx={styles.appBar}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={styles.toolbar}>
            <Typography
              variant="h6"
              fontWeight={800}
              sx={styles.logo}
              onClick={() => navigate("/")}
            >
              Web App
            </Typography>

            <Stack direction="row" spacing={1} sx={styles.navStack}>
              {NAV_ITEMS.map((item) => (
                <Button
                  key={item.label}
                  color="inherit"
                  onClick={() => navigate(item.path)}
                  sx={styles.navButton}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>

            <Stack direction="row" spacing={1.5}>
              <Button
                variant="text"
                onClick={() => navigate("/login")}
                sx={styles.signInButton}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate("/signup")}
                sx={styles.getStartedButton}
              >
                Get Started
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main" sx={styles.main}>
        <Outlet />
      </Box>
    </Box>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    bgcolor: "#fff",
  },
  appBar: {
    borderBottom: "1px solid #f1f5f9",
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(8px)",
  },
  toolbar: {
    justifyContent: "space-between",
  },
  logo: {
    cursor: "pointer",
    color: "primary.main",
    letterSpacing: -1,
  },
  navStack: {
    display: { xs: "none", md: "flex" },
  },
  navButton: {
    fontWeight: 500,
    textTransform: "none",
    color: "text.secondary",
    "&:hover": {
      color: "primary.main",
      bgcolor: "transparent",
    },
  },
  signInButton: {
    fontWeight: 600,
    textTransform: "none",
  },
  getStartedButton: {
    borderRadius: 2,
    textTransform: "none",
    fontWeight: 600,
    boxShadow: "none",
    "&:hover": {
      boxShadow: "none",
    },
  },
  main: {
    flexGrow: 1,
  },
};