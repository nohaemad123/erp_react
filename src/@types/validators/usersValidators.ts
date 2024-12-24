import { array, boolean, check, forward, minLength, nonEmpty, nullish, object, optional, pipe, string } from "valibot";
import { emailValidator, invalidMsg, requiredMsg } from ".";

const sharedUserValidationSchema = {
  name: pipe(string(invalidMsg), nonEmpty(requiredMsg)),
  phoneNumber: pipe(
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
  phoneNumberCountryId: nullish(string(invalidMsg)),
  address: optional(string(invalidMsg)),
  nationalityId: pipe(string(invalidMsg), nonEmpty(requiredMsg)),
  email: emailValidator,
  roles: pipe(array(pipe(string(invalidMsg), nonEmpty(requiredMsg))), minLength(1, requiredMsg)),
  defaultLanguage: pipe(string(invalidMsg), nonEmpty(requiredMsg)),
  branchUser: pipe(array(pipe(string(invalidMsg), nonEmpty(requiredMsg))), minLength(1, requiredMsg)),
  storeUser: pipe(array(pipe(string(invalidMsg), nonEmpty(requiredMsg))), minLength(1, requiredMsg)),
  sendDataToMail: boolean(invalidMsg),
};

export const usersAddValidationSchema = pipe(
  object({
    ...sharedUserValidationSchema,
    password: pipe(string(invalidMsg), nonEmpty(requiredMsg)),
    confirmPassword: pipe(string(invalidMsg), nonEmpty(requiredMsg)),
  }),
  forward(
    check((input) => input.password === input.confirmPassword, "passwords do not match"),
    ["confirmPassword"],
  ),
);

export const usersEditValidationSchema = object({
  ...sharedUserValidationSchema,
});
