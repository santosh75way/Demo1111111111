import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Stack,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { LockOpenOutlined, LockOutlined } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "@/services/api";
import { toast } from "react-toastify";

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({
        token,
        newPassword: data.newPassword,
      });

      toast.success("Password reset successful! You can now login.");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <Box sx={styles.mainContainer}>
        <Container maxWidth="xs">
          <Paper elevation={0} sx={styles.paper}>
             <Box sx={styles.avatarBox}>
                <LockOutlined sx={{ fontSize: 32, color: '#ef4444' }} />
            </Box>
            <Typography variant="h5" fontWeight={700} color="error" gutterBottom>
              Invalid Reset Link
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              The password reset link is invalid or has expired.
            </Typography>
            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={styles.submitButton}
              onClick={() => navigate("/forgot-password")}
            >
              Request New Link
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={styles.mainContainer}>
      <Container maxWidth="xs">
        <Paper elevation={0} sx={styles.paper}>
          <Box sx={styles.avatarBox}>
            <LockOpenOutlined sx={{ fontSize: 32 }} />
          </Box>
          <Typography
            variant="h4"
            fontWeight="900"
            gutterBottom
            letterSpacing={-1}
          >
            Create Password
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            Enter your new password below to secure your account
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                type="password"
                label="New Password"
                placeholder="••••••••"
                {...register("newPassword")}
                error={!!errors.newPassword}
                helperText={errors.newPassword?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                type="password"
                label="Confirm Password"
                placeholder="••••••••"
                {...register("confirmPassword")}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                fullWidth
                size="large"
                variant="contained"
                type="submit"
                disabled={loading}
                sx={styles.submitButton}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Reset Password"
                )}
              </Button>
            </Stack>
          </form>
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
};
