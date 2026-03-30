import { Box, Typography, Button, Paper } from "@mui/material";
import { ReportProblem as ReportProblemIcon } from "@mui/icons-material";

interface ErrorFallbackProps {
  resetErrorBoundary: () => void;
}

const ErrorFallback = ({ resetErrorBoundary }: ErrorFallbackProps) => {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.100",
        p: 2,
      }}
    >
      <Paper
        elevation={1}
        sx={{
          p: 4,
          maxWidth: 400,
          textAlign: "center",
          borderRadius: 3,
        }}
      >
        <ReportProblemIcon sx={{ fontSize: 40, color: "green", mb: 2 }} />
        <Typography variant="h4" gutterBottom fontWeight={600} color="green">
          Something went wrong
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Failed to load data. Please try again
        </Typography>

        <Button
          variant="contained"
          color="success"
          onClick={resetErrorBoundary}
        >
          Retry
        </Button>
      </Paper>
    </Box>
  );
};

export default ErrorFallback;
