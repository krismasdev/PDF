"use client";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function Header() {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          PDF Parser
        </Typography>
        <Box>
          <Button color="inherit" component={Link} href="/">Dashboard</Button>
          <Button color="inherit" component={Link} href="/profile">Profile</Button>
          <Button color="inherit" component={Link} href="/login">Login</Button>
          <Button color="inherit" component={Link} href="/register">Register</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}