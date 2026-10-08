import { useEffect, useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import { setToast } from "../../utils/commonFunction/common";
import { Labels } from "../../utils/constants/labels";

export default function PToast() {
  const [state, setState] = useState({
    open: false,
    message: "",
    status: ""
  });

  useEffect(() => {
    setToast(({ status , message}) => {
      setState({
        open: true,
        message,
        status
      });
    });
  }, []);

  const handleClose = () => {
    setState((prev) => ({ ...prev, open: false }));
  };

  return (
    <Snackbar
      open={state.open}
      autoHideDuration={2000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // 🔥 bottom-right
      sx={{ width: '30%' }}
    >
      <Alert
        onClose={handleClose}
        severity={state.status == Labels.status.success ? "success" : state.status == Labels.status.failure ? "error" : "info"} 
        variant="standard" 
        sx={{ width: "100%" }}    
      >
        {state.message}
      </Alert>
    </Snackbar>
  );
}