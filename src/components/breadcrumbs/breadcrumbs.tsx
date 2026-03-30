import { Breadcrumbs, Link, Typography, Box } from "@mui/material";
import { NavigateNext as NextIcon } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

const BreadcrumbNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Box sx={{ display: "flex", alignItems: "center", ml: 3 }}>
      <Breadcrumbs
        separator={<NextIcon sx={{ fontSize: 16, color: "white" }} />}
        aria-label="breadcrumb"
      >
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;

          return last ? (
            <Typography
              key={to}
              color="white"
              sx={{
                textTransform: "capitalize",
              }}
            >
              {value}
            </Typography>
          ) : (
            <Link
              key={to}
              underline="hover"
              color="white"
              sx={{
                cursor: "pointer",
                textTransform: "capitalize",
              }}
              onClick={() => navigate(to)}
            >
              {value}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default BreadcrumbNav;
