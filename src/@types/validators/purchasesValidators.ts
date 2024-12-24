import { invalidMsg } from "@/@types/validators";
import { object, number, optional, string, date, array } from "valibot";

export const purchasesValidationSchema = object({
  page: number(),
  pageSize: number(),
  selectColumns: optional(array(string(invalidMsg))),
  sortColumn: optional(string(invalidMsg)),
  sortColumnDirection: optional(string(invalidMsg)),
  readDto: object({
    dateFrom: optional(date(invalidMsg)),
    dateTo: optional(date(invalidMsg)),
  }),
});
