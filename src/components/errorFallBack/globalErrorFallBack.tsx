import { Box, Button, Typography, Paper } from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";
import { FallbackProps } from "react-error-boundary";

export const GlobalErrorFallback = ({
  error,
  resetErrorBoundary,
}: FallbackProps) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f8f9fa"
      p={3}
    >
      <Paper
        elevation={3}
        sx={{ p: 5, textAlign: "center", maxWidth: 500, borderRadius: 3 }}
      >
        <ErrorOutline sx={{ fontSize: 60, color: "error.main", mb: 2 }} />
        <Typography variant="h5" gutterBottom fontWeight={700}>
          Something went wrong
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {(error as Error)?.message ?? "An unexpected error occurred."}
        </Typography>
        <Button
          variant="contained"
          color="success"
          onClick={resetErrorBoundary}
          sx={{ fontWeight: 600 }}
        >
          Try Again
        </Button>
      </Paper>
    </Box>
  );
};
