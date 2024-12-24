import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";

/**
 * A reusable component for rendering a "Print" button.
 * @param {ButtonProps} [props] - Props passed to the Button component.
 * @returns {JSX.Element} - The component itself
 */

export function PrintButton({ ...props }) {
  const { t } = useTranslation();
  return (
    <Button
      variant={"outlined"}
      type="submit"
      sx={{
        backgroundColor: "var(--primary)",
        color: "white",
        fontSize: "14px",
        fontWeight: "600",
        textDecoration: "none",
        padding: "6px 16px",
        borderRadius: "8px",
        boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.12)",
        border: "1px solid #E6E6E6",
      }}
      {...props}
    >
      <span>{t("print")}</span>
    </Button>
  );
}
