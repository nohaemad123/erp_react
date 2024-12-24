"use client";
import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useTranslation } from "react-i18next";
import { modalContainerStyle } from "@/@types/styles";

interface IModalSavedAtom {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEdit?: boolean;
}

/**
 * @desc A modal component for displaying a success message after saving data.
 * @param {boolean} isOpen - Determines whether the modal is open.
 * @param {Function} setIsOpen - Function to call to close the modal.
 * @param {boolean} isEdit - Determines whether the data is being edited.
 * @returns {JSX.Element}
 *
 */

export default function ModalSavedAtom({ isEdit, isOpen, setIsOpen }: Readonly<IModalSavedAtom>) {
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  return (
    <Modal open={isOpen} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={modalContainerStyle} className="text-center">
        <Typography variant="h6" component="h2" fontWeight={800} fontSize={22} className="text-[var(--primary)]">
          {t(`Congratulations`)}
        </Typography>

        <Typography component="p" fontSize={20} className="text-[#808080] mt-2">
          {isEdit ? t("The modification process was completed successfully") : t("The addition process was completed successfully")}
        </Typography>
      </Box>
    </Modal>
  );
}
