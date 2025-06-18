import { Button, Typography, Card, CardContent, Box, Container } from "@mui/material"
import { Favorite, Star } from "@mui/icons-material"
import DashboardComponent from "./dashboard"

export default function Dashboard() {
  return (
    <Container maxWidth="lg" className="py-8">
      <DashboardComponent />
    </Container>
  )
}
