import React, { useEffect, useRef } from "react";
import { TextField, InputAdornment, IconButton, Typography } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { FormControlBaseStyle } from "../../utils/constants/styles";

export default function PDatepicker({ label = "", value = "", onChange, width, helperText = "", disabled = false, name = ""
  , inputRef, placeholder = "DD/MM/YYYY", mt = 0.4, allowFuture = false, minDate = null, maxDate = null }) {

  const internalRef = useRef(null);
  const textFieldRef = inputRef || internalRef;
  const flatpickrRef = useRef(null);

  useEffect(() => {
    if (!textFieldRef.current) return;

    flatpickrRef.current = flatpickr(textFieldRef.current, {
      disableMobile: true,
      dateFormat: "d/m/Y",
      defaultDate: value || null,
      allowInput: true,
      minDate: minDate || null,
      maxDate: maxDate || (allowFuture ? null : "today"),
      clickOpens: true,
      static: true,
      onChange: function (selectedDates, dateStr) {
        if (onChange) {
          onChange({
            target: {
              name: name,
              value: dateStr,
            },
          });
        }
      },
    });

    return () => {
      flatpickrRef.current?.destroy();
    };
  }, [allowFuture, minDate, maxDate, value]);

  const handleIconClick = () => {
    flatpickrRef.current?.open();
  };

  const handleKeyDown = (e) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
    ];
    if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleInput = (e) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2);
    if (value.length > 5) value = value.slice(0, 5) + "/" + value.slice(5);
    if (value.length > 10) value = value.slice(0, 10);

    e.target.value = value;

    if (value.length === 10) {
      const [day, month, year] = value.split("/");
      const enteredDate = new Date(`${year}-${month}-${day}`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Block future dates if allowFuture is false
      if (!allowFuture && enteredDate > today) {
        e.target.value = "";
      }
    }

    if (onChange) {
      onChange({
        target: {
          name: name,
          value: e.target.value,
        },
      });
    }
  };

  const baseSx = FormControlBaseStyle(width, mt);
  return (
    <>
      <Typography style={{ fontSize: "16px", color: "#171717", marginBottom: "8px" }}>
        {label}
      </Typography>
      <TextField
        name={name}
        inputRef={textFieldRef}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        helperText={helperText}
        error={!!helperText}
        variant="outlined"
        sx={{
          ...baseSx,
          "& .MuiOutlinedInput-notchedOutline legend": {
            display: "none",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            top: 0,
          },
        }}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        autoComplete="off"
        inputProps={{
          autoComplete: "off",
          form: {
            autoComplete: "off",
          },
        }}
        InputLabelProps={{
          shrink: !!value,
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end" sx={{ marginLeft: "auto", position: "relative", }}>
              <IconButton
                onClick={handleIconClick}
                disabled={disabled}
                sx={{
                  backgroundColor: "#2D2F75",
                  color: "#fff",
                  borderRadius: "0",
                  height: "50px",
                  width: "50px",
                  padding: 0,
                  // border:"1px solid #2D2F75",
                  marginRight: "-14px",
                  "&:hover": { backgroundColor: "#2D2F75" },
                }}
              >
                <CalendarTodayIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </>
  );
}