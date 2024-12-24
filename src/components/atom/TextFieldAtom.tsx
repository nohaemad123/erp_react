import { TextField, TextFieldProps } from "@mui/material";
import { forwardRef } from "react";

interface ITextFieldAtomProps extends Omit<TextFieldProps, "ref"> {
  custom?: "table";
}

export const TextFieldAtom = forwardRef<HTMLDivElement, ITextFieldAtomProps>(({ custom, variant, ...props }, ref) => {
  return <TextField {...props} ref={ref} />;
});
TextFieldAtom.displayName = "TextFieldAtom";
