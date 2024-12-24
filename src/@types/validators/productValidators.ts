import { invalidMsg, nullishNumberValidator, numberValidator, optionalNumberValidator, requiredMsg } from "@/@types/validators";
import { object, optional, string, pipe, nonEmpty, nullish, boolean, array, minLength, check } from "valibot";

export const productValidationSchema = object({
  id: optional(string(invalidMsg)),
  nameEn: optional(string(invalidMsg)),
  nameAr: pipe(string(invalidMsg), nonEmpty(requiredMsg)),
  modelNumber: nullish(string(invalidMsg)),
  code: pipe(
    nullishNumberValidator,
    check((x: any) => /^\d+(.\d+)?$/.test(x) && parseInt(x) >= 0, "Must be a positive number or positive float"),
  ),
  productGroupId: pipe(string(invalidMsg), nonEmpty(requiredMsg)),
  reorderLimit: pipe(
    nullishNumberValidator,
    check((x: any) => /^\d+(.\d+)?$/.test(x) && parseInt(x) >= 0, "Must be a positive number or positive float"),
  ),
  maxLimit: pipe(
    nullishNumberValidator,
    check((x: any) => /^\d+(.\d+)?$/.test(x) && parseInt(x) >= 0, "Must be a positive number or positive float"),
  ),
  minLimit: pipe(
    nullishNumberValidator,
    check((x: any) => /^\d+(.\d+)?$/.test(x) && parseInt(x) >= 0, "Must be a positive number or positive float"),
  ),
  commission: pipe(
    nullishNumberValidator,
    check((x: any) => /^\d+(.\d+)?$/.test(x) && parseInt(x) >= 0, "Must be a positive number or positive float"),
  ),
  discount: pipe(
    nullishNumberValidator,
    check((x: any) => /^\d+(.\d+)?$/.test(x) && parseInt(x) >= 0, "Must be a positive number or positive float"),
  ),
  maxDiscount: pipe(
    nullishNumberValidator,
    check((x: any) => /^\d+(.\d+)?$/.test(x) && parseInt(x) >= 0, "Must be a positive number or positive float"),
  ),
  taxRatio: nullish(numberValidator),
  customerPoints: pipe(
    nullishNumberValidator,
    check((x: any) => /^\d+(.\d+)?$/.test(x) && parseInt(x) >= 0, "Must be a positive number or positive float"),
  ),
  isNonReturnable: nullish(boolean(invalidMsg)),
  isCashOnly: nullish(boolean(invalidMsg)),
  isTransactionSuspended: nullish(boolean(invalidMsg)),
  vendorId: pipe(string(requiredMsg), nonEmpty(requiredMsg)),
  productTaxType: nullish(array(object({ taxTypeId: pipe(string(requiredMsg), nonEmpty(requiredMsg)) }))),
  productUnits: pipe(
    array(
      object({
        barcode: string(requiredMsg),
        unitItemTypeId: pipe(string(requiredMsg), nonEmpty(requiredMsg)),
        salePrice: nullish(numberValidator),
        purchasPrice: optionalNumberValidator,
        priceRate: nullish(numberValidator),
        lowestSellingPrice: nullish(numberValidator),
        wholesalePrice: nullish(numberValidator),
        customerPrice: nullish(numberValidator),
      }),
    ),
    minLength(1, requiredMsg),
  ),
});
