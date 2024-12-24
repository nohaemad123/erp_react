import { Button, ButtonProps } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/store";

/**
 * A component for rendering a search button.
 * @prop {ButtonProps} props - Props passed to the Button component.
 * @returns {JSX.Element} - A submit button with "Search" label,
 *                          which is disabled when an HTTP client is loading.
 */
export function SearchButtonAtom({ ...props }: Readonly<ButtonProps>) {
  const { t } = useTranslation();
  const { isHttpClientLoading } = useAppStore();
  return (
    <Button
      disabled={isHttpClientLoading}
      sx={{
        border: "1px solid #E6E6E6",
        borderRadius: "8px",
        padding: "6px 16px",
        fontSize: "14px",
        fontWeight: "600",
        color: "#B3B3B3",
        backgroundColor: "#F2F2F2",
      }}
      type="submit"
      {...props}
    >
      {t("Search")}
    </Button>
  );
}
