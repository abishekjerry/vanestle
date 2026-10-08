import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

const PToggleCircle = ({ options = [], value, onChange , disabled = false , onclick}) => {
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
        maxWidth: "100px",
        backgroundColor: "transparant",
        borderRadius: "0",
        p: "4px",
        transition: "all 0.3s ease",
        gap:"16px",
        
        "& .MuiToggleButton-root": {
          flex: 1,
          border: "1px solid #2D2F75 !important",
          borderRadius: "50% !important",
          px: 3,
          py: 0.6,
          color: "#2D2F75",
          fontSize: "13px",
          width:"50px",
          height:"50px",
          fontWeight: 500,
          textTransform: "none",
          display: "flex",
          alignItems: "center",
          transition: "all 0.25s ease",
          "&:hover": {
            backgroundColor: "#2D2F75",
            color:"#fff"
          },
        },

        "& .Mui-selected": {
          background: "#2D2F75 !important",
          color: "#fff !important",
          boxShadow: "none",
          borderRadius: "50% !important",
          width:"50px",
          height:"50px",
          "&:hover": {
            background: "#2D2F75",
            color:"#fff",
            borderRadius: "50%",
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

export default PToggleCircle;