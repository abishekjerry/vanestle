import React, { useState } from "react";
import { TextField, IconButton, InputAdornment, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Labels } from "../../utils/constants/labels";
import { FontFamily, FontSize } from "../../utils/constants/fonts";

export default function PTextField({
    inputRef,
    flag,
    label = "",
    value = "",
    onChange,
    onKeyPress,
    onKeyUp,
    onBlur,
    disabled = false,
    name = "",
    helperText = "",
    type = "text",
    multiline = false,
    rows = 1,
    variant = "outlined",
    inputProps = {},
    startIcon,
    width = "100%",
    min,
    max,
    sx = {},
    placeHolder = ""
}) {
    const isPassword = flag === Labels.flag.password;
    const [showPassword, setShowPassword] = useState(false);
    const handleToggleVisibility = () => {
        setShowPassword(prev => !prev);
    };
    const baseSx = {
        width,
        mt: 0.4,
        "& .MuiOutlinedInput-root": {
            borderRadius: "0",
            backgroundColor: "#fff",
            "& fieldset": {
                borderColor: helperText ? "#d32f2f" : "#ccc",
            },  
            "&:hover fieldset": {
                borderColor: "#16133F",
            },

            "&.Mui-focused fieldset": {
                borderColor: "#16133F",
            },
        },
        "& .MuiFormHelperText-root.Mui-error":{
           marginLeft: 0,
        },
        "& .MuiInputLabel-root": {
            fontFamily: FontFamily.bold,
            fontSize: FontSize.textField.label,
        },
        "& .MuiOutlinedInput-input":{ 
            height:"50px",
            boxSizing: "border-box",
        },
        "& .MuiInputBase-input:-webkit-autofill": {
            WebkitBoxShadow: "0 0 0 1000px #ffffff inset",
            WebkitTextFillColor: "#171717",
            caretColor:"#171717"
        },
        "& .MuiInputLabel-shrink": {
            color: "#000000",
            fontWeight: 600,
            fontSize: "16px",
            transform: "translate(10px, -12px)",
        },
        ...sx
    };

    return (
         <>
            <Typography style={{fontSize:"16px",color:"#171717",marginBottom:"8px"}}>
                {label}
            </Typography>
            <TextField
                placeholder={placeHolder}
                name={name}
                // label={label}
                value={value}
                onChange={onChange}
                onKeyPress={onKeyPress}
                onKeyUp={onKeyUp}
                onBlur={onBlur}
                type={isPassword && !showPassword ? "password" : type}
                inputRef={inputRef}
                multiline={multiline}
                rows={rows}
                disabled={disabled}
                helperText={helperText}
                error={!!helperText}
                variant={variant}
                InputLabelProps={{ shrink: false,}}
                sx={baseSx}
                inputProps={{ ...inputProps, min, max }}
                InputProps={{
                    startAdornment: startIcon && (
                        <InputAdornment position="start">
                            {startIcon}
                        </InputAdornment>
                    ),
                    endAdornment: isPassword && (
                        <InputAdornment position="end">
                            <IconButton onClick={handleToggleVisibility}>
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
        </>
    );
}