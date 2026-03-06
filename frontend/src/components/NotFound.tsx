import { Box, Button, Container, Typography } from "@mui/material";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box sx={styles.wrapper}>
        <ErrorOutlineOutlinedIcon sx={styles.icon} />

        <Typography variant="h3" fontWeight={700} gutterBottom>
          404
        </Typography>

        <Typography variant="h6" color="text.secondary" gutterBottom>
          Page not found
        </Typography>

        <Typography variant="body1" sx={styles.description}>
          The page you’re looking for doesn’t exist or may have been moved.
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/dashboard")}
        >
          Go to Dashboard
        </Button>
      </Box>
    </Container>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  icon: {
    fontSize: 80,
    color: "text.secondary",
    mb: 2,
  },
  description: {
    color: "text.secondary",
    maxWidth: 420,
    mb: 4,
  },
};
