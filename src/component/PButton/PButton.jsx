import React from "react";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import { FontFamily, FontSize } from "../../utils/constants/fonts";
import { CommonColors } from "../../utils/constants/colors";
import CircularProgress from "@mui/material/CircularProgress";
export default function PButton({ label, onClick, width, height, children, color = "primary", font = FontFamily.medium,
  size = "medium", variant = "contained", disabled = false, startIcon = null, endIcon = null, disableRipple = true,
  fullWidth = false, gradient = false, type = "button", rounded = "sm", shadow = true, sx = {}, loading = false }) {

  const theme = useTheme();
  const gradientBackground = CommonColors.gradientBackgrounds?.[color] || "linear-gradient(to right, #4e54c8, #8f94fb)";
  const solidColor = color === "primary" ? CommonColors.dark_blue : color;

  const radiusMap = {
    sm: "6px",
    md: "12px",
    lg: "20px",
    xl: "30px",
  };

  return (
    <>
      <Button
        className={`${variant === "outlined" ? "outlined-btn" : "select-btn"} ${startIcon ? "has-icon" : ""}`}
        type={type}
        onClick={onClick}
        disableRipple={disableRipple}
        variant={variant}
        size={size}
        startIcon={startIcon}
        endIcon={endIcon}
        disabled={disabled}
        fullWidth={fullWidth}
        sx={{
          width: width,
          height: height,
          cursor: "pointer",
          textTransform: "none",
          fontFamily: font,
          fontWeight: 600,
          padding: "10px 24px",
          fontSize: size === "small" ? "1rem" : size === "large" ? "1rem" : "1rem",
          borderRadius: radiusMap[rounded],
          color: variant === "contained" || gradient ? theme.palette.common.white : solidColor,
          background: gradient ? gradientBackground : variant === "contained" ? solidColor : "white",

          border: variant === "outlined" ? `1px solid ${solidColor}` : "none",
          boxShadow: "none",
          transition: "all 0.3s ease",
          "&:hover": {
            background: gradient ? gradientBackground : variant === "contained" ? solidColor : "#fff",
            border: variant === "outlined" ? `1px solid ${solidColor}` : "none",
            boxShadow: "none",
          },

          "&:disabled": {
            background: variant === "text" ? "transparent" :theme.palette.action.disabledBackground,
            color: `${theme.palette.text.disabled} !important`,
            boxShadow: "none",
            cursor: "not-allowed",
          },

          ...sx,
        }}
      >
        {loading && (
          <CircularProgress
            size={18}
            color="inherit"
            sx={{ mr: 1 }}
          />
        )}
        {label || children}
      </Button>

    </>
  );
}