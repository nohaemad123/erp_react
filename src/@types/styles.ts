import { SxProps } from "@mui/material";

export const cashierButtonStyle: SxProps = {
  borderRadius: "8px",
  height: "48px",
  flexGrow: 1,
  fontSize: "16px",
  paddingInline: "16px",
};

export const cashierIconButtonStyle: SxProps = {
  width: "48px",
  height: "48px",
  borderRadius: "8px",
};

export const modalContainerStyle: SxProps = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "440px",
  backgroundColor: "white",
  boxShadow: 24,
  padding: "24px 16px",
  borderRadius: "9px",
  animation: "slideUp 0.3s ease-in-out",
  "@keyframes slideUp": {
    "0%": {
      transform: "translate(-50%, 100%)",
      opacity: 0,
    },
    "100%": {
      transform: "translate(-50%, -50%)",
      opacity: 1,
    },
  },
};
