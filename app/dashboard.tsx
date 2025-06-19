"use client";
import { Box, Typography, Paper, Container, Button, Modal, LinearProgress } from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { useRef, useState } from "react";
import api from "./components/ApiClient";
import Tesseract from "tesseract.js";

// --- PDF and OCR helpers (inlined) ---
// import * as pdfjsLib from "pdfjs-dist/build/pdf";
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

// Set workerSrc for pdfjs
// pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Convert PDF to images
async function pdfToImages(
  uint8: Uint8Array,
  options?: {
    scale?: number;
    onProgress?: (progress: { current: number; total: number }) => void;
    onStart?: (progress: { current: 0; total: number }) => void;
  }
): Promise<string[]> {
  const output: string[] = [];
  const doc = await pdfjsLib.getDocument(uint8).promise;
  options?.onStart && options.onStart({ current: 0, total: doc.numPages });
  for (let i = 1; i <= doc.numPages; i++) {
    const canvas = document.createElement("canvas");
    const page = await doc.getPage(i);
    const context = canvas.getContext("2d");
    const viewport = page.getViewport({ scale: options?.scale || 1.5 });
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    if (context) {
      await page.render({ canvasContext: context, viewport }).promise;
      options?.onProgress && options.onProgress({ current: i, total: doc.numPages });
      output.push(canvas.toDataURL("image/png"));
    } else {
      throw new Error("Failed to get 2D context from canvas.");
    }
  }
  return output;
}

// OCR images
async function OCRImages(
  urls: string[],
  options?: {
    onProgress?: (progress: { current: number; total: number }) => void;
    onStart?: (progress: { current: 0; total: number }) => void;
  }
): Promise<Record<string, string>> {
  options?.onStart && options.onStart({ current: 0, total: urls.length });
  const progress = { total: urls.length, current: 0 };
  const texts = [];
  for (let i = 0; i < urls.length; i++) {
    const { data: { text } } = await Tesseract.recognize(urls[i], "eng");
    progress.current = i + 1;
    options?.onProgress && options.onProgress(progress);
    texts.push(text);
  }
  return texts.reduce((acc, text, index) => ({ ...acc, [index + 1]: text }), {});
}

// Download helper
function download(data: string, filename: string): void {
  const blob = new Blob(["\ufeff", data]);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

// --- Dashboard component ---
export default function Dashboard() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewName, setPreviewName] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [jsonResult, setJsonResult] = useState<any>(null);
  const [progress, setProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [ocrProgress, setOcrProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });

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

  // Parse PDF and OCR
  const parsePdfAndOcr = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);

    setProgress({ current: 0, total: 0 });
    setOcrProgress({ current: 0, total: 0 });

    const imageUrls = await pdfToImages(uint8, {
      onStart: ({ current, total }) => setProgress({ current, total }),
      onProgress: ({ current, total }) => setProgress({ current, total }),
    });

    const result = await OCRImages(imageUrls, {
      onStart: ({ current, total }) => setOcrProgress({ current, total }),
      onProgress: ({ current, total }) => setOcrProgress({ current, total }),
    });

    return result;
  };

  const handleSend = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      // 1. Parse PDF and OCR on frontend
      const result = await parsePdfAndOcr(selectedFile);

      setJsonResult(result);
      setModalOpen(true);

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
    download(JSON.stringify(jsonResult, null, 2), (previewName || "result") + ".json");
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
          Recognise text in your PDF files
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
          <Box width="100%" maxWidth={700} mb={2}>
            {progress.total > 0 && (
              <Box mb={1}>
                <Typography color="white" fontSize={14}>
                  PDF to Images: {progress.current}/{progress.total}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(progress.current / progress.total) * 100}
                />
              </Box>
            )}
            {ocrProgress.total > 0 && (
              <Box mb={1}>
                <Typography color="white" fontSize={14}>
                  OCR Progress: {ocrProgress.current}/{ocrProgress.total}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(ocrProgress.current / ocrProgress.total) * 100}
                />
              </Box>
            )}
          </Box>
        )}
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
