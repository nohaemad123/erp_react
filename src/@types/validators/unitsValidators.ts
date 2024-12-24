import { invalidMsg, numberValidator, requiredMsg } from "@/@types/validators";
import { object, string, pipe, nonEmpty, optional } from "valibot";

export const unitsValidationSchema = object({
  nameEn: optional(string(invalidMsg)),
  nameAr: pipe(string(invalidMsg), nonEmpty(requiredMsg)),
  factor: numberValidator,
});
