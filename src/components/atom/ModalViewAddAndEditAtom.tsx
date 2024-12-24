"use client";

import { Modal, Box, SxProps } from "@mui/material";
import { Dispatch, ReactNode, SetStateAction } from "react";

interface IModalViewAddAndEditAtomProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onClose?: () => void;
  children?: ReactNode;
  sx?: SxProps;
}

export default function ModalViewAddAndEditAtom({
  isOpen,
  setIsOpen,
  onClose,
  children,
  sx,
}: Readonly<IModalViewAddAndEditAtomProps>) {
  if (!isOpen) return null;
  return (
    <Modal
      open={isOpen}
      closeAfterTransition
      onClose={() => {
        onClose?.();
        setIsOpen(false);
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          minWidth: 800,
          bgcolor: "#F1F5F8",
          padding: "16px",
          borderRadius: "16px",
          display: "flex",
          width: "100%",
          maxWidth: "80vw",
          overflowY: "auto",
          maxHeight: "90dvh",
          ...sx,
        }}
      >
        {children}
      </Box>
    </Modal>
  );
}
