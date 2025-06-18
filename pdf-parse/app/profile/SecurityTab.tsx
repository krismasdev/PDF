import { useEffect, useState } from "react";

import {
    Box,
    Paper,
    Typography,
    Tabs,
    Tab,
    Grid,
    TextField,
    InputLabel,
    Divider,
    Button,
    useTheme,
    Link as MuiLink,
} from "@mui/material";
export default function SecurityTab() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add password change logic here
    };
    const theme = useTheme();
    return (
        <>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5" fontWeight={700} color="#fff" mb={1}>
                    Change your password
                </Typography>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleLogout}
                    sx={{
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        fontWeight: 500,
                        borderRadius: 2,
                        textTransform: "none",
                        px: 2,
                        py: 0.5,
                        minWidth: 100,
                        "&:hover": {
                            borderColor: theme.palette.primary.dark,
                            background: "rgba(25, 118, 210, 0.08)",
                        },
                    }}
                >
                    Log out
                </Button>
            </Box>
            <Divider sx={{ my: 2, borderColor: "#2e3856" }} />

            <form onSubmit={handleSubmit}>
                <Typography fontWeight={600} color="#fff" mb={1}>
                    Current password
                </Typography>
                <TextField
                    type="password"
                    placeholder=""
                    fullWidth
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    variant="outlined"
                    sx={{
                        mb: 3,
                        input: { color: "#fff" },
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "#2e3856" },
                            "&:hover fieldset": { borderColor: "#3b4a6b" },
                        },
                        bgcolor: "#222b45",
                    }}
                />

                <Typography fontWeight={600} color="#fff" mb={1}>
                    New password
                </Typography>
                <TextField
                    type="password"
                    placeholder=""
                    fullWidth
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    variant="outlined"
                    sx={{
                        mb: 3,
                        input: { color: "#fff" },
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "#2e3856" },
                            "&:hover fieldset": { borderColor: "#3b4a6b" },
                        },
                        bgcolor: "#222b45",
                    }}
                />

                <Typography fontWeight={600} color="#fff" mb={1}>
                    Repeat password
                </Typography>
                <TextField
                    type="password"
                    placeholder=""
                    fullWidth
                    required
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    variant="outlined"
                    sx={{
                        mb: 3,
                        input: { color: "#fff" },
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "#2e3856" },
                            "&:hover fieldset": { borderColor: "#3b4a6b" },
                        },
                        bgcolor: "#222b45",
                    }}
                />

                <Divider sx={{ my: 2, borderColor: "#2e3856" }} />

                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography color="#b0b8d1" fontSize="0.98rem">
                        You may also consider to update your{" "}
                        <MuiLink href="#" color="#2196f3" underline="hover">
                            notification settings.
                        </MuiLink>
                    </Typography>
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
                        Save
                    </Button>
                </Box>
            </form>
        </>
    )
}