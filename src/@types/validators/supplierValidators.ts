import { object, optional, string, pipe, nonEmpty, nullish, boolean, check, minValue } from "valibot";
import { invalidMsg, numberValidator, optionalNumberValidator, requiredMsg } from ".";

export const supplierValidationSchema = object({
  id: optional(string(invalidMsg)),
  nameEn: optional(string(invalidMsg)),
  nameAr: pipe(string(invalidMsg), nonEmpty(requiredMsg)),
  code: nullish(numberValidator),
  mobile: pipe(
    string(invalidMsg),
    check((input) => {
      const strippedInput = input.replace(/[\s+]/g, ""); // Remove spaces and "+" for length validation
      return strippedInput.length >= 11 && strippedInput.length <= 13;
    }, "Mobile number must be between 9 and 10 digits"),
    check(
      (input) => /^[+\d\s]+$/.test(input), // Validates that the input contains only digits, spaces, or the "+" symbol
      "Mobile number must contain only numbers",
    ),
  ),
  mobileCountryId: nullish(string(invalidMsg)),
  balanceFirstDuration: optional(numberValidator),
  address: optional(string(invalidMsg)),
  telephone: pipe(
    string(requiredMsg),
    check((input) => input === "" || /^\d+$/.test(input), "phone must contain only numbers"),
    check((input) => input === "" || input.length >= 9, "Mobile number should not be less than 9 digits"),
    check((input) => input === "" || input.length <= 10, "Mobile number should not be bigger than 10 digits"),
  ),
  countryId: nullish(string(invalidMsg)),
  street: optional(string(invalidMsg)),
  postalCode: optional(string(invalidMsg)),
  neighborhoodNumber: optional(string(invalidMsg)),
  buildingNumber: optional(string(invalidMsg)),
  vendorGroupId: pipe(string(invalidMsg), nonEmpty(requiredMsg)),
  city: optional(string(invalidMsg)),
  regionId: nullish(string(invalidMsg)),
  taxNumber: pipe(
    numberValidator,
    minValue(0, "tax Number accept positive number only"),
    check((input) => input === undefined || /^\d+$/.test(input.toString()), "tax Number must contain integer numbers"),
  ),
  tradeLicense: optional(string(invalidMsg)),
  dealingDiscount: pipe(
    optionalNumberValidator,
    check((x: any) => /^\d+(.\d+)?$/.test(x) && parseInt(x) >= 0, "Must be a positive number or positive float"),
  ),
  debitLimit: pipe(
    optionalNumberValidator,
    check((input) => input === undefined || /^\d+$/.test(input.toString()), "Credit limit must contain only numbers"),
  ),
  vendorPriceId: optional(numberValidator),
  otherIdentifier: pipe(
    numberValidator,
    minValue(0, "other Identifier accept positive number only"),
    check((input) => input === undefined || /^\d+$/.test(input.toString()), "other Identifier must contain integer numbers"),
  ),
  paymentMethodId: nullish(numberValidator),
  isTransactionSuspended: optional(boolean(invalidMsg)),
  notes: optional(string(invalidMsg)),
  balance: nullish(numberValidator),
});
