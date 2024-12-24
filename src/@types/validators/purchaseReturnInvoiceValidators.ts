import { invalidMsg, numberValidator, requiredMsg } from "@/@types/validators";
import { object, optional, string, pipe, nonEmpty, nullish, array, minLength, date } from "valibot";

export const purchaseReturnInvoiceValidationSchema = object({
  id: optional(string(invalidMsg)),
  code: optional(numberValidator),
  date: date(invalidMsg),
  storeId: pipe(string(invalidMsg), nonEmpty("This field is required")),
  vendorId: pipe(string(invalidMsg), nonEmpty("This field is required")),
  purchaseInvoiceHeadId: pipe(string(invalidMsg), nonEmpty("This field is required")),
  note: optional(string(invalidMsg)),
  invoiceType: numberValidator,
  discountType: nullish(numberValidator),
  discountValue: nullish(numberValidator),
  details: pipe(
    array(
      object({
        productUnitId: pipe(string(requiredMsg), nonEmpty("product unit is required")),
        qty: numberValidator,
        price: numberValidator,
        cost: numberValidator,
        productName: optional(string(invalidMsg)),
        taxDetails: optional(array(object({}))),
        productUnits: pipe(array(object({})), minLength(1, requiredMsg)),
      }),
    ),
    minLength(1, requiredMsg),
  ),
});
