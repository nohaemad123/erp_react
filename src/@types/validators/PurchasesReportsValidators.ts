import { array, date, number, object, optional, string } from "valibot";
import { invalidMsg } from ".";

export const PurchasesReportsValidationSchema = object({
  dateFrom: optional(date(invalidMsg)),
  dateTo: optional(date(invalidMsg)),
  userIds: optional(array(string(invalidMsg))),
  vendorIds: optional(array(string(invalidMsg))),
  itemIds: optional(array(string(invalidMsg))),
  itemGroups: optional(array(string(invalidMsg))),
  storeIds: optional(array(string(invalidMsg))),
  invoiceDealType: optional(number(invalidMsg)),
});
