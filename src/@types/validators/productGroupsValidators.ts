import { invalidMsg, requiredMsg } from "@/@types/validators";
import { object, optional, string, pipe, nonEmpty, nullish, boolean } from "valibot";

export const productGroupValidationSchema = object({
  name: pipe(string(invalidMsg), nonEmpty(requiredMsg)),
  parentId: nullish(string(invalidMsg)),
  isTransactionSuspended: optional(boolean(invalidMsg)),
});
