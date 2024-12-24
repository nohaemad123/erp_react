import { object, optional, string, pipe, nonEmpty, nullish, check } from "valibot";
import { invalidMsg, numberValidator, optionalEmailValidator, optionalNumberValidator } from "../validators";

export const bankValidationSchema = object({
  nameEn: optional(string(invalidMsg)),
  nameAr: pipe(string(invalidMsg), nonEmpty("Arabic bank name is required")),
  countryMobileId: nullish(string(invalidMsg)),
  code: nullish(numberValidator),
  // mobile: nullishPhoneValidator,
  // mobile: pipe(
  //   string(invalidMsg),
  //   check((input) => /^\d+$/.test(input), "phone must contain only numbers"),
  //   minLength(9, "Mobile number should not be less than 9 digits"),
  //   maxLength(10, "Mobile number should not be bigger than 10 digits"),
  // ),
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
  email: optional(optionalEmailValidator),
  balanceFirstDuration: pipe(
    optionalNumberValidator,
    check((x: any) => /^\d+(\.\d+)?$/.test(x) && parseInt(x) >= 0, "Must be a positive number or positive float"),
  ),
  balance: optional(numberValidator),
  address: optional(string(invalidMsg)),
  notes: optional(string(invalidMsg)),
});
