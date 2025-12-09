import React from "react";
import { Typography, Box } from "@mui/material";

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography color="error">
            Une erreur est survenue. Veuillez réessayer.
          </Typography>
        </Box>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;