import { CircularProgress, Box } from "@mui/material";

const Loader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <CircularProgress sx={{ color: "green" }} />
    </Box>
  );
};

export default Loader;
