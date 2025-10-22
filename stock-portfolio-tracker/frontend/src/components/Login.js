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
import { login, clearError } from "../redux/authSlice";
import { useTheme } from "../contexts/ThemeContext";
import ThemeToggle from "./ThemeToggle";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const { isLoading, error, token } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
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
    dispatch(login(data));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: (theme) => theme.palette.background.default,
      }}
    >
      <Box sx={{ position: "absolute", top: 20, right: 20 }}>
        <ThemeToggle />
      </Box>
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
              color: (theme) => theme.palette.text.secondary,
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
              color: (theme) => theme.palette.text.secondary,
            }}
          >
            Sign In
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{
                width: "100%",
                mb: 3,
                backgroundColor: "transparent",
                color: (theme) => theme.palette.error.main,
                border: "1px solid",
                borderColor: (theme) => theme.palette.error.main,
                borderRadius: 0,
                "& .MuiAlert-icon": {
                  color: (theme) => theme.palette.error.main,
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
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{ mb: 3 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
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
                "SIGN IN"
              )}
            </Button>
            <Box textAlign="center">
              <Link to="/register" style={{ textDecoration: "none" }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: (theme) => theme.palette.text.secondary,
                    letterSpacing: "0.05em",
                    "&:hover": {
                      color: (theme) => theme.palette.text.primary,
                    },
                  }}
                >
                  Create Account
                </Typography>
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Login;
