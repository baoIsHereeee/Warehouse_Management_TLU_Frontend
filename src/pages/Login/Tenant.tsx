import React, { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { checkTenant } from "../../services/Tenant/tenant.service";

const TenantPage: React.FC = () => {
  const [tenantName, setTenantName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await checkTenant(tenantName);
      navigate(`/log-in/${tenantName}`);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Error! Please try again!"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = () => {
    navigate("/sign-up");
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

        <Typography variant="h6" component="h1" gutterBottom>
          Enter Your Store Name
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 1, width: "100%" }}
        >
          <TextField
            label="Store Name"
            fullWidth
            margin="normal"
            value={tenantName}
            onChange={(e) => setTenantName(e.target.value)}
            required
            error={!!error}
            helperText={error}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={isSubmitting || !tenantName}
          >
            {isSubmitting ? "Checking..." : "Continue"}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            sx={{ mt: 2 }}
            onClick={handleSignUp}
          >
            Sign Up
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default TenantPage;
