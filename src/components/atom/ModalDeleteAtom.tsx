import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { ButtonBase } from "@mui/material";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { modalContainerStyle } from "@/@types/styles";

interface IModalDeleteAtom {
  isOpen: boolean;
  deleteHandler: () => void;
  closeHandler: () => void;
  titleMessage: string;
  descriptionMessage: string;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
}

/**
 * @desc A modal component for confirming the deletion of an item.
 * @param {boolean} isOpen - Determines whether the modal is open.
 * @param {Function} deleteHandler - Function to call when the delete action is confirmed.
 * @param {Function} closeHandler - Function to call to close the modal.
 * @param {string} titleMessage - The title message to display in the modal.
 * @param {string} descriptionMessage - The description message to display in the modal.
 * @param {string} ariaLabelledby - The aria-labelledby attribute for the modal.
 * @param {string} ariaDescribedby - The aria-describedby attribute for the modal.
 *
 * @returns {JSX.Element}
 */

export default function ModalDeleteAtom({
  isOpen,
  deleteHandler,
  closeHandler,
  titleMessage,
  descriptionMessage,
  ariaLabelledby = "modal-modal-title",
  ariaDescribedby = "modal-modal-description",
}: Readonly<IModalDeleteAtom>) {
  const { t } = useTranslation();
  if (!isOpen) return null;
  return (
    <Box>
      <Modal open={isOpen} aria-labelledby={ariaLabelledby} aria-describedby={ariaDescribedby} onClose={closeHandler}>
        <Box sx={modalContainerStyle}>
          <ButtonBase onClick={closeHandler} className="absolute">
            <IoCloseCircleOutline className="w-6 h-6 text-[#808080CC]" />
          </ButtonBase>

          <Typography
            variant="h2"
            component="h2"
            fontSize={22}
            fontWeight={700}
            className="text-[var(--primary)] center leading-[41.23px] text-center"
          >
            {t(titleMessage)}
          </Typography>

          <Typography component="h5" fontSize={16} fontWeight={400} color="#808080" className="leading-[22.4px] my-4 text-center">
            {t(descriptionMessage)}
          </Typography>

          <Box className="flex gap-5 my-5">
            <Button
              onClick={deleteHandler}
              sx={{ background: "#226ab2", color: "white" }}
              className=" text-white w-[196px] h-[50px] p-[10px] border border-[var(--primary)] text-[18px] font-bold"
            >
              {t("Delete")}
            </Button>
            <Button
              variant="outlined"
              onClick={closeHandler}
              className="bg-white text-[var(--primary)] w-[196px] h-[50px] p-[10px] border border-[var(--primary)] text-[18px]  font-bold"
            >
              {t("Back")}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
