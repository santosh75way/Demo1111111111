import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Button,
  Container,
} from "@mui/material";
import {
  Home as DashboardIcon,
  Assignment as SurveyIcon,
  Logout as LogoutIcon,
  AccountCircle as ProfileIcon,
  KeyboardArrowDown,
} from "@mui/icons-material";
import { logout } from "@/store/authSlice";
import { type RootState } from "@/store";
import { useState } from "react";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const navItems = [
    { label: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
    { label: "Surveys", icon: <SurveyIcon />, path: "/admin" },
    { label: "Profile", icon: <ProfileIcon />, path: "/profile/user" },
  ];

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setAnchorEl(null);
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <Box sx={styles.root}>
      <AppBar position="sticky" elevation={0} sx={styles.appBar}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={styles.toolbar}>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={styles.logo}
              onClick={() => navigate("/admin/dashboard")}
            >
              ADMIN
            </Typography>

            <Box sx={styles.navLinks}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  startIcon={item.icon}
                  onClick={() => navigate(item.path)}
                  sx={{
                    ...styles.navButton,
                    ...(isActive(item.path) && styles.navButtonActive),
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            <Button
              onClick={(e) => setAnchorEl(e.currentTarget)}
              endIcon={<KeyboardArrowDown />}
              sx={styles.userButton}
            >
              <Avatar sx={styles.avatar}>
                {user?.email?.[0]?.toUpperCase() || "A"}
              </Avatar>
              <Box sx={styles.userInfo}>
                <Typography variant="body2" fontWeight={600}>
                  {user?.fullName || user?.email?.split("@")[0] || "Admin"}
                </Typography>
              </Box>
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              sx={styles.menu}
            >
              <MenuItem onClick={handleLogout} sx={styles.logoutItem}>
                <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
                Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main" sx={styles.main}>
        <Container maxWidth="xl" sx={styles.container}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default AdminLayout;

const styles = {
  root: {
    minHeight: "100vh",
    bgcolor: "#f8f9fa",
  },
  appBar: {
    bgcolor: "#fff",
    borderBottom: "1px solid #e9ecef",
    color: "#212529",
  },
  toolbar: {
    justifyContent: "space-between",
    py: 1,
  },
  logo: {
    cursor: "pointer",
    color: "primary.main",
    letterSpacing: -0.5,
    "&:hover": {
      opacity: 0.8,
    },
  },
  navLinks: {
    display: "flex",
    gap: 1,
    flex: 1,
    ml: 6,
  },
  navButton: {
    color: "#6c757d",
    textTransform: "none",
    fontWeight: 500,
    px: 2,
    py: 1,
    borderRadius: 2,
    "&:hover": {
      bgcolor: "#f8f9fa",
      color: "#212529",
    },
  },
  navButtonActive: {
    color: "primary.main",
    bgcolor: "#e7f5ff",
    "&:hover": {
      bgcolor: "#d0ebff",
    },
  },
  userButton: {
    textTransform: "none",
    color: "#212529",
    borderRadius: 2,
    px: 1.5,
    "&:hover": {
      bgcolor: "#f8f9fa",
    },
  },
  avatar: {
    width: 32,
    height: 32,
    bgcolor: "primary.main",
    fontSize: "0.875rem",
    fontWeight: 600,
  },
  userInfo: {
    ml: 1.5,
    mr: 0.5,
    textAlign: "left",
    display: { xs: "none", sm: "block" },
  },
  menu: {
    "& .MuiPaper-root": {
      mt: 1,
      minWidth: 180,
      borderRadius: 2,
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
  },
  logoutItem: {
    color: "#dc3545",
    fontWeight: 500,
    "&:hover": {
      bgcolor: "#fff5f5",
    },
  },
  main: {
    py: 4,
    flex: 1,
  },
  container: {
    minHeight: "calc(100vh - 120px)",
  },
};
