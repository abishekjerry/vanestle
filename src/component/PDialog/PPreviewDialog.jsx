import React from "react";
import {
  Dialog,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function PreviewDialog({
  open,
  onClose,
  files = [],
  currentIndex = 0,
  setCurrentIndex,
}) {
  const file = files[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === files.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? files.length - 1 : prev - 1
    );
  };

const getFileContent = () => {
  if (!file) return null;

  const fileUrl =
    file.url || URL.createObjectURL(file.file);

  const ext = file.name.split(".").pop().toLowerCase();
  const isBlob = fileUrl.startsWith("blob:");

  // 🖼 IMAGE
  if (["png", "jpg", "jpeg"].includes(ext)) {
    return (
      <img
        src={fileUrl}
        alt="preview"
        style={{
          maxWidth: "90%",
          maxHeight: "80vh",
          objectFit: "contain",
        }}
      />
    );
  }

  // 📄 PDF
  if (ext === "pdf") {
    return (
      <iframe
        src={fileUrl}
        width="90%"
        height="80%"
        style={{ border: "none" }}
        title="pdf"
      />
    );
  }

  // 📊 OFFICE FILES
  if (["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(ext)) {
    if (isBlob) {
      return (
        <Box textAlign="center" color="#fff">
          <Typography>
            Preview not available for this file
          </Typography>
        </Box>
      );
    }

    return (
      <iframe
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${fileUrl}`}
        width="90%"
        height="80%"
        style={{ border: "none" }}
        title="office"
      />
    );
  }
  return (
    <Box textAlign="center" color="#fff">
      <Typography>
        Preview not available for this file
      </Typography>
    </Box>
  );
};

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <Box
        sx={{
          background: "#000",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            color: "#fff",
          }}
        >
          <Typography>
            {file?.name || ""}
          </Typography>

          <IconButton onClick={onClose} sx={{ color: "#fff" }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* ⬅️ Prev */}
          {files.length > 1 && (
            <IconButton
              onClick={handlePrev}
              sx={{
                position: "absolute",
                left: 10,
                color: "#fff",
              }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
          )}

          {/* 👉 File Content */}
          {getFileContent()}

          {/* ➡️ Next */}
          {files.length > 1 && (
            <IconButton
              onClick={handleNext}
              sx={{
                position: "absolute",
                right: 10,
                color: "#fff",
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          )}
        </Box>
      </Box>
    </Dialog>
  );
}