import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

const PToggle = ({ options = [], value, onChange , disabled = false , onclick}) => {
  const handleChange = (event, newValue) => {
    if (newValue !== null) {
      onChange(newValue);
    }
  };

  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={handleChange}
      onClick={onclick}
      size="small"
      disabled = {disabled}
      sx={{
        display: "flex",       
        width: "100%",             
        maxWidth: "300px",
        backgroundColor: "#f1f5f9",
        borderRadius: "30px",
        p: "4px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        transition: "all 0.3s ease",

        "& .MuiToggleButton-root": {
          flex: 1,
          border: "none",
          borderRadius: "25px",
          px: 3,
          py: 0.6,
          color: "#475569",
          fontSize: "13px",
          fontWeight: 500,
          textTransform: "none",
          display: "flex",
          alignItems: "center",
          gap: "5px",
          transition: "all 0.25s ease",

          "&:hover": {
            backgroundColor: "#e2e8f0",
          },
        },

        "& .Mui-selected": {
          background: "linear-gradient(135deg, #23A9F2, #1d8ed1)",
          color: "#ffffff !important",
          boxShadow: "0 4px 12px rgba(35,169,242,0.4)",
          transform: "scale(1.02)",

          "&:hover": {
            background: "linear-gradient(135deg, #1d8ed1, #167bb8)",
          },
        },
      }}
    >
      {options.map((option) => (
        <ToggleButton key={option.value} value={option.value}>
          {option.icon}
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default PToggle;