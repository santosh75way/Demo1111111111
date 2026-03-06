import { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  Divider,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  LockOutlined,
  EmailOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login as loginApi } from "@/services/api";
import { setCredentials } from "@/store/authSlice";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await loginApi(data);
      dispatch(setCredentials(response));
      toast.success("Welcome back!");
      if (response.user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <Box sx={styles.mainContainer}>
      <Container maxWidth="xs">
        <Paper elevation={0} sx={styles.paper}>
          <Box sx={styles.avatarBox}>
            <LockOutlined sx={{ fontSize: 32 }} />
          </Box>
          <Typography
            variant="h4"
            fontWeight="900"
            gutterBottom
            letterSpacing={-1}
          >
            Sign In
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            Welcome back to login
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2.5}>
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

              <Box>
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Box display="flex" justifyContent="flex-end" mt={1}>
                  <Link
                    component="button"
                    type="button"
                    variant="body2"
                    onClick={() => navigate("/forgot-password")}
                    sx={styles.forgotPasswordLink}
                  >
                    Forgot Password?
                  </Link>
                </Box>
              </Box>

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
                  "Sign In"
                )}
              </Button>

              <Box sx={{ position: "relative", my: 1 }}>
                <Divider>
                  <Typography variant="caption" color="text.secondary">
                    OR
                  </Typography>
                </Divider>
              </Box>

              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={() => {
                  const API_URL = import.meta.env.VITE_API_URL;
                  window.location.href = `${API_URL}/api/auth/google`;
                }}

                startIcon={<img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="20" alt="Google" />}
                sx={styles.socialBtn}
              >
                Continue with Google
              </Button>

            </Stack>
          </form>

          <Box mt={4}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{" "}
              <Link
                onClick={() => navigate("/signup")}
                sx={styles.createAccountLink}
              >
                Create Account
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
  forgotPasswordLink: {
    color: "#6366f1",
    textDecoration: "none",
    fontWeight: 600,
    cursor: "pointer",
    "&:hover": {
      textDecoration: "underline",
    },
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
  createAccountLink: {
    cursor: "pointer",
    fontWeight: 700,
    color: "#6366f1",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  socialBtn: {
    borderRadius: 3,
    py: 1.2,
    borderColor: "#e2e8f0",
    color: "#475569",
    textTransform: "none",
    fontWeight: 600,
    "&:hover": {
      borderColor: "#cbd5e1",
      bgcolor: "#f8fafc",
    },
  },
};
