import { invalidMsg } from "@/@types/validators";
import { object, optional, string, pipe, nonEmpty } from "valibot";

export const expenseValidationSchema = object({
  nameEn: optional(string(invalidMsg)),
  nameAr: pipe(string(invalidMsg), nonEmpty("Arabic expense name required")),
});
