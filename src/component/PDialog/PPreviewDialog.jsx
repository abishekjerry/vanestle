import React from "react";
import { Dialog, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import MsgReader from "@npeersab/msgreader";

export default function PreviewDialog({
  open,
  onClose,
  files = [],
  currentIndex = 0,
  setCurrentIndex,
}) {
  const file = files[currentIndex];
  const [msgData, setMsgData] = React.useState(null);
  const [msgError, setMsgError] = React.useState(false);

  const ext = file?.name?.split(".").pop()?.toLowerCase();

  React.useEffect(() => {
    if (!open || ext !== "msg" || !file) return;

    let active = true;

    const loadMsg = async () => {
      try {
        setMsgData(null);
        setMsgError(false);

        const source = file.file || file;
        const buffer = source instanceof Blob
          ? await source.arrayBuffer()
          : await (await fetch(file.url)).arrayBuffer();

        const reader = new MsgReader(buffer);
        const data = reader.getFileData();

        if (active) setMsgData(data);
      } catch {
        if (active) setMsgError(true);
      }
    };

    loadMsg();
    return () => { active = false; };
  }, [open, file, ext]);

  if (!file) return null;

  const fileUrl = file.url || URL.createObjectURL(file.file || file);

  const move = (step) =>
    setCurrentIndex((prev) => (prev + step + files.length) % files.length);

  const renderPreview = () => {
    if (["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(ext))
      return <img src={fileUrl} alt={file.name} style={{ maxWidth: "90%", maxHeight: "80vh" }} />;

    if (ext === "pdf")
      return <iframe src={fileUrl} title={file.name} width="90%" height="85%" style={{ border: 0 }} />;

    if (["txt", "csv"].includes(ext))
      return <TextPreview file={file} />;

    if (ext === "msg") {
      if (msgError) return <Typography color="white">Unable to preview MSG file.</Typography>;
      if (!msgData) return <Typography color="white">Loading email...</Typography>;

      return (
        <Box sx={{ bgcolor: "white", color: "#222", p: 1, overflow: "auto" }}>
          <Typography variant="h6">{msgData.subject || "No subject"}</Typography>
          <Typography>From: {msgData.senderName || msgData.senderEmail || ""}</Typography>
          <Typography>
            To: {(msgData.recipients || []).map((r) => r.name || r.email).filter(Boolean).join(", ")}
          </Typography>
          <hr />
          <Typography sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
            {msgData.body || "No email body available."}
          </Typography>
        </Box>
      );
    }

    if (["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(ext)) {
      if (fileUrl.startsWith("blob:"))
        return <Typography color="white">Office preview requires a public file URL.</Typography>;

      return (
        <iframe
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`}
          title={file.name}
          width="90%"
          height="85%"
          style={{ border: 0 }}
        />
      );
    }

    return <Typography color="white">Preview not supported.</Typography>;
  };

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <Box sx={{ bgcolor: "#000", height: "100vh", display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, color: "white" }}>
          <Typography>{file.name}</Typography>
          <IconButton onClick={onClose} sx={{ color: "white" }}><CloseIcon /></IconButton>
        </Box>

        <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          {files.length > 1 && (
            <IconButton onClick={() => move(-1)} sx={{ position: "absolute", left: 10, color: "white" }}>
              <ArrowBackIosNewIcon />
            </IconButton>
          )}

          {renderPreview()}

          {files.length > 1 && (
            <IconButton onClick={() => move(1)} sx={{ position: "absolute", right: 10, color: "white" }}>
              <ArrowForwardIosIcon />
            </IconButton>
          )}
        </Box>
      </Box>
    </Dialog>
  );
}

function TextPreview({ file }) {
  const [text, setText] = React.useState("");

  React.useEffect(() => {
    let active = true;

    (async () => {
      try {
        const source = file.file || file;
        const content = source instanceof Blob
          ? await source.text()
          : await (await fetch(file.url)).text();

        if (active) setText(content);
      } catch {
        if (active) setText("Unable to preview file.");
      }
    })();

    return () => { active = false; };
  }, [file]);

  return (
    <Box sx={{ bgcolor: "white", color: "#222", width: "90%", height: "85%", p: 2, overflow: "auto" }}>
      <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{text}</pre>
    </Box>
  );
}