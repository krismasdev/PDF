import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function Footer() {
  return (
    <Box component="footer" sx={{ py: 2, textAlign: "center", bgcolor: "background.paper" }}>
      <Typography variant="body2" color="text.secondary">
        &copy; {new Date().getFullYear()} PDF Parser. All rights reserved.
      </Typography>
    </Box>
  );
}