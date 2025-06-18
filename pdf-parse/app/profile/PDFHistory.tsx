"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import api from "../components/ApiClient";

export default function PDFHistory() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalResult, setModalResult] = useState<any>(null);
  const [modalFileName, setModalFileName] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/pdf/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success && Array.isArray(res.data.data)) {
          // Sort by create_at descending
          const sorted = res.data.data.sort(
            (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          setData(sorted);
        }
      } catch {
        setData([]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleView = (row: any) => {
    setModalResult(row.result);
    setModalFileName(row.file);
    setModalOpen(true);
  };

  const handleDownload = () => {
    if (!modalResult) return;
    const blob = new Blob([JSON.stringify(modalResult, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (modalFileName || "result") + ".json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Typography variant="h6" fontWeight={700} mb={2}>
        PDF History
      </Typography>
      <TableContainer component={Paper} sx={{ bgcolor: "#222b45", mb: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#b0b8d1" }}>No.</TableCell>
              <TableCell sx={{ color: "#b0b8d1" }}>Filename</TableCell>
              <TableCell sx={{ color: "#b0b8d1" }}>Result</TableCell>
              <TableCell sx={{ color: "#b0b8d1" }}>Created At</TableCell>
              <TableCell sx={{ color: "#b0b8d1" }}>View</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No data found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, idx) => (
                <TableRow key={row._id || idx}>
                  <TableCell sx={{ color: "#fff" }}>{idx + 1}</TableCell>
                  <TableCell sx={{ color: "#fff" }}>{row.file}</TableCell>
                  <TableCell sx={{ color: "#fff", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {typeof row.result === "object"
                      ? JSON.stringify(row.result).slice(0, 50) + "..."
                      : String(row.result).slice(0, 50) + "..."}
                  </TableCell>
                  <TableCell sx={{ color: "#fff" }}>
                    {new Date(row.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleView(row)}>
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Modal for result view and download */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "#232c47",
            color: "white",
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
            minWidth: 350,
            maxWidth: 600,
            outline: "none",
          }}
        >
          <Typography id="modal-title" variant="h6" fontWeight={700} mb={2}>
            PDF Result
          </Typography>
          <Box
            id="modal-description"
            sx={{
              maxHeight: 300,
              overflowY: "auto",
              bgcolor: "#222b45",
              borderRadius: 1,
              p: 2,
              mb: 3,
              fontFamily: "monospace",
              fontSize: 14,
              color: "#b0b8d1",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
            }}
          >
            {modalResult ? JSON.stringify(modalResult, null, 2) : ""}
          </Box>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownload}
              sx={{ minWidth: 100, fontWeight: 600 }}
            >
              Download
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setModalOpen(false)}
              sx={{ minWidth: 100, fontWeight: 600 }}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}