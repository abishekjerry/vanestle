import {FormControl, Radio, RadioGroup, FormControlLabel, Box,Typography,FormHelperText } from "@mui/material";

const PRadio = ({ 
  value, 
  onChange, 
  options,
  flag,
  name,
  label, 
  sx,
  helperText = "",
  required = false,
  error = false,
 }) => {
  if(flag == "customstyle"){
    return (
      <RadioGroup
        row
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        sx={{ justifyContent:'space-between'}}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            // The control is the actual radio, we hide it with sx
            control={<Radio sx={{ display: 'none' }} />}
            label={option.label}
            sx={{
              margin: 0,
              borderRadius: "32px",
              padding: {
                xs:"8px 20px",
                sm:"8px 35px",
                md:"8px 35px"
              },
              backgroundColor: value === option.value ? "#2D2F75" : "transparent",
              border:'1px solid #2D2F75',
              color: value === option.value ? "#fff" : "#16133F",
              fontSize:"18px",
              fontWeight: 400,
              transition: "0.3s",
              "& .MuiFormControlLabel-label": {
                fontFamily: "inherit", // You can use your FontFamily.bold here
              },
              "&:hover": {
                backgroundColor: value === option.value ? "#2D2F75" : "transparent",
              }
            }}
          />
        ))}
        
      </RadioGroup>
    );
  }

  return (
    <>
      <Typography style={{fontSize:"16px",color:"#171717",marginBottom:"8px"}}>
          {label}
          {required && <span style={{ color: "red" }}>*</span>}
      </Typography>
      <FormControl
          required={required}
          error={error || !!helperText}
          component="fieldset"
        >
        <RadioGroup
          row
          value={String(value ?? "")}
          onChange={(e) => {
            const selected = options.find(
              (opt) => String(opt.value) === e.target.value
            );

            onChange({
              target: {
                name,
                value: selected?.value,
                label: selected?.label,
              },
            });
          }}
        >
          {options.map((option) => (
            <FormControlLabel
              key={option.value}
              value={String(option.value)}
              control={
                <Radio
                  sx={{
                    color: "#C6C7C8",
                    "&.Mui-checked": {
                      color: "#16133F",
                    },
                  }}
                />
              }
              label={option.label}
            />
            
          ))}
          
        </RadioGroup>
        {helperText && (<FormHelperText style={{marginLeft:'0'}}>{helperText}</FormHelperText>
      )}
    </FormControl>
    </>
  );
};

export default PRadio;