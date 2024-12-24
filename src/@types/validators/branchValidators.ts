import { object, optional, string, pipe, nonEmpty, nullish, check } from "valibot";
import { invalidMsg, requiredMsg, numberValidator } from ".";

export const branchValidationSchema = object({
  nameEn: optional(string(invalidMsg)),
  nameAr: pipe(string(invalidMsg), nonEmpty("Arabic branch name is required")),
  code: nullish(numberValidator),
  mobile: pipe(
    string(requiredMsg),
    check((input) => input === "" || /^\d+$/.test(input), "phone must contain only numbers"),
    check((input) => input === "" || input.length >= 9, "Mobile number should not be less than 9 digits"),
    check((input) => input === "" || input.length <= 10, "Mobile number should not be bigger than 10 digits"),
  ),
  address: optional(string(invalidMsg)),
  invoiceFormat: optional(string(invalidMsg)),
  barcodeAddress: optional(string(invalidMsg)),
});
