import React, { useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { loginService } from "../../services/Login/login.service";

interface IFormInput {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IFormInput>();

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
        <Typography variant="h5" component="h1" gutterBottom>
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
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
