import { Outlet } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
} from "@mui/material";
import Sidebar from "@/components/sidebar/sidebar";
import BreadcrumbNav from "@/components/breadcrumbs/breadcrumbs";

const drawerWidth = 240;

const Layout = () => {
  return (
    <Box sx={{ display: "flex", height: "100%", pt: 8 }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "green",
        }}
      >
        <Toolbar>
          <Typography
            variant="h5"
            noWrap
            color="white"
            sx={{
              minWidth: "216px",
              borderRight: "1px solid white",
            }}
          >
            Admin Panel
          </Typography>
          <BreadcrumbNav />
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto", p: 2 }}>
          <Sidebar />
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: "auto" }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
