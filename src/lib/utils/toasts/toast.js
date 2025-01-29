"use client"
import toast, { Toaster } from "react-hot-toast";

export const showSuccessToast = (message, type = "default") => {
  const config = {
    style: {
      background: type === "error" ? "#f56565" : "white",
      textAlign: "center",
      color: "black",
      fontWeight: "bold",
      top: "10rem",
      padding: "0.5rem",
      paddingTop: "1rem",
      paddingBottom: "1rem",
      borderRadius: "0.5rem"
    },
    duration: 3000,
    position: "top-center",
    containerStyle: {
        position: "absolute",
        top: "50%", // Vertically center
        left: "50%", // Horizontally center
        transform: "translate(-50%, -50%)", // Offset by half its height and width
      },
  }

  if (type === "error") {
    toast.error(message, config)
  } else {
    toast.success(message, config)
  };
};

export const showErrorToast = (message, type = "error") => {
  const config = {
    style: {
      background: type === "error" ? "white" : "#f56565", /* #f565658 */
      textAlign: "center",
      color: "black",
      fontWeight: "bold",
      top: "10rem",
      padding: "0.5rem",
      paddingTop: "1rem",
      paddingBottom: "1rem",
      borderRadius: "0.5rem"
    },
    duration: 3000,
    position: "top-center",
    containerStyle: {
        position: "absolute",
        top: "50%", // Vertically center
        left: "50%", // Horizontally center
        transform: "translate(-50%, -50%)", // Offset by half its height and width
      },
  };

  if (type === "error") {
    toast.error(message, config)
  } else {
    toast.success(message, config)
  };
};

export const ToastContainer = () => 
  <Toaster 
    containerStyle={{ 
      position: "fixed", 
      width: "100%",
      top: "50%", // Vertically center
      left: "50%", // Horizontally center
      transform: "translate(-50%, -70%)",
    }} 
  />;
