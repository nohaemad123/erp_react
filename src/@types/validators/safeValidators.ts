import { object, optional, string, pipe, nonEmpty, minValue } from "valibot";
import { invalidMsg, numberValidator } from ".";

export const safeValidationSchema = object({
  nameEn: optional(string(invalidMsg)),
  nameAr: pipe(string(invalidMsg), nonEmpty("Arabic safe name required")),
  balanceFirstDuration: pipe(numberValidator, minValue(0, "Balance first duration should not negative number")),
});
