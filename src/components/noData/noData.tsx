import { Box, Typography, Paper } from "@mui/material";

const NoData = () => {
  return (
    <Box
      sx={{
        height: "100%",
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 5,
          textAlign: "center",
          borderRadius: 4,
          maxWidth: 600,
          width: "100%",
          border: "1px solid",
          borderColor: "grey.200",
        }}
      >
        <Typography variant="h5" fontWeight={800} gutterBottom color="green">
          No Data Found
        </Typography>

        <Typography variant="body2" color="text.primary" mb={3}>
          Looks like there's nothing here yet
        </Typography>
      </Paper>
    </Box>
  );
};

export default NoData;
