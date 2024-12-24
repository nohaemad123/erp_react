"use client";

import { ResultHandler } from "@/@types/classes/ResultHandler";
import { PurchaseInvoiceDetailsRow, PurchaseInvoiceDto } from "@/@types/dto/PurchaseInvoiceDto";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import { ICommissionType } from "@/@types/interfaces/ICommissionType";
import { ISupplier } from "@/@types/interfaces/ISupplier";
import fetchClient from "@/lib/fetchClient";
import {
  GetAllInvoiceTypes,
  getAllProducts,
  GetAllStores,
  getAllSuppliers,
  getAllTaxType,
  getDiscountType,
  getNewPurchaseInvoiceCode,
  getPurchaseInvoiceById,
} from "@/services/loadData";
import { useAppStore } from "@/store";
import { ButtonBase } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FiTrash2 } from "react-icons/fi";
import dayjs from "dayjs";
import { IStore } from "@/@types/interfaces/IStore";
import { IProduct, IProductUnit } from "@/@types/interfaces/IProduct";
import { ITax } from "@/@types/interfaces/ITax";
import { handlePastePositiveInput, preventNegativeInput } from "@/@types/stables";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { purchaseInvoiceValidationSchema } from "@/@types/validators/purchaseInvoiceValidators";
import LabelAtom from "@/components/atom/LabelAtom";
import { TextFieldAtom } from "@/components/atom/TextFieldAtom";
import TableAtom from "@/components/atom/TableAtom";
import { ErrorInputAtom } from "@/components/atom/ErrorInputAtom";
import ModalSavedAtom from "@/components/atom/ModalSavedAtom";
import { SaveButtonAtom } from "@/components/atom/SaveButtonAtom";
import { CreateButtonAtom } from "@/components/atom/CreateButtonAtom";
import { AddNewRowButton } from "@/components/atom/AddNewRowButton";
import { useRouter } from "next/navigation";
import { MainCardTitleAtom } from "@/components/atom/MainCardTitleAtom";
import DropdownBoxAtom from "@/components/atom/DropdownBoxAtom";
import SupplierFormTemplate from "@/components/template/suppliers/SupplierFormTemplate";
import StoreFormTemplate from "@/components/template/stores/StoreFormTemplate";
import ProductFormTemplate from "@/components/template/products/ProductFormTemplate";
import { DatePickerInputFieldAtom } from "@/components/atom/DatePickerInputAtom";

interface IPurchaseInvoiceFormTemplateProps {
  tenantId: string;
  invoiceId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function PurchaseInvoiceFormTemplate({
  tenantId,
  invoiceId,
  isEdit,
  isView,
}: Readonly<IPurchaseInvoiceFormTemplateProps>) {
  const [isModalSavedOpen, setIsModalSavedOpen] = useState<boolean>(false);
  const { t, i18n } = useTranslation();
  const { isHttpClientLoading } = useAppStore();
  const { push } = useRouter();
  const { branch } = useAppStore();
  const {
    register,
    handleSubmit,
    control,
    getValues,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<PurchaseInvoiceDto>({
    defaultValues: {
      ...new PurchaseInvoiceDto(),
      details: [new PurchaseInvoiceDetailsRow()],
    },
    resolver: valibotResolver(purchaseInvoiceValidationSchema),
  });
  const [suppliersList, setSuppliersList] = useState<ISupplier[]>([]);
  const [invoiceTypes, setInvoiceTypes] = useState<ICommissionType[]>([]);
  const [stores, setStore] = useState<IStore[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [totalQty, setTotalQty] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [finalTotalPrice, setFinalTotalPrice] = useState<number>(0);
  const [totalTax, setTotalTax] = useState<number>(0);
  const [taxes, setTaxes] = useState<ITax[]>([]);
  const [discountType, setDiscountType] = useState<ICommissionType[]>([]);

  useEffect(() => {
    getAllSuppliers(i18n.language, tenantId)
      .then((res) => {
        setSuppliersList(res?.listData ?? []);
      })
      .catch(console.log);
    GetAllInvoiceTypes(i18n.language, tenantId)
      .then((res) => {
        setInvoiceTypes(res ?? []);
      })
      .catch(console.log);
    GetAllStores(i18n.language, tenantId)
      .then((res) => {
        setStore(res?.listData ?? []);
      })
      .catch(console.log);
    getAllProducts(i18n.language, tenantId)
      .then((res) => {
        setProducts(res?.listData ?? []);
      })
      .catch(console.log);
    getAllTaxType(i18n.language, tenantId)
      .then((res) => {
        setTaxes(res?.listData ?? []);
      })
      .catch(console.log);
    getDiscountType(i18n.language, tenantId)
      .then((res) => {
        setDiscountType(res ?? []);
      })
      .catch(console.log);

    fetchNewCode();
  }, [tenantId]);

  useEffect(() => {
    if (invoiceId && typeof invoiceId === "string") {
      getPurchaseInvoiceById(i18n.language, tenantId, invoiceId)
        .then((res) => {
          if (res) {
            const data = new PurchaseInvoiceDto({
              ...res,
              date: res.date ? dayjs(new Date(res.date)).toDate() : new Date(),
              details: res.details.map((detailItem: PurchaseInvoiceDetailsRow) => {
                return {
                  ...detailItem,
                  taxValue: detailItem.totalTax || 0,
                  taxDetails: detailItem?.taxDetails.map((taxDetail: any) => {
                    return {
                      ...taxDetail,
                      taxName: taxDetail.taxType,
                    };
                  }),
                  taxId: detailItem.taxDetails[0]?.taxTypeId,
                };
              }),
            });
            reset(data);
          }
        })
        .catch(console.log);
    }
  }, [invoiceId]);

  async function handleSubmitForm() {
    const invoiceData: PurchaseInvoiceDto = getValues();

    const INVOICE_DATA = {
      supplierInvoiceNumber: invoiceData.supplierInvoiceNumber,
      purchaseOrderNumber: invoiceData.purchaseOrderNumber,
      branchId: branch?.id ?? "",
      vendorId: invoiceData.vendorId,
      code: invoiceData.code,
      date: new Date(invoiceData.date).toISOString(),
      note: invoiceData.note,
      storeId: invoiceData.storeId,
      invoiceType: invoiceData.invoiceType,
      discountType: invoiceData.discountType,
      discountValue: +invoiceData.discountValue,
      details: invoiceData.details?.map((detailItem: PurchaseInvoiceDetailsRow, index: number) => {
        const productUnits: any = getValues("details")[index]["productUnits"];

        return {
          productUnitId: detailItem.productUnitId,
          qty: detailItem.qty,
          price: detailItem.cost,
          cost: +(detailItem.cost + detailItem.taxValue).toFixed(2),
          productId: detailItem.productId,
          barcode: detailItem.barcode,
          productName: detailItem.productUnits[0]?.product?.name,
          productUnits: productUnits?.map((unitData: any) => {
            return {
              id: unitData.id,
              barcode: unitData.barcode,
              unitName: unitData.unitName,
              productId: unitData.productId,
              unitItemTypeId: unitData.unitItemTypeId,
              salePrice: unitData.salePrice,
              purchasPrice: unitData.purchasPrice,
              priceRate: unitData.priceRate,
              isDefault: unitData.isDefault,
              lowestSellingPrice: unitData.lowestSellingPrice,
              wholesalePrice: unitData.wholesalePrice,
              customerPrice: unitData.customerPrice,
            };
          }),
          taxDetails: detailItem.taxDetails,
        };
      }),
    };
    if (isView) return;
    if (isEdit) {
      await handleUpdate(INVOICE_DATA);
    } else {
      await handleCreate(INVOICE_DATA);
    }
  }

  async function handleCreate(invoiceData: any) {
    try {
      const response = await fetchClient<ResultHandler<PurchaseInvoiceDto>>(EndPointsEnums.PURCHASE_INVOICE, {
        method: "POST",
        body: invoiceData,
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
      });

      if (response.status) {
        setIsModalSavedOpen(true);
        handleClearForm();
        push("/" + tenantId + "/purchase-invoice");
        return;
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  async function handleUpdate(invoiceData: any) {
    try {
      const response = await fetchClient<ResultHandler<PurchaseInvoiceDto>>(EndPointsEnums.PURCHASE_INVOICE, {
        method: "PUT",
        body: invoiceData,
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
        params: {
          id: invoiceId,
        },
      });

      if (response.status) {
        setIsModalSavedOpen(true);
        push("/" + tenantId + "/purchase-invoice");
        return;
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  function handleClearForm() {
    reset(new PurchaseInvoiceDto());
  }

  function handleAddRow() {
    const details: any = getValues("details");
    details.push(new PurchaseInvoiceDetailsRow());
    setValue("details", details);
  }

  function handleDeleteRow(rowId: string) {
    const details = getValues("details").filter((x) => x.rowId !== rowId);
    setValue("details", details);
  }

  async function fetchNewCode() {
    if (!tenantId) return;
    const code = await getNewPurchaseInvoiceCode(i18n.language, tenantId);
    if (code !== undefined) setValue("code", code);
  }

  const calculateTotalQty = useCallback(() => {
    const totalRows = getValues("details");
    return totalRows.reduce((total, row) => total + row.qty, 0);
  }, [getValues]);

  const calculateTotalPrice = useCallback(() => {
    const totalRows = getValues("details");
    return totalRows.reduce((total, row) => total + row.qty * row.cost, 0);
  }, [getValues]);

  const calculateTotalTax = useCallback(() => {
    const totalRows = getValues("details");
    return totalRows.reduce((total, row) => total + (row.taxValue || 0), 0) || 0;
  }, [getValues]);

  const calculateFinalTotalPrice = useCallback(() => {
    const price = calculateTotalPrice();
    const tax = calculateTotalTax();

    const discountTypeKey = getValues("discountType");
    const discountValue = getValues("discountValue");

    let discount = 0;
    const discountTypeVal = discountType.find((c) => c.key === discountTypeKey)?.value;
    if (discountTypeVal === "%") {
      discount = price * (discountValue / 100);
    } else if (discountTypeVal === "$") {
      discount = discountValue;
    }
    return price + +tax - +discount;
  }, [getValues, calculateTotalPrice, calculateTotalTax, getValues("discountValue")]);

  // Set the final values when 'details' or discount-related fields change
  useEffect(() => {
    setTotalQty(calculateTotalQty());
    setTotalPrice(calculateTotalPrice());
    setTotalTax(calculateTotalTax());
    setFinalTotalPrice(calculateFinalTotalPrice());
  }, [
    watch("details"),
    watch("discountType"),
    watch("discountValue"),
    calculateTotalQty,
    calculateTotalPrice,
    calculateTotalTax,
    calculateFinalTotalPrice,
  ]);

  const handleUnitChange = (row: PurchaseInvoiceDetailsRow, unitId: string) => {
    const selectedUnit = [row.productUnits.find((x: IProductUnit) => x.id === unitId)];
    const cost = selectedUnit[0]?.purchasPrice * row.qty;
    let taxValue = 0;
    if (row.taxDetails?.length) {
      taxValue = cost * ((row.taxDetails[0]?.taxRate || 0) / 100);
    }
    setValue(
      "details",
      getValues("details").map((x) =>
        x.rowId === row.rowId
          ? {
              ...x,
              barcode: selectedUnit[0]?.barcode,
              productUnits: selectedUnit,
              productUnitId: unitId,
              qty: 1,
              cost,
              price: selectedUnit[0]?.purchasPrice,
              taxValue,
            }
          : x,
      ),
    );
  };

  const handleQtyChange = (row: PurchaseInvoiceDetailsRow, qty: number) => {
    let cost = row.cost;
    let taxValue = row.taxValue;

    if (row.productUnits?.length) {
      cost = qty * (row.productUnits[0]?.purchasPrice || 0);
    }
    if (row.taxDetails?.length) {
      taxValue = cost * ((row.taxDetails[0]?.taxRate || 0) / 100);
    }

    setValue(
      "details",
      getValues("details").map((x) => (x.rowId === row.rowId ? { ...x, qty, cost, taxValue } : x)),
    );
  };

  const handleTaxChange = (row: PurchaseInvoiceDetailsRow, taxId: string) => {
    const selectedTax: any = taxes.find((tax) => tax.id === taxId) || {};
    delete selectedTax?.names;

    const taxValue = row.cost * ((selectedTax?.taxRate || 0) / 100);
    setValue(
      "details",
      getValues("details").map((x: any) =>
        x.rowId === row.rowId ? { ...x, taxDetails: [selectedTax], taxValue: taxValue.toFixed(2), taxId } : x,
      ),
    );
  };

  const handleProductChange = (row: PurchaseInvoiceDetailsRow, productId: string) => {
    const selectedProduct: any = products.find((x) => x.id === productId);

    setValue(
      "details",
      getValues("details").map((x) =>
        x.rowId === row.rowId
          ? {
              ...x,
              product: selectedProduct,
              productId: selectedProduct?.id,
              productUnitId: selectedProduct?.productUnits[0]?.id,
              productUnits: selectedProduct?.productUnits?.filter((x: IProductUnit) => x.isDefault)?.length
                ? selectedProduct?.productUnits?.filter((x: IProductUnit) => x.isDefault)
                : [selectedProduct?.productUnits[0]],
              barcode: selectedProduct?.productUnits[0]?.barcode,
              cost: selectedProduct?.productUnits[0]?.purchasPrice * row.qty,
              price: selectedProduct?.productUnits[0]?.purchasPrice,
              taxDetails: selectedProduct?.productTaxType,
              taxId: selectedProduct?.productTaxType[0]?.taxTypeId,
              taxValue: selectedProduct?.productUnits[0]?.purchasPrice * (selectedProduct?.productTaxType[0]?.taxRate / 100) || 0,
            }
          : x,
      ),
    );
  };

  function clearFirstRow() {
    const newDetails = getValues("details").map((row, index) => {
      if (index === 0) {
        return {
          ...row,
          productId: "",
          productUnitId: "",
          barcode: "",
          qty: 0,
          cost: 0,
          price: 0,
          taxDetails: [],
          taxId: "",
          taxValue: 0,
          productUnits: [],
        };
      }
      return row;
    });
    setValue("details", newDetails);
  }

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)}>
      <ModalSavedAtom isOpen={isModalSavedOpen} setIsOpen={setIsModalSavedOpen} />

      <div className="w-full p-8 form_container">
        {/* buttons */}
        <div className="flex items-center justify-between">
          <div className="table_title_div px-8 pt-3 border-[#e6e7ec] bg-white border-t-2 border-l-2 border-r-2 rounded-ss-md rounded-se-md">
            <MainCardTitleAtom title="Purchase invoice details" />
          </div>
          {!isView && (
            <div className="flex gap-3 mb-2 btns-wrapper">
              {!isEdit && <CreateButtonAtom onClick={handleClearForm} />}
              <SaveButtonAtom />
              {/* {isEdit && <DeleteButtonAtom onClick={handleDelete} />} */}
            </div>
          )}
        </div>

        {/* controls */}
        <div className="w-full p-10 bg-white border-b-2 table_container border-l-2 border-r-2 space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            <div>
              <LabelAtom labelMessage="Invoice number" />
              <TextFieldAtom
                disabled={isView || isHttpClientLoading}
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
                placeholder={t("Receipt number")}
                {...register("code")}
                className="w-full h-12 px-5 py-1 mt-2 text-lg border-2 rounded-lg"
              />
              {errors.code?.message && <ErrorInputAtom errorMessage={errors.code.message} />}
            </div>
            <div>
              <LabelAtom labelMessage="Vendor invoice number" required />
              <TextFieldAtom
                disabled={isView || isHttpClientLoading}
                placeholder={t("Vendor invoice number")}
                {...register("supplierInvoiceNumber")}
                className="w-full h-12 px-5 py-1 mt-2 text-lg border-2 rounded-lg"
              />
              {errors.supplierInvoiceNumber?.message && <ErrorInputAtom errorMessage={errors.supplierInvoiceNumber.message} />}
            </div>

            {/* dateTo */}
            <div>
              <LabelAtom labelMessage="Document date" />
              <Controller
                control={control}
                name="date"
                render={({ field: { value, onChange } }) => (
                  <DatePickerInputFieldAtom
                    disabled={isView || isHttpClientLoading}
                    value={dayjs(value)}
                    className="w-full"
                    onChange={(newValue) => onChange(newValue?.toDate() ?? null)}
                  />
                )}
              />
              {errors.date?.message && <ErrorInputAtom errorMessage={errors.date.message} />}
            </div>
            <div>
              <LabelAtom labelMessage="Purchase order number" />
              <TextFieldAtom
                disabled={isView || isHttpClientLoading}
                placeholder={t("Purchase order number")}
                {...register("purchaseOrderNumber")}
                className="w-full h-12 px-5 py-1 mt-2 text-lg border-2 rounded-lg"
              />
              {errors.purchaseOrderNumber?.message && <ErrorInputAtom errorMessage={errors.purchaseOrderNumber.message} />}
            </div>
            {/* invoice type */}
            <div>
              <LabelAtom labelMessage="Invoice type" required />
              <DropdownBoxAtom
                options={invoiceTypes}
                fullWidth
                value={watch("invoiceType")}
                placeholder={t("invoice type")}
                optionRender={(item) => item.value}
                valueSelector={(item) => item.key}
                triggerLabelDisplay={(value) => value?.value ?? ""}
                onSelect={(item) => {
                  setValue("invoiceType", item.key);
                }}
              />
              {errors.invoiceType?.message && <ErrorInputAtom errorMessage={errors.invoiceType.message} />}
            </div>
            {/* supplier */}
            <div>
              <LabelAtom labelMessage="Supplier" required />
              <DropdownBoxAtom
                options={suppliersList}
                fullWidth
                value={watch("vendorId")}
                placeholder={t("Supplier")}
                filter={["name"]}
                optionRender={(item) => item.name}
                valueSelector={(item) => (item?.id ? item?.id : "")}
                modalChildren={<SupplierFormTemplate tenantId={tenantId} />}
                triggerLabelDisplay={(value) => value?.name ?? ""}
                onSelect={(item) => {
                  setValue("vendorId", item?.id ? item.id : "");
                }}
              />
              {errors.vendorId?.message && <ErrorInputAtom errorMessage={errors.vendorId.message} />}
            </div>
            {/* stores */}
            <div>
              <LabelAtom labelMessage="store name" required />
              <DropdownBoxAtom
                options={stores}
                fullWidth
                value={watch("storeId")}
                placeholder={t("Store name")}
                filter={["name", "names"]}
                optionRender={(item) => item.name}
                valueSelector={(item) => (item?.id ? item?.id : "")}
                modalChildren={<StoreFormTemplate tenantId={tenantId} />}
                triggerLabelDisplay={(value) => value?.name ?? ""}
                onSelect={(item) => {
                  setValue("storeId", item?.id ? item.id : "");
                }}
              />
              {errors.storeId?.message && <ErrorInputAtom errorMessage={errors.storeId.message} />}
            </div>
            {/* notes */}
            <div className="col-span-2">
              <LabelAtom labelMessage="Notes" className="text-lg leading-normal whitespace-nowrap text-ellipsis" />
              <TextFieldAtom
                placeholder={t("Notes")}
                disabled={isView || isHttpClientLoading}
                multiline
                rows={1}
                {...register("note")}
                className="w-full px-5 py-1 mt-2 text-lg border-2 rounded-lg"
                variant="outlined"
                fullWidth
              />
              {errors.note?.message && <ErrorInputAtom errorMessage={errors.note?.message} />}
            </div>
          </div>
        </div>
      </div>

      {/* table */}
      <div className="w-full p-8 pt-0 form_container">
        <div className="w-full p-4 bg-white border-b-2 table_container border-l-2 border-r-2 mb-3">
          <TableAtom aria-label="product prices table" variant={"dynamic"}>
            <TableAtom.THead>
              <TableAtom.TRow>
                <TableAtom.TCell component="th" align="center">
                  #
                </TableAtom.TCell>
                <TableAtom.TCell component="th" className="min-w-[100px]">
                  {t("Barcode")}
                </TableAtom.TCell>
                <TableAtom.TCell component="th" className="min-w-[120px]">
                  {t("Product name")} *
                </TableAtom.TCell>
                <TableAtom.TCell component="th" className="min-w-[120px]">
                  {t("Unit")}
                </TableAtom.TCell>
                <TableAtom.TCell component="th" className="min-w-[120px]">
                  {t("Taxes")}
                </TableAtom.TCell>
                <TableAtom.TCell component="th" className="min-w-[100px]">
                  {t("Quantity")}
                </TableAtom.TCell>
                <TableAtom.TCell component="th" className="min-w-[100px]">
                  {t("Purchase price")}
                </TableAtom.TCell>
                <TableAtom.TCell component="th" className="min-w-[100px]">
                  {t("Total")}
                </TableAtom.TCell>
                <TableAtom.TCell component="th" className="min-w-[100px]">
                  {t("Total taxes")}
                </TableAtom.TCell>
                <TableAtom.TCell component="th"></TableAtom.TCell>
              </TableAtom.TRow>
            </TableAtom.THead>
            <TableAtom.TBody>
              {watch("details")?.map((row, index) => (
                <TableAtom.TRow key={row.rowId}>
                  <TableAtom.TCell align="center" scope="row">
                    {index + 1}
                  </TableAtom.TCell>
                  <TableAtom.TCell>
                    <TextFieldAtom
                      size="small"
                      value={row.barcode}
                      slotProps={{
                        input: {
                          readOnly: true,
                        },
                      }}
                      disabled={isView || isHttpClientLoading}
                    />
                  </TableAtom.TCell>
                  <TableAtom.TCell className="min-w-[100px]">
                    <DropdownBoxAtom
                      options={products}
                      // fullWidth
                      size="small"
                      value={row.productId}
                      placeholder={t("product name")}
                      filter={["name", "names"]}
                      optionRender={(item) => item.name ?? ""}
                      valueSelector={(item) => (item?.id ? item.id : "")}
                      modalChildren={<ProductFormTemplate tenantId={tenantId} />}
                      triggerLabelDisplay={(value) => value?.name ?? ""}
                      onSelect={(item) => {
                        handleProductChange(row, item.id);
                      }}
                    />
                  </TableAtom.TCell>
                  <TableAtom.TCell className="min-w-[100px]">
                    <DropdownBoxAtom
                      options={row.productUnits}
                      value={row.productUnitId}
                      placeholder={t("Unit")}
                      size="small"
                      // filter={["unitName"]}
                      optionRender={(item) => item?.unitName ?? ""}
                      valueSelector={(item) => (item?.id ? item.id : "")}
                      triggerLabelDisplay={(value) => value?.unitName ?? ""}
                      onSelect={(item) => {
                        handleUnitChange(row, item.id);
                      }}
                    />
                  </TableAtom.TCell>
                  <TableAtom.TCell>
                    <DropdownBoxAtom
                      options={row.taxDetails}
                      value={row.taxId}
                      placeholder={t("Taxes")}
                      size="small"
                      // filter={["unitName"]}
                      optionRender={(item) => item.taxName ?? ""}
                      valueSelector={(item) => (item?.taxTypeId ? item.taxTypeId : "")}
                      triggerLabelDisplay={(value) => value?.taxName ?? ""}
                      onSelect={(item) => {
                        handleTaxChange(row, item.taxTypeId);
                      }}
                    />
                  </TableAtom.TCell>
                  <TableAtom.TCell>
                    <TextFieldAtom
                      size="small"
                      value={row.qty}
                      disabled={isView || isHttpClientLoading}
                      onChange={(e) => handleQtyChange(row, +e.target.value)}
                      inputProps={{
                        min: 0,
                      }}
                    />
                  </TableAtom.TCell>
                  <TableAtom.TCell>
                    <TextFieldAtom
                      size="small"
                      value={row.price}
                      inputProps={{
                        min: 0,
                      }}
                      slotProps={{
                        input: {
                          readOnly: false,
                        },
                      }}
                      disabled={isView || isHttpClientLoading}
                    />
                  </TableAtom.TCell>
                  <TableAtom.TCell>
                    <TextFieldAtom
                      size="small"
                      value={row.cost}
                      disabled={isView || isHttpClientLoading}
                      slotProps={{
                        input: {
                          readOnly: true,
                        },
                      }}
                    />
                  </TableAtom.TCell>
                  <TableAtom.TCell>
                    <TextFieldAtom
                      size="small"
                      value={row.taxValue}
                      disabled={isView || isHttpClientLoading}
                      slotProps={{
                        input: {
                          readOnly: true,
                        },
                      }}
                    />
                  </TableAtom.TCell>
                  <TableAtom.TCell>
                    <ButtonBase
                      disabled={isView || isHttpClientLoading}
                      onClick={() => {
                        if (index !== 0) {
                          handleDeleteRow(row.rowId);
                        } else {
                          clearFirstRow();
                        }
                      }}
                      type="button"
                      className="text-center m-auto border-0 flex bg-transparent text-gray-500 justify-center items-center w-8 h-8 p-2 leading-4 transition-colors duration-200  rounded-md cursor-pointer group"
                    >
                      <FiTrash2 width="20" className="w-4 h-4  min-w-4 min-h-4 " />
                    </ButtonBase>
                  </TableAtom.TCell>
                </TableAtom.TRow>
              ))}
            </TableAtom.TBody>
          </TableAtom>
          {errors.details?.message && <ErrorInputAtom errorMessage={errors.details.message} />}

          <div className="flex items-start justify-between mt-1">
            <AddNewRowButton handleAddRow={handleAddRow} />
            <div className="flex flex-col gap-4 p-3 border-solid border-2 border-gray-200">
              <div className="flex items-center justify-between text-basse total-item">
                <p className="head ml-6">{t("Total quantity")}</p>
                <p className="value">{totalQty}</p>
              </div>

              <div className="flex items-center justify-between text-basse total-item mt-2">
                <p className="head ml-6">{t("Discount")}</p>
                <div className="value flex gap-2 border-solid border-2 border-[#E2E8F0] rounded-md w-1/2">
                  <TextFieldAtom
                    disabled={isView || isHttpClientLoading}
                    // type="number"
                    size="small"
                    onKeyDown={preventNegativeInput}
                    onPaste={handlePastePositiveInput}
                    {...register("discountValue")}
                    // className="w-full !h-[40px] mt-2 !border-none rounded-lg"
                  />
                  <DropdownBoxAtom
                    options={discountType}
                    value={watch("discountType")}
                    size="small"
                    // placeholder={t("Unit")}
                    // filter={["unitName"]}
                    optionRender={(item) => item.value ?? ""}
                    valueSelector={(item) => (item?.key ? item.key : "")}
                    triggerLabelDisplay={(value) => value?.value ?? ""}
                    onSelect={(item) => {
                      setValue("discountType", item.key);
                      calculateFinalTotalPrice();
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-basse total-item mt-2">
                <p className="head ml-6">{t("Total price")}</p>
                <p className="value">{totalPrice}</p>
              </div>

              <div className="flex items-center justify-between text-basse total-item mt-2">
                <p className="head ml-6">{t("Total tax")}</p>
                <p className="value">{totalTax}</p>
              </div>

              <div className="flex items-center justify-between text-basse total-item mt-2">
                <p className="head ml-6">{t("Final total value")}</p>
                <p className="value">{finalTotalPrice}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
