import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { forwardRef } from "react";
import dayjs from "dayjs";

type IDatePickerAtomProps = DatePickerProps<any>;

export const DatePickerInputFieldAtom = forwardRef<HTMLDivElement, IDatePickerAtomProps>(({ value, ...props }, _ref) => {
  const dayjsValue = value ? dayjs(value) : null; // Ensure it's dayjs or null

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker {...props} value={dayjsValue} />
    </LocalizationProvider>
  );
});

DatePickerInputFieldAtom.displayName = "DatePickerAtom";
