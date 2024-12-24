import { useAppStore } from "@/store";
import { Button, ButtonProps } from "@mui/material";
import { useTranslation } from "react-i18next";

/**
 * A component for rendering a "Delete" button.
 * @param {ButtonProps} props - Props passed to the Button component.
 * @param {SxProps} [props.sx] - Additional styles to apply to the button.
 * @returns {JSX.Element} - A button with "Delete" label which is disabled when an HTTP client is loading.
 */

export function DeleteButtonAtom({ sx, ...props }: Readonly<ButtonProps>) {
  const { t } = useTranslation();
  const { isHttpClientLoading } = useAppStore();
  return (
    <Button
      disabled={isHttpClientLoading}
      type="button"
      sx={{
        backgroundColor: "#fff",
        color: "var(--danger)",
        fontSize: "14px",
        fontWeight: "600",
        textDecoration: "none",
        padding: "6px 16px",
        borderRadius: "8px",
        boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.12)",
        height: "32px",
        ...sx,
      }}
      {...props}
    >
      {t("Delete")}
    </Button>
  );
}
