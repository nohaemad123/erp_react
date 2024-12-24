import { useAppStore } from "@/store";
import { Button, ButtonProps } from "@mui/material";
import { useTranslation } from "react-i18next";

/**
 * A reset button component.
 * @param {IResetButtonProps} props - Component props.
 * @param {ButtonProps} [props.sx] - Additional styles to apply to the button.
 * @returns {JSX.Element} - The reset button component.

 */
export function ResetButtonAtom(props: Readonly<ButtonProps>) {
  const { t } = useTranslation();
  const { isHttpClientLoading } = useAppStore();
  return (
    <Button
      type="button"
      disabled={isHttpClientLoading}
      sx={{
        border: "1px solid #E6E6E6",
        borderRadius: "8px",
        padding: "6px 16px",
        fontSize: "14px",
        fontWeight: "600",
        color: "#b3b3b3",
        backgroundColor: "#fff",
      }}
      {...props}
    >
      <span className="mx-2">{t("Reset")}</span>
    </Button>
  );
}
