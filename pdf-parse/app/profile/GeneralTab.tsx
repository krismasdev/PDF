
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

export default function GeneralTab() {
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    return (
        <>
            <Typography variant="h5" fontWeight={700} color="#fff" mb={1}>
                Change your private information
            </Typography>
            <Typography color="#b0b8d1" mb={3}>
                Please read our{" "}
                <MuiLink href="#" color="#2196f3" underline="hover">
                    terms of use
                </MuiLink>{" "}
                to be informed how we manage your private data.
            </Typography>
            <Divider sx={{ mb: 3, borderColor: "#2e3856" }} />
            <form>
                <Grid container spacing={2}>
                    <Grid size={6}>
                        <InputLabel
                            sx={{ color: "#b0b8d1", mb: 1, fontWeight: 500 }}
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
                                input: { color: "#fff" },
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
                            sx={{ color: "#b0b8d1", mb: 1, fontWeight: 500 }}
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
                                input: { color: "#fff" },
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": { borderColor: "#2e3856" },
                                    "&:hover fieldset": { borderColor: "#3b4a6b" },
                                },
                                bgcolor: "#222b45",
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid sx={{ mt: 3 }} container spacing={3}>
                    <Grid size={12}>
                        <InputLabel
                            sx={{ color: "#b0b8d1", mb: 1, fontWeight: 500 }}
                            shrink
                        >
                            Bio
                        </InputLabel>
                        <TextField
                            placeholder="Bio"
                            fullWidth
                            multiline
                            minRows={4}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            variant="outlined"
                            sx={{
                                input: { color: "#fff" },
                                textarea: { color: "#fff" },
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": { borderColor: "#2e3856" },
                                    "&:hover fieldset": { borderColor: "#3b4a6b" },
                                },
                                bgcolor: "#222b45",
                            }}
                        />
                    </Grid>
                </Grid>
                <Divider sx={{ my: 3, borderColor: "#2e3856" }} />

                <Grid container spacing={3}>
                    <Grid size={6}>
                        <InputLabel
                            sx={{ color: "#b0b8d1", mb: 1, fontWeight: 500 }}
                            shrink
                        >
                            Country
                        </InputLabel>
                        <TextField
                            placeholder="Country *"
                            fullWidth
                            required
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            variant="outlined"
                            sx={{
                                input: { color: "#fff" },
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
                            sx={{ color: "#b0b8d1", mb: 1, fontWeight: 500 }}
                            shrink
                        >
                            City
                        </InputLabel>
                        <TextField
                            placeholder="City *"
                            fullWidth
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            variant="outlined"
                            sx={{
                                input: { color: "#fff" },
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": { borderColor: "#2e3856" },
                                    "&:hover fieldset": { borderColor: "#3b4a6b" },
                                },
                                bgcolor: "#222b45",
                            }}
                        />
                    </Grid>
                </Grid>

                <Box mt={3}>
                    <InputLabel
                        sx={{ color: "#b0b8d1", mb: 1, fontWeight: 500 }}
                        shrink
                    >
                        Enter your address
                    </InputLabel>
                    <TextField
                        placeholder="Address *"
                        fullWidth
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        variant="outlined"
                        sx={{
                            input: { color: "#fff" },
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "#2e3856" },
                                "&:hover fieldset": { borderColor: "#3b4a6b" },
                            },
                            bgcolor: "#222b45",
                        }}
                    />
                </Box>

                <Box mt={3} display="flex" justifyContent="space-between" alignItems="center">
                    <Typography color="#b0b8d1" fontSize="0.98rem">
                        You may also consider to update your{" "}
                        <MuiLink href="#" color="#2196f3" underline="hover">
                            billing information.
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