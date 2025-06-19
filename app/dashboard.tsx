"use client";
import { Box, Typography, Paper, Container, Button, Modal } from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { useRef, useState } from "react";
import api from "./components/ApiClient";
import * as pdfjsLib from "pdfjs-dist/build/pdf.js";
import Tesseract from "tesseract.js";

// Make sure to set the workerSrc for pdfjs
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Helper: Render PDF page to canvas and get image data
async function renderPageToImage(page: any, scale = 1.5): Promise<HTMLCanvasElement> {
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const context = canvas.getContext("2d")!;
  await page.render({ canvasContext: context, viewport }).promise;
  return canvas;
}

// Main function: Parse PDF and OCR each page
export async function parsePdfFile(file: File): Promise<Record<string, string>> {
  const arrayBuffer = await file.arrayBuffer();
  const uint8 = new Uint8Array(arrayBuffer);
  const pdf = await pdfjsLib.getDocument({ data: uint8 }).promise;
  const result: Record<string, string> = {};

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const canvas = await renderPageToImage(page, 1.5);
    const dataUrl = canvas.toDataURL("image/png");

    // OCR using Tesseract.js
    const { data: { text } } = await Tesseract.recognize(dataUrl, "eng");
    result[i] = text;
  }

  return result;
}

export default function Dashboard() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewName, setPreviewName] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [jsonResult, setJsonResult] = useState<any>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type === "application/pdf") {
      setSelectedFile(files[0]);
      setPreviewName(files[0].name);
      setSuccess(null);
      setError(null);
    } else {
      setError("Please upload a PDF file.");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0] && files[0].type === "application/pdf") {
      setSelectedFile(files[0]);
      setPreviewName(files[0].name);
      setSuccess(null);
      setError(null);
    } else {
      setError("Please upload a PDF file.");
    }
  };

  // Assume you have a function parsePdfFile(file: File): Promise<any>
  const handleSend = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      // 1. Parse PDF on frontend
      const result = await parsePdfFile(selectedFile); // Implement this with pdfjs/tesseract

      // 2. Send result and file name to backend
      const token = localStorage.getItem("token");
      const res = await api.post(
        "/pdf/send",
        {
          file: selectedFile.name,
          result,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setSuccess("Result saved successfully!");
        setSelectedFile(null);
        setPreviewName("");
      } else {
        setError(res.data.message || "Save failed.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Save failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = () => {
    if (!jsonResult) return;
    const blob = new Blob([JSON.stringify(jsonResult, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (previewName || "result") + ".json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <Box
        minHeight="80vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-start"
        sx={{ bgcolor: "background.default", pt: 8 }}
      >
        <Typography
          variant="h3"
          fontWeight={700}
          align="center"
          sx={{ mb: 2, color: "white" }}
        >
          My Telegram id is @web3dev009. Let's chat on Telegram.
          My account is suspended. I am verifying now.
        </Typography>
        <Box maxWidth={600} width="100%" mb={4} sx={{ color: "white" }}>
          <Typography variant="h6" fontWeight={700}>
            How it works
          </Typography>
          <Typography>
            1. Each page of the uploaded PDF file will be converted to a PNG image
            <br />
            2. Each PNG image will go through an OCR that will read the text on the screen
            <br />
            3. A JSON file download will be available for you with the contents of each page.
          </Typography>
        </Box>
        <Paper
          elevation={0}
          sx={{
            border: "2px dashed #b0b8d1",
            borderRadius: 3,
            width: { xs: "90%", sm: 700 },
            minHeight: 160,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "background.default",
            cursor: "pointer",
            mb: 2,
            position: "relative",
            flexDirection: "column",
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleClick}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            multiple={false}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          {!selectedFile ? (
            <Box display="flex" flexDirection="row" alignItems="center" color="white">
              <CloudUploadOutlinedIcon sx={{ mr: 1 }} />
              <Typography fontWeight={500}>
                Drag’n’drop your file here, or click to select files
              </Typography>
            </Box>
          ) : (
            <Box width="100%" textAlign="center" py={3}>
              <Typography fontWeight={600} color="#1976d2">
                {previewName}
              </Typography>
              <Typography color="white" fontSize={14} mt={1}>
                Ready to upload
              </Typography>
            </Box>
          )}
        </Paper>
        {selectedFile && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSend}
            disabled={uploading}
            sx={{ mt: 2, minWidth: 120, fontWeight: 600 }}
          >
            {uploading ? "Uploading..." : "Send"}
          </Button>
        )}
        {success && (
          <Typography color="success.main" mt={2}>
            {success}
          </Typography>
        )}
        {error && (
          <Typography color="error" mt={2}>
            {error}
          </Typography>
        )}

        {/* Modal for showing result */}
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
              Parsed PDF Result
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
              {jsonResult ? JSON.stringify(jsonResult, null, 2) : ""}
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
      </Box>
    </Container>
  );
}
