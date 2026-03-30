import { Typography, Container, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container
      sx={{
        textAlign: "center",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography sx={{ color: "green", fontSize: 200 }}>404</Typography>
      <Typography sx={{ color: "green", fontSize: 30 }}>
        Page Not Found
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate("/leaderboard")}
        sx={{
          mt: 2,
          backgroundColor: "green",
          color: "white",
          p: 1.5,
          borderRadius: 2,
          "&:hover": {
            backgroundColor: "green",
          },
        }}
      >
        Go To Leaderboard
      </Button>
    </Container>
  );
};

export default NotFound;
