import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { loginService } from "../../services/Login/login.service";
import { checkTenant } from "../../services/Tenant/tenant.service";

interface IFormInput {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { tenantName } = useParams<{ tenantName: string }>();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IFormInput>();

  useEffect(() => {
    const validateTenant = async () => {
      try {
        setLoading(true);
        await checkTenant(tenantName || "");
        setNotFound(false);
      } catch (err) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    validateTenant();
  }, [tenantName]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      setError("");
      await loginService.signIn(data.email, data.password);
      navigate("/products");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to sign in. Please try again.");
    }
  };

  if (loading) {
    return (
      <Container
        maxWidth="xs"
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (notFound) {
    return (
      <Container
        maxWidth="xs"
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            width: "100%",
            maxWidth: 400,
            textAlign: "center",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Store "{tenantName}" does not exist!
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={() => navigate("/warehouse-management")}
            sx={{ mt: 3 }}
          >
            Back to Store Selection
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="xs"
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: 400,
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom fontWeight="bold">
          Warehouse Management
        </Typography>
        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 1, width: "100%" }}
        >
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            {...register("email", {
              required: "Email is required!",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Email is not valid!",
              },
            })}
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ""}
            type="email"
          />
          <TextField
            label="Password"
            fullWidth
            margin="normal"
            {...register("password", { required: "Password is required!" })}
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : ""}
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            disabled={isSubmitting}
          >
            Sign In
          </Button>

          <Button
            fullWidth
            variant="outlined"
            color="primary"
            sx={{ mt: 1 }}
            onClick={() => navigate("/sign-up")}
          >
            Sign Up
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
