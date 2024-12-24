import { invalidMsg, numberValidator, requiredMsg } from "@/@types/validators";
import { object, optional, string, pipe, nonEmpty, array, minLength, date } from "valibot";

export const OutgoingStockValidationSchema = object({
  id: optional(string(invalidMsg)),
  code: optional(numberValidator),
  date: optional(date(invalidMsg)),
  storeId: pipe(string(invalidMsg), nonEmpty("This field is required")),
  outgoingStoreType: numberValidator,
  accountId: pipe(string(invalidMsg), nonEmpty("This field is required")),
  note: optional(string(invalidMsg)),
  details: pipe(
    array(
      object({
        productUnitId: pipe(string(requiredMsg), nonEmpty("This field is required")),
        qty: numberValidator,
        price: numberValidator,
        cost: numberValidator,
        productName: optional(string(invalidMsg)),
        productUnits: pipe(array(object({})), minLength(1, requiredMsg)),
      }),
    ),
    minLength(1, requiredMsg),
  ),
});
