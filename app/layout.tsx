import ClientThemeProvider from "./components/ClientThemeProvider";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Container from "@mui/material/Container";

export const metadata = {
  title: "Next.js + Material UI",
  description: "A starter template with Next.js and Material UI",
};

import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientThemeProvider>
          <Header />
          <Container component="main" style={{ minHeight: "80vh", maxWidth: "100vw", width: "100%", padding: 0, overflowX: "hidden" }}>
            {children}
          </Container>
          <Footer />
        </ClientThemeProvider>
      </body>
    </html>
  );
}
