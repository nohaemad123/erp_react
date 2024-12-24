import { useAppStore } from "@/store";
import { Button, ButtonProps } from "@mui/material";
import { useTranslation } from "react-i18next";

/**
 * A component for rendering a "Save" button.
 * @param {ButtonProps} props - Props passed to the Button component.
 * @param {SxProps} [props.sx] - Additional styles to apply to the button.
 * @returns {JSX.Element} - A submit button with "Save" label which is disabled when an HTTP client is loading.
 */
export function SaveButtonAtom({ sx, ...props }: Readonly<ButtonProps>) {
  const { t } = useTranslation();
  const { isHttpClientLoading } = useAppStore();
  return (
    <Button
      disabled={isHttpClientLoading}
      variant={"outlined"}
      type="submit"
      sx={{
        color: "white",
        backgroundColor: "var(--primary)",
        fontSize: "14px",
        fontWeight: "600",
        textDecoration: "none",
        width: "99px",
        padding: "6px 16px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        height: "32px",
        ...sx,
      }}
      {...props}
    >
      {t("Save")}
    </Button>
  );
}
