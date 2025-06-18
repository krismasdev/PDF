"use client";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

export const customTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "rgb(34, 43, 69)",
      paper: "rgb(34, 43, 69)",
    },
    primary: {
      main: "#1976d2",
    },
    text: {
      primary: "#fff",
      secondary: "#b0b8d1",
    },
  },
});

import { ReactNode } from "react";

export default function ClientThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}