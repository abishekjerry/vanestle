import { useEffect, useMemo, useRef } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Autocomplete,
  TextField,
  Typography
} from "@mui/material";

import { Labels } from "../../utils/constants/labels";
import { FontFamily, FontSize } from "../../utils/constants/fonts";
import { CommonColors } from "../../utils/constants/colors";
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { FormControlBaseStyle } from "../../utils/constants/styles";

const PDropdown = ({ name = "", label, value = "", onChange, options = [], required = false, helperText = "",
  width = "", mt = 0.4, flag = "", disabled = false, readOnly = false, sx = {}, labelMode = "" }) => {
  const defaultValueRef = useRef("");
  useEffect(() => {
    if (value !== undefined && value !== null && value !== "") {
      defaultValueRef.current = value;
      return;
    }
    const selectedOption = options.find(
      option => option.selected === true
    );
    if (!selectedOption) {
      return;
    }
    // Prevent repeated onChange calls
    if (defaultValueRef.current === selectedOption.value) {
      return;
    }
    defaultValueRef.current = selectedOption.value;
    onChange({
      target: {
        name,
        value: selectedOption.value,
        label: selectedOption.label
      }
    });
  }, [options, value, name, onChange]);

  const internalValue = useMemo(() => {
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
    const selectedOption = options.find(option => option.selected);
    return selectedOption?.value || "";
  }, [value, options]);

  const selectedOption = useMemo(() =>
    options.find(option => option.value === internalValue) || null,
    [options, internalValue]
  );

  const baseSx = {
    width: width ? `${width}%` : Labels.fontSize.xxxxl,
    mt,

    "& .MuiInputLabel-root": {
      fontFamily: FontFamily.regular,
      fontSize: FontSize.textField.label,
      color: "#9e9e9e",
      top: "0px",
      "&.Mui-focused": { color: "#49C9E9" },
      "&.Mui-error": { color: "#d32f2f" },
      "&.Mui-disabled": { color: "#bdbdbd" },
    },

    // "& .MuiInputLabel-shrink": {
    //   color: "#49C9E9",
    //   fontWeight: 600,
    //   fontSize: "12px",
    //   transform: "translate(14px, -6px) scale(1)"
    // },

    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "#fcfbfd",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      fontFamily: FontFamily.bold,
      fontSize: FontSize.textField.input,
      color: "#424242",

      "& fieldset": {
        borderColor: helperText ? "#d32f2f" : "#ccc",
        borderWidth: "1.5px"
      },

      "&:hover fieldset": {
        borderColor: "#42A8C8"
      },

      "&.Mui-focused fieldset": {
        borderColor: "#ccc",
        borderWidth: "1.5px",
        boxShadow: "0 0 0 3px rgba(98,188,216,0.15)"
      },
    },

    "& .MuiFormHelperText-root": {
      fontFamily: FontFamily.bold,
      fontSize: FontSize.textField.error,
      color: CommonColors.textError,
      marginLeft: "2px",
      marginTop: "4px"
    }
  };

  const renderTextField = params => (
    <TextField
      {...params}
      label=""
      placeholder={labelMode === "inside" ? label : "Please Select"}
      required={required}
      error={!!helperText}
      helperText={helperText}
      InputLabelProps={{ shrink: false }}
    />
  );

  if (flag === Labels.flag.auto) {
    return (
      <>
        {labelMode === "" && (
          <Typography style={{ fontSize: "16px", color: "#171717", marginBottom: "8px" }}>
            {label}
          </Typography>
        )}
        <Autocomplete
          options={options}
          value={selectedOption}
          disableClearable
          disabled={readOnly}
          slots={{
            popupIndicator: KeyboardArrowDownOutlinedIcon,
          }}
          //disableClearable={!selectedOption}
          getOptionLabel={(option) => option?.label || ""}
          isOptionEqualToValue={(option, value) => option.value === value?.value}
          renderOption={(props, option) => (
            <li {...props} key={option.value}>
              {option.label}
            </li>
          )}
          onChange={(e, newValue) =>
            onChange({
              target: {
                name,
                value: newValue?.value,
                label: newValue?.label
              }
            })
          }
          sx={baseSx}
          renderInput={renderTextField}
        />
      </>
    );
  }

  return (
    <FormControl
      fullWidth
      size="small"
      required={required}
      error={!!helperText}
      sx={baseSx}
      disabled={readOnly}
    >
      {/* {labelMode === "" && ( <InputLabel style={{fontSize:"18px",color:"#171717",marginBottom:"8px"}} shrink={false}>{label}</InputLabel>)} */}
      {labelMode === "" && (
        <Typography style={{ fontSize: "16px", color: "#171717", marginBottom: "8px" }}>
          {label}
        </Typography>
      )}
      <Select
        displayEmpty
        value={internalValue}
        // label={labelMode === "" ? "Please select" : label}
        name={name}
        IconComponent={KeyboardArrowDownOutlinedIcon}
        renderValue={(selected) =>
          selected ? (
            options.find((o) => o.value === selected)?.label
          ) : (
            <span style={{ color: "#C6C7C8" }}>
              {labelMode === "inside" ? label : "Please Select"}
            </span>
          )
        }
        onChange={(e) => {
          const selected = options.find(
            (opt) => opt.value === e.target.value
          );
          onChange({
            target: {
              name: name,
              value: selected?.value,
              label: selected?.label
            }
          });
        }}
      >
        {!disabled && (
          <MenuItem value=""> <em>-- Choose --</em> </MenuItem>
        )}

        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>

      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default PDropdown;