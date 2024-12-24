import { object, optional, string, pipe, nonEmpty, nullish, check } from "valibot";
import { invalidMsg, numberValidator, optionalEmailValidator, requiredMsg } from ".";

export const storeValidationSchema = object({
  nameEn: optional(string(invalidMsg)),
  nameAr: pipe(string(invalidMsg), nonEmpty("Arabic store name required")),
  countryMobileId: nullish(string(invalidMsg)),
  storeKeeperId: pipe(string(requiredMsg), nonEmpty("store keeper required")),
  code: nullish(numberValidator),
  mobile: pipe(
    string(invalidMsg),
    check((input) => {
      const strippedInput = input.replace(/[\s+]/g, ""); // Remove spaces and "+" for length validation
      return strippedInput.length >= 12 && strippedInput.length <= 13;
    }, "Mobile number must be between 9 and 10 digits"),
    check(
      (input) => /^[+\d\s]+$/.test(input), // Validates that the input contains only digits, spaces, or the "+" symbol
      "Mobile number must contain only numbers",
    ),
  ),
  telephone: pipe(
    string(requiredMsg),
    check((input) => input === "" || /^\d+$/.test(input), "phone must contain only numbers"),
    check((input) => input === "" || input.length >= 9, "Mobile number should not be less than 9 digits"),
    check((input) => input === "" || input.length <= 10, "Mobile number should not be bigger than 10 digits"),
  ),
  email: optional(optionalEmailValidator),
  balanceFirstDuration: optional(numberValidator),
  balance: optional(numberValidator),
  address: optional(string(invalidMsg)),
  notes: optional(string(invalidMsg)),
});
