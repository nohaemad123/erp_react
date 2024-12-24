import { invalidMsg } from "@/@types/validators";
import { object, string, email, pipe, nonEmpty, check } from "valibot";

export const registerValidationSchema = object({
  name: pipe(string(invalidMsg), nonEmpty("name is required")),
  email: pipe(string(invalidMsg), nonEmpty("Email is required"), email("Invalid email")),
  phone: pipe(
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
  phoneNumberCountryId: pipe(string(invalidMsg), nonEmpty("Phone number is required")),
  username: pipe(string(invalidMsg), nonEmpty("username is required")),
  password: pipe(string(invalidMsg), nonEmpty("password is required")),
  confirmPassword: pipe(string(invalidMsg), nonEmpty("confirm password is required")),
});
