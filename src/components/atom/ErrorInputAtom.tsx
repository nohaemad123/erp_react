import { Typography, TypographyProps } from "@mui/material";
import { useTranslation } from "react-i18next";

interface ErrorInputProps extends TypographyProps {
  className?: string;
  errorMessage: string | undefined;
}

/**
 * A component for displaying an error message next to a form input.
 * @prop {string} errorMessage - The error message to display.
 * @prop {TypographyProps['sx']} [sx] - Additional styles to apply to the Typography component.
 * @prop {string} [fontSize] - The font size of the error message. Defaults to "12px".
 * @prop {string} [fontWeight] - The font weight of the error message. Defaults to "500".
 * @prop {string} [className] - A class name to apply to the Typography component.
 * @returns {JSX.Element}
 */
export function ErrorInputAtom({ errorMessage, sx, fontSize = "14px", fontWeight = "400", className }: Readonly<ErrorInputProps>) {
  const { t } = useTranslation();
  if (!errorMessage) return null;
  return (
    <Typography
      component={"p"}
      variant="body2"
      color="error"
      fontSize={fontSize}
      fontWeight={fontWeight}
      className={className}
      sx={{ marginTop: 1, ...sx }}
    >
      {t(errorMessage)}
    </Typography>
  );
}
