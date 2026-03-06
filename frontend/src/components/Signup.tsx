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
  Stack,
  Divider,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  EmailOutlined,
  PersonOutline,
  LockOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { signup as signupApi } from "@/services/api";
import { setCredentials } from "@/store/authSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const signupSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["USER", "STAFF"]),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: "USER",
      fullName: "",
      email: "",
      password: "",
    },
  });

  const dispatch = useDispatch();
  const onSubmit = async (data: SignupFormData) => {
    try {
      const response = await signupApi(data);
      dispatch(setCredentials(response));
      toast.success("Account created successfully!");
      if (response.user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Signup failed. Please try again.");
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
            sx={{ mt: 2 }}
          >
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            Join our community of Users
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                label="Full Name"
                placeholder="Enter your full name"
                {...register("fullName")}
                error={!!errors.fullName}
                helperText={errors.fullName?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutline color="action" />
                    </InputAdornment>
                  ),
                }}
              />

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
                  "Create Account"
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
                startIcon={
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    width="20"
                    alt="Google"
                  />
                }
                sx={styles.socialBtn}
              >
                Sign up with Google
              </Button>
            </Stack>
          </form>

          <Box mt={4}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <Link onClick={() => navigate("/login")} sx={styles.signInLink}>
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
    py: 6,
    background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
  },
  paper: {
    p: 5,
    borderRadius: 6,
    textAlign: "center",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
    position: "relative",
    overflow: "hidden",
  },
  badge: {
    position: "absolute",
    top: 20,
    right: -30,
    transform: "rotate(45deg)",
    bgcolor: "#6366f1",
    color: "white",
    px: 5,
    py: 0.5,
    width: 150,
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
  toggleGroup: {
    bgcolor: "#f1f5f9",
    p: 0.5,
    borderRadius: 3,
    "& .MuiToggleButton-root": {
      border: "none",
      borderRadius: "10px !important",
      mx: 0.5,
      py: 1,
      color: "#64748b",
      fontWeight: 600,
      textTransform: "none",
      "&.Mui-selected": {
        bgcolor: "white",
        color: "#6366f1",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        "&:hover": {
          bgcolor: "white",
        },
      },
    },
  },
  toggleButton: {
    flex: 1,
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
