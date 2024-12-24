import { invalidMsg } from "@/@types/validators";
import { object, optional, string } from "valibot";

export interface IUnitsSearchDto {
  search: string;
}

export class UnitsSearchDto implements Partial<IUnitsSearchDto> {
  search: string;
  constructor(search = "") {
    this.search = search;
  }
}

export const unitsValidationSchema = object({
  search: optional(string(invalidMsg)),
});
