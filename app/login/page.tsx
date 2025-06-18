"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputLabel,
  Stack,
} from "@mui/material";
import api from "../components/ApiClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      const res = await api.post("/user/login", { email, password });
      if (res.data.success && res.data.token) {
        localStorage.setItem("token", res.data.token);
        router.push("/");
      } else {
        setError(res.data.message || "Login failed.");
      }
    } catch (err) {
      if (typeof err === "object" && err !== null && "response" in err) {
        // @ts-ignore
        setError((err as any).response?.data?.message || "Login failed.");
      } else {
        setError("Login failed.");
      }
    }
  };

  // Redirect to dashboard if already logged in
  if (typeof window !== "undefined" && localStorage.getItem("token")) {
    router.replace("/");
    return null;
  }

  return (
    <Box
      minHeight="80vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ bgcolor: "background.default" }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 6 },
          maxWidth: 480,
          width: "100%",
          bgcolor: "#1a2236",
        }}
      >
        <Typography variant="subtitle2" color="grey.400" mb={1}>
          LOGIN
        </Typography>
        <Typography variant="h4" fontWeight={700} mb={1} color="white">
          Welcome back
        </Typography>
        <Typography color="grey.400" mb={4}>
          Login to manage your account.
        </Typography>
        <form onSubmit={handleLogin}>
          <Stack spacing={3}>
            <Box>
              <InputLabel
                sx={{ color: "grey.400", mb: 1, fontWeight: 500 }}
                shrink
              >
                Enter your email
              </InputLabel>
              <TextField
                placeholder="Email *"
                type="email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                variant="outlined"
                sx={{
                  input: { color: "white" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#2e3856" },
                    "&:hover fieldset": { borderColor: "#3b4a6b" },
                  },
                  bgcolor: "#222b45",
                }}
              />
            </Box>
            <Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <InputLabel
                  sx={{ color: "grey.400", mb: 1, fontWeight: 500 }}
                  shrink
                >
                  Enter your password
                </InputLabel>
                <Typography
                  variant="body2"
                  color="primary"
                  component={Link}
                  href="#"
                  sx={{ textDecoration: "none", fontWeight: 500 }}
                >
                  Forgot your password?
                </Typography>
              </Box>
              <TextField
                placeholder="Password *"
                type="password"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                variant="outlined"
                sx={{
                  input: { color: "white" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#2e3856" },
                    "&:hover fieldset": { borderColor: "#3b4a6b" },
                  },
                  bgcolor: "#222b45",
                }}
              />
            </Box>
            {error && (
              <Typography color="error" mt={1}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, py: 1.5, fontWeight: 600, fontSize: "1rem" }}
            >
              Login
            </Button>
          </Stack>
        </form>
        <Typography mt={4} color="grey.400" align="left">
          Don't have an account yet?{" "}
          <Link
            href="/register"
            style={{
              color: "#2196f3",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Sign up here.
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}