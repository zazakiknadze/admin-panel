import { routes } from "@/router/routes";
import { List, ListItemButton, ListItemText } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const layoutRoutes = routes
    .flatMap((route) => route.children || [])
    .filter((route) => route.showInSidebar);

  return (
    <List>
      {layoutRoutes.map((route) => {
        const isActive = location.pathname.includes(`/${route.path}`);

        return (
          <ListItemButton
            key={route.path}
            component={Link}
            to={`/${route.path}`}
            sx={{
              borderRadius: 2,
              marginBottom: 1,
              backgroundColor: isActive ? "green" : "transparent",
              color: isActive ? "white" : "green",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "green",
                color: "white",
              },
              "&:last-child": {
                marginBottom: 0,
              },
            }}
          >
            <ListItemText primary={route.name} />
          </ListItemButton>
        );
      })}
    </List>
  );
};

export default Sidebar;
