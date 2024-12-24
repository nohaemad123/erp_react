import { object, string, pipe, nonEmpty, date, nullish } from "valibot";
import { invalidMsg, numberValidator, requiredMsg } from ".";

export const paymentValidationSchema = object({
  fromAccountId: pipe(string(invalidMsg), nonEmpty("Safe name is required")),
  toAccountId: pipe(string(invalidMsg), nonEmpty("Account name is required")),
  date: date(requiredMsg),
  amount: numberValidator,
  note: nullish(string(invalidMsg)),
});
