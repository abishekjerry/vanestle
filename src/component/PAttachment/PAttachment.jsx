import React from "react";
import {
    Grid,
    Typography,
    IconButton,
    Paper,
} from "@mui/material";

import AttachFileIcon from "@mui/icons-material/AttachFile";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";

const PAttachment = ({ file, onPreview, onDelete, showDelete = true, showPreview = true, }) => {
    if (!file) return null;
    const fileSize = typeof file.size === "number" ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : "";
    return (
        <Paper
            elevation={0}
            sx={{
                p: 1,
                borderRadius: 2,
                border: "1px solid #d4d4d4",
                backgroundColor: "#f5f5f5",
                width: "100%",
            }}
        >
            <Grid
                container
                alignItems="center"
                justifyContent="space-between"
                wrap="nowrap"
            >
                {/* File Details */}
                <Grid
                    item
                    xs
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        overflow: "hidden",
                    }}
                >
                    <AttachFileIcon fontSize="small" />

                    <Typography
                        variant="body2"
                        sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {file.name}
                    </Typography>

                    {fileSize && (
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ flexShrink: 0 }}
                        >
                            ({fileSize})
                        </Typography>
                    )}
                </Grid>

                {/* Actions */}
                <Grid item>
                    {showPreview && (
                        <IconButton
                            size="small"
                            onClick={onPreview}
                        >
                            <VisibilityIcon fontSize="small" />
                        </IconButton>
                    )}

                    {showDelete && (
                        <IconButton
                            size="small"
                            onClick={onDelete}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    )}
                </Grid>
            </Grid>
        </Paper>
    );
};

export default PAttachment;