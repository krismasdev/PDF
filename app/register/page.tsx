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
    Grid,
    useTheme,
} from "@mui/material";
import api from "../components/ApiClient";

export default function Register() {
    const theme = useTheme();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (!firstName || !lastName || !email || !password) {
            setError("All fields are required.");
            return;
        }

        try {
            const res = await api.post("/user/register", {
                firstname: firstName,
                lastname: lastName,
                email,
                password,
            });
            if (res.data.success && res.data.token) {
                localStorage.setItem("token", res.data.token);
                router.push("/");
            } else {
                setError(res.data.message || "Registration failed.");
            }
        } catch (err) {
            if (err && typeof err === "object" && "response" in err && err.response && typeof err.response === "object" && "data" in err.response && err.response.data && typeof err.response.data === "object" && "message" in err.response.data) {
                setError((err.response as any).data.message || "Registration failed.");
            } else {
                setError("Registration failed.");
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
            sx={{ bgcolor: theme.palette.background.default }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, sm: 6 },
                    maxWidth: 650,
                    width: "100%",
                    bgcolor: "#1a2236",
                }}
            >
                <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    mb={1}
                    fontWeight={600}
                >
                    SIGNUP
                </Typography>
                <Typography
                    variant="h4"
                    fontWeight={700}
                    mb={1}
                    color="text.primary"
                >
                    Create an account
                </Typography>
                <Typography color="text.secondary" mb={4}>
                    Fill out the form to get started.
                </Typography>
                <form onSubmit={handleRegister}>
                    <Stack spacing={3}>
                        <Grid container spacing={2}>
                            <Grid size={6}>
                                <InputLabel
                                    sx={{ color: "text.secondary", mb: 1, fontWeight: 500 }}
                                    shrink
                                >
                                    Enter your first name
                                </InputLabel>
                                <TextField
                                    placeholder="First name *"
                                    fullWidth
                                    required
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    autoComplete="given-name"
                                    variant="outlined"
                                    sx={{
                                        input: { color: theme.palette.text.primary },
                                        "& .MuiOutlinedInput-root": {
                                            "& fieldset": { borderColor: "#2e3856" },
                                            "&:hover fieldset": { borderColor: "#3b4a6b" },
                                        },
                                        bgcolor: "#222b45",
                                    }}
                                />
                            </Grid>
                            <Grid size={6}>
                                <InputLabel
                                    sx={{ color: "text.secondary", mb: 1, fontWeight: 500 }}
                                    shrink
                                >
                                    Enter your last name
                                </InputLabel>
                                <TextField
                                    placeholder="Last name *"
                                    fullWidth
                                    required
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    autoComplete="family-name"
                                    variant="outlined"
                                    sx={{
                                        input: { color: theme.palette.text.primary },
                                        "& .MuiOutlinedInput-root": {
                                            "& fieldset": { borderColor: "#2e3856" },
                                            "&:hover fieldset": { borderColor: "#3b4a6b" },
                                        },
                                        bgcolor: "#222b45",
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Box>
                            <InputLabel
                                sx={{ color: "text.secondary", mb: 1, fontWeight: 500 }}
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
                                    input: { color: theme.palette.text.primary },
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": { borderColor: "#2e3856" },
                                        "&:hover fieldset": { borderColor: "#3b4a6b" },
                                    },
                                    bgcolor: "#222b45",
                                }}
                            />
                        </Box>
                        <Box>
                            <InputLabel
                                sx={{ color: "text.secondary", mb: 1, fontWeight: 500 }}
                                shrink
                            >
                                Enter your password
                            </InputLabel>
                            <TextField
                                placeholder="Password *"
                                type="password"
                                fullWidth
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                                variant="outlined"
                                sx={{
                                    input: { color: theme.palette.text.primary },
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
                        <Grid
                            container
                            alignItems="center"
                            justifyContent="space-between"
                            mt={2}
                        >
                            <Grid  size={12}>
                                <Typography color="text.secondary">
                                    Already have an account?{" "}
                                    <Link
                                        href="/login"
                                        style={{
                                            color: theme.palette.primary.main,
                                            textDecoration: "none",
                                            fontWeight: 500,
                                        }}
                                    >
                                        Login.
                                    </Link>
                                </Typography>
                            </Grid>
                            <Grid size={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        px: 4,
                                        py: 1.5,
                                        fontWeight: 600,
                                        fontSize: "1rem",
                                        borderRadius: 2,
                                        boxShadow: "none",
                                    }}
                                >
                                    Sign up
                                </Button>
                            </Grid>
                        </Grid>
                        <Typography
                            mt={3}
                            color="text.secondary"
                            fontSize="0.95rem"
                            textAlign="center"
                        >
                            By clicking "Sign up" button you agree with our{" "}
                            <Link
                                href="#"
                                style={{
                                    color: theme.palette.primary.main,
                                    textDecoration: "none",
                                    fontWeight: 500,
                                }}
                            >
                                company terms and conditions.
                            </Link>
                        </Typography>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
}