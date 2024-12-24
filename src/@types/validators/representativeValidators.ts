import { invalidMsg, nullishNumberValidator, requiredMsg } from "@/@types/validators";
import { object, string, pipe, nonEmpty, optional, number, boolean, array, nullish, check } from "valibot";

export const representativeValidatorsSchema = object({
  name: pipe(string(invalidMsg), nonEmpty(requiredMsg)),
  code: nullish(number(invalidMsg)),
  countryMobileId: nullish(string(invalidMsg)),
  regonIds: optional(
    array(
      optional(
        object({
          id: optional(string(invalidMsg)),
          regionId: optional(string(invalidMsg)),
          salesManId: optional(string(invalidMsg)),
        }),
      ),
    ),
  ),
  telephone: pipe(
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
  mobile: pipe(
    string(invalidMsg),
    check((input) => {
      const strippedMobile = input.replace(/[\s+]/g, ""); // Remove spaces and "+" for length validation
      return strippedMobile.length >= 11 && strippedMobile.length <= 13;
    }, "Mobile number must be between 9 and 10 digits"),
    check(
      (input) => /^[+\d\s]+$/.test(input), // Validates that the input contains only digits, spaces, or the "+" symbol
      "Mobile number must contain only numbers",
    ),
  ),
  address: nullish(string(invalidMsg)),
  commissionTypeId: nullishNumberValidator,
  commissionRate: nullishNumberValidator,
  collectionCommission: nullishNumberValidator,
  isTransactionSuspended: nullish(boolean(invalidMsg)),
});
