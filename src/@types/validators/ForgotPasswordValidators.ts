import { invalidMsg } from "@/@types/validators";
import { object, string, email, pipe, nonEmpty } from "valibot";

export const forgotPasswordValidationSchema = object({
  name: pipe(string(invalidMsg), nonEmpty("name is required")),
  username: pipe(string(invalidMsg), nonEmpty("username is required")), //
  email: pipe(string(invalidMsg), nonEmpty("Email is required"), email("Invalid email")),
  phone: pipe(
    string(invalidMsg),
    nonEmpty("Phone number is required"),
    // check((val) => new RegExp(/^[0-9]*$/, "gi").test(val), "Invalid phone number"),
    // length(11, "Phone number must be 11 digits long"),
  ),
  phoneNumberCountryId: pipe(string(invalidMsg), nonEmpty("Phone number is required")),
  password: pipe(string(invalidMsg), nonEmpty("password is required")),
  confirmPassword: pipe(string(invalidMsg), nonEmpty("confirm password is required")),
});
