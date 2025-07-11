import React, { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createTenant } from "../../services/Tenant/tenant.service";

interface IUserInfo {
  id: string;
  fullname: string;
  email: string;
  password: string;
}

interface ITenantInfo {
  id: string;
  name: string;
}

const SignUp: React.FC = () => {
  const [tenantName, setTenantName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);
  const [tenantInfo, setTenantInfo] = useState<ITenantInfo | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const response = await createTenant({ name: tenantName, email });
      setSuccess(response.message);
      setTenantInfo(response.tenant);
      setUserInfo(response.user);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to create tenant. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (userInfo && tenantInfo) {
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

          <Typography variant="body1" sx={{ mb: 2 }} fontWeight="bold">
            SIGN IN INFORMATION
          </Typography>

          <Box sx={{ width: "100%", mb: 1 }}>
            <TextField
              label="Store Name"
              fullWidth
              value={tenantInfo.name}
              InputProps={{ readOnly: true }}
              margin="normal"
            />
            <TextField
              label="Email"
              fullWidth
              value={userInfo.email}
              InputProps={{ readOnly: true }}
              margin="normal"
            />
            <TextField
              label="Password"
              fullWidth
              value={userInfo.password}
              InputProps={{ readOnly: true }}
              margin="normal"
            />
          </Box>

          <Alert severity="info" sx={{ width: "100%", mb: 2 }}>
            Please use the above email and password to sign in. 
          </Alert>

          <Alert severity="info" sx={{ width: "100%", mb: 2 }}>
            It is recommended to change your email/password after signing in.
          </Alert>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => navigate(`/log-in/${tenantInfo.name}`)}
          >
            Go to Login
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

        <Typography variant="h6" component="h1" gutterBottom>
          Create New Store
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
          />

          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={isSubmitting || !tenantName || !email}
          >
            {isSubmitting ? "Creating..." : "Create Store"}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => navigate("/")}
          >
            Back to Store Selection
          </Button>
        </Box>
      </Paper>

      {/* Success Snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert onClose={() => setSuccess("")} severity="success" sx={{ width: "100%" }}>
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SignUp;
