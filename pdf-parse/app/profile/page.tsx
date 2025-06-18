"use client";
import { useState } from "react";
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
import GeneralTab from "./GeneralTab";
import SecurityTab from "./SecurityTab";
import PDFHistory from "./PDFHistory";

const tabList = [
  "General",
  "Security",
  "PDF History"
];

export default function Profile() {
  const theme = useTheme();
  const [tab, setTab] = useState(0);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        minWidth: "100vw",
      }}
    >
      {/* Blue header */}
      <Box
        sx={{
          width: "100%",
          height: 220,
          bgcolor: "#1976d2",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          mb: -5,
        }}
      >
        <Typography
          variant="h3"
          fontWeight={700}
          color="#fff"
          sx={{ mt: 4, mb: 1 }}
        >
          Account settings
        </Typography>
        <Typography variant="h6" color="#e3f2fd">
          Change account information and settings
        </Typography>
      </Box>

      {/* Main content */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: { xs: 0, md: -4 },
          px: 2,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            width: "100%",
            maxWidth: 1200,
            borderRadius: 3,
            overflow: "hidden",
            bgcolor: "#232c47",
          }}
        >
          {/* Sidebar */}
          <Box
            sx={{
              minWidth: 260,
              bgcolor: "#232c47",
              borderRight: { md: "1px solid #2e3856" },
              py: 4,
              px: 3,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Tabs
              orientation="vertical"
              value={tab}
              onChange={(_, v) => setTab(v)}
              TabIndicatorProps={{
                sx: { left: 0, bgcolor: "#1976d2", width: 3, borderRadius: 2 },
              }}
              sx={{
                "& .MuiTab-root": {
                  alignItems: "flex-start",
                  color: "#b0b8d1",
                  fontWeight: 500,
                  fontSize: "1.1rem",
                  textTransform: "none",
                  mb: 1,
                  pl: 2,
                  borderRadius: 2,
                  minHeight: 48,
                  "&.Mui-selected": {
                    color: "#fff",
                    fontWeight: 700,
                    bgcolor: "rgba(25, 118, 210, 0.08)",
                  },
                },
              }}
            >
              {tabList.map((label, idx) => (
                <Tab key={label} label={label} value={idx} />
              ))}
            </Tabs>
          </Box>

          {/* Main form */}
          <Box
            sx={{
              flex: 1,
              bgcolor: "#232c47",
              py: 4,
              px: { xs: 2, sm: 6, md: 8 },
            }}
          >
            {tab === 0 && (
              <GeneralTab />
            )}
            {tab === 1 && (
              <SecurityTab />
            )}
            {tab === 2 && (
              <PDFHistory />
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}