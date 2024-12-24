import { object, optional, string, pipe, nonEmpty, minValue, check } from "valibot";
import { invalidMsg, numberValidator } from ".";

export const taxValidationSchema = object({
  nameEn: optional(string(invalidMsg)),
  nameAr: pipe(string(invalidMsg), nonEmpty("Arabic branch name is required")),
  code: pipe(
    numberValidator,
    minValue(0, "tax code accept positive number only"),
    check((input) => input === undefined || /^\d+$/.test(input.toString()), "code must contain integer numbers"),
  ),
  rate: numberValidator,
});
