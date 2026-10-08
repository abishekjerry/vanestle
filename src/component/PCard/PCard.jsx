import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from "@mui/material";
import "./PCard.css";
import { CommonColors } from "../../utils/constants/colors";

export default function PCard({
  title,
  icon,          // ✅ new (optional)
  rightAction,   // ✅ new (optional)
  onBackClick,
  children,
  className = "",
  color,
  collapsible = false,   // 👈 new
  isOpen = true,         // 👈 new
  onToggle,
  readOnly = false,
}) {
  return (
    <div className={`pcard-container ${className}`}>

      {title && (
        <div
          className={`pcard-header ${icon || rightAction ? "d-flex justify-content-between align-items-center" : ""}`}
          style={
            icon || rightAction
              ? { margin: "0", backgroundColor: color || "", cursor: collapsible ? "pointer" : "default" }
              : {}
          }
          onClick={collapsible ? onToggle : undefined}
        >
          <div className="d-flex align-items-center gap-2">
            {/* {!icon && <div className="pcard-side" />}
            {icon && icon} */}
            <h2 className={`pcard-title ${icon || rightAction ? "text-white mb-0" : ""}`}> {title} </h2>
          </div>
          {(rightAction || onBackClick) ? (
            <div className="pcard-side pcard-back-button-wrapper">
              {rightAction ? (
                <div onClick={(e) => e.stopPropagation()}>
                  {rightAction}
                </div>
              ) : onBackClick ? (
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onBackClick();
                  }}
                  className={icon || rightAction ? "text-white" : "pcard-back-button"}
                >
                  <ArrowBackIcon />
                </IconButton>
              ) : null}
            </div>
          ) : (
            <div className="pcard-side" />
          )}
        </div>
      )}
      <div className="pcard-content" style={{ pointerEvents: readOnly ? "none" : "auto", opacity: readOnly ? 0.7 : 1}}>
        {collapsible ? isOpen && children : children}
      </div>
    </div>
  );
}