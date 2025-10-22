import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import { register as registerUser, clearError } from "../redux/authSlice";

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error, token } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onSubmit = (data) => {
    const { confirmPassword, ...userData } = data;
    dispatch(registerUser(userData));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000000",
      }}
    >
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            component="h1"
            variant="h3"
            sx={{
              fontWeight: 100,
              letterSpacing: "0.1em",
              mb: 1,
              textAlign: "center",
            }}
          >
            STOCK TRACKER
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "#666666",
              letterSpacing: "0.2em",
              fontSize: "0.7rem",
              textTransform: "uppercase",
              mb: 6,
            }}
          >
            Created by Alen
          </Typography>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 100,
              letterSpacing: "0.05em",
              mb: 4,
              color: "#999999",
            }}
          >
            Create Account
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{
                width: "100%",
                mb: 3,
                backgroundColor: "transparent",
                color: "#ff0000",
                border: "1px solid #ff0000",
                borderRadius: 0,
                "& .MuiAlert-icon": {
                  color: "#ff0000",
                },
              }}
            >
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              {...register("username", {
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters",
                },
              })}
              error={!!errors.username}
              helperText={errors.username?.message}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              sx={{ mb: 4 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{ mb: 3 }}
            >
              {isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "CREATE ACCOUNT"
              )}
            </Button>
            <Box textAlign="center">
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#666666",
                    letterSpacing: "0.05em",
                    "&:hover": {
                      color: "#ffffff",
                    },
                  }}
                >
                  Already have an account? Sign In
                </Typography>
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Register;
