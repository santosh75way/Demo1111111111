import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  AccountCircle as ProfileIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";

const drawerWidth = 260;

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { text: "Profile Settings", icon: <ProfileIcon />, path: "/profile/user" },
];

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Box sx={styles.root}>
      <Drawer variant="permanent" sx={styles.drawer}>
        <Toolbar sx={styles.toolbar}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Box sx={styles.logoBox}>
              <DashboardIcon sx={styles.logoIcon} />
            </Box>
            <Typography
              variant="h6"
              fontWeight={900}
              color="#1e293b"
              letterSpacing={-0.5}
            >
              Scheduler
            </Typography>
          </Box>
        </Toolbar>

        <Box sx={styles.drawerContent}>
          <List sx={styles.list}>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    selected={isActive}
                    onClick={() => navigate(item.path)}
                    sx={{
                      ...styles.listItemButton,
                      bgcolor: isActive ? "#f1f5f9" : "transparent",
                      color: isActive ? "#6366f1" : "#64748b",
                    }}
                  >
                    <ListItemIcon sx={styles.listItemIcon}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: "0.95rem",
                        fontWeight: isActive ? 700 : 500,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>

          <Box sx={styles.footerBox}>
            <Divider sx={styles.divider} />
            <ListItemButton onClick={handleLogout} sx={styles.logoutButton}>
              <ListItemIcon sx={styles.listItemIcon}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </ListItemButton>
          </Box>
        </Box>
      </Drawer>

      <Box component="main" sx={styles.mainContent}>
        <Box sx={styles.outletBox}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

const styles = {
  root: { display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    [`& .MuiDrawer-paper`]: {
      width: drawerWidth,
      boxSizing: "border-box",
      borderRight: "1px solid #e2e8f0",
      bgcolor: "white",
    },
  },
  toolbar: { p: 4 },
  logoBox: { bgcolor: "#6366f1", p: 1, borderRadius: 2 },
  logoIcon: { color: "white" },
  drawerContent: {
    px: 2,
    pt: 2,
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  list: { mt: 1 },
  listItemButton: {
    borderRadius: 3,
    mb: 0.5,
    py: 1.2,
    "&:hover": { bgcolor: "#f1f5f9" },
    "&.Mui-selected": {
      bgcolor: "#f1f5f9",
      color: "#6366f1",
      "&:hover": { bgcolor: "#f1f5f9" },
    },
  },
  listItemIcon: { minWidth: 40, color: "inherit" },
  footerBox: { mt: "auto", pb: 4 },
  divider: { my: 2 },
  logoutButton: {
    borderRadius: 3,
    color: "#ef4444",
    "&:hover": { bgcolor: "#fef2f2" },
  },
  mainContent: { flexGrow: 1, p: 0, overflowY: "auto" },
  outletBox: { minHeight: "100vh", transition: "0.3s" },
};
