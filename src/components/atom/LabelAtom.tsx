import { InputLabel, InputLabelProps, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

interface LabelAtomProps extends InputLabelProps {
  labelMessage: string;
  required?: boolean;
}

/**
 * @desc Render a label with optional required text
 * @param {required} props component props
 * @param {string} props.labelMessage labelMessage text
 * @param {boolean} [props.required= false] whether the label is required or not
 * @returns {ReactElement} a label element
 */

export default function LabelAtom({ labelMessage, required = false, sx, ...props }: Readonly<LabelAtomProps>) {
  const { t, i18n } = useTranslation();
  const mandatoryText = i18n.language === "ar" ? "\u200E(\u200Eاجباري\u200E)\u200E" : "\u200E(\u200EMandatory\u200E)\u200E";
  return (
    <InputLabel
      sx={{
        fontSize: "14px",
        fontWeight: "600",
        color: "#404040",
        marginBottom: "8px",
        ...sx,
      }}
      {...props}
    >
      {t(labelMessage)}{" "}
      {required && (
        <Typography component="span" variant="body2" fontSize={10} fontWeight={600} color="9E9E9E">
          {mandatoryText}
        </Typography>
      )}
    </InputLabel>
  );
}
