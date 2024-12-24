import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";

interface IAddNewRowButtonProps {
  handleAddRow: () => void;
}
export const AddNewRowButton = ({ handleAddRow }: Readonly<IAddNewRowButtonProps>) => {
  const { t } = useTranslation();
  return (
    <Button variant="outlined" sx={{ color: "var(--primary)", fontSize: "14px", fontWeight: "600" }} onClick={handleAddRow}>
      {t("Add")}
    </Button>
  );
};
