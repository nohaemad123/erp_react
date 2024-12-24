import { invalidMsg } from "@/@types/validators";
import { object, string, email, pipe, nonEmpty } from "valibot";

export const loginValidationSchema = object({
  email: pipe(string(invalidMsg), nonEmpty("Email is required"), email("Invalid email")),
  password: pipe(string(invalidMsg), nonEmpty("password is required")),
});
