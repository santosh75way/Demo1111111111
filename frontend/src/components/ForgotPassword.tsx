import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Link,
  CircularProgress,
  Stack,
  InputAdornment,
} from "@mui/material";
import { EmailOutlined, LockResetOutlined } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "@/services/api";
import { toast } from "react-toastify";

const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPassword({ email: data.email });
      toast.success("Password reset link has been sent to your email!");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset link.");
    }
  };

  return (
    <Box sx={styles.mainContainer}>
      <Container maxWidth="xs">
        <Paper elevation={0} sx={styles.paper}>
          <Box sx={styles.avatarBox}>
            <LockResetOutlined sx={{ fontSize: 32 }} />
          </Box>
          <Typography
            variant="h4"
            fontWeight="900"
            gutterBottom
            letterSpacing={-1}
          >
            Forgot Password
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            Enter your email to receive a reset link
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Email"
                placeholder="Enter your email"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                fullWidth
                size="large"
                variant="contained"
                type="submit"
                disabled={isSubmitting}
                sx={styles.submitButton}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </Stack>
          </form>

          <Box mt={4}>
            <Typography variant="body2" color="text.secondary">
              Remember your password?{" "}
              <Link
                onClick={() => navigate("/login")}
                sx={styles.signInLink}
              >
                Sign In
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

const styles = {
  mainContainer: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    py: 4,
    background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
  },
  paper: {
    p: 5,
    borderRadius: 6,
    textAlign: "center",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
  },
  avatarBox: {
    width: 60,
    height: 60,
    bgcolor: "#e0e7ff",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    mx: "auto",
    mb: 3,
    color: "#6366f1",
  },
  submitButton: {
    py: 1.5,
    borderRadius: 3,
    fontWeight: 700,
    textTransform: "none",
    fontSize: "1rem",
    background: "linear-gradient(45deg, #6366f1, #8b5cf6)",
    boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.4)",
    "&:hover": {
      background: "linear-gradient(45deg, #4f46e5, #7c3aed)",
    },
  },
  signInLink: {
    cursor: "pointer",
    fontWeight: 700,
    color: "#6366f1",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
};
