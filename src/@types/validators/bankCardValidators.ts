import { object, optional, string, pipe, nonEmpty, check, boolean } from "valibot";
import { invalidMsg, optionalNumberValidator } from ".";

export const bankCardValidationSchema = object({
  nameEn: optional(string(invalidMsg)),
  nameAr: pipe(string(invalidMsg), nonEmpty("Arabic bank card name is required")),
  bankId: pipe(string(invalidMsg), nonEmpty("bank name is required")),
  discountPercentage: pipe(
    optionalNumberValidator,
    check(
      (input) => input === undefined || /^[0-9]+(\.[0-9]+)?$/.test(input.toString()),
      "discount percentage must contain only numbers",
    ),
  ),
  isDefault: optional(boolean(invalidMsg)),
});
