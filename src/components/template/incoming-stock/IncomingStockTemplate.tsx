"use client";

import { EndPointsEnums } from "@/@types/enums/endPoints";
import fetchClient from "@/lib/fetchClient";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FiTrash2 } from "react-icons/fi";
import { ResultHandler } from "@/@types/classes/ResultHandler";
import { useAppStore } from "@/store";
import { useCallback, useEffect, useState } from "react";
import {
  getNewIncomingStoreCode,
  getAllIncomingStoreTypes,
  getAllStores,
  getAllSuppliers,
  getAllProduct,
  getIncomingStockTransactionById,
} from "@/services/loadData";
import { ButtonBase } from "@mui/material";
import { IIncomingStockType } from "@/@types/interfaces/IIncomingStockType";
import { IncomingStockDto, IncomingStockRow } from "@/@types/dto/IncomingStockDto";
import dayjs from "dayjs";
import { IncomingStockValidationSchema } from "@/@types/validators/IncomingStockValidators";
import { IStore } from "@/@types/interfaces/IStore";
import StoreFormTemplate from "@/components/template/stores/StoreFormTemplate";
import { ISupplier } from "@/@types/interfaces/ISupplier";
import SupplierFormTemplate from "@/components/template/suppliers/SupplierFormTemplate";
import { IProduct, IProductUnit } from "@/@types/interfaces/IProduct";
import { IIncomingStoreDetails } from "@/@types/interfaces/IIncomingStoreTransactions";
import LabelAtom from "@/components/atom/LabelAtom";
import { TextFieldAtom } from "@/components/atom/TextFieldAtom";
import TableAtom from "@/components/atom/TableAtom";
import ModalSavedAtom from "@/components/atom/ModalSavedAtom";
import { ErrorInputAtom } from "@/components/atom/ErrorInputAtom";
import { DatePickerInputFieldAtom } from "@/components/atom/DatePickerInputAtom";
import { SaveButtonAtom } from "@/components/atom/SaveButtonAtom";
import { CreateButtonAtom } from "@/components/atom/CreateButtonAtom";
import { AddNewRowButton } from "@/components/atom/AddNewRowButton";
import DropdownBoxAtom from "@/components/atom/DropdownBoxAtom";
import ProductFormTemplate from "@/components/template/products/ProductFormTemplate";
import { MainCardTitleAtom } from "@/components/atom/MainCardTitleAtom";

interface IIncomingStockFormTemplateProps {
  tenantId: string;
  incomingStockId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function IncomingStockFormTemplate({
  tenantId,
  incomingStockId,
  isEdit,
  isView,
}: Readonly<IIncomingStockFormTemplateProps>) {
  const [isModalSavedOpen, setIsModalSavedOpen] = useState<boolean>(false);
  const { t, i18n } = useTranslation();
  const { push } = useRouter();
  const { branch } = useAppStore();
  const { isHttpClientLoading } = useAppStore();
  const [incomingStockTypeList, setIncomingStockTypeList] = useState<IIncomingStockType[]>([]);
  const [stores, setStores] = useState<IStore[]>([]);
  const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [totalQty, setTotalQty] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<IncomingStockDto>({
    defaultValues: {
      ...new IncomingStockDto(),
      details: [new IncomingStockRow()],
    },
    resolver: valibotResolver(IncomingStockValidationSchema),
  });

  function handleAddRow() {
    const details: any = getValues("details");
    details.push(new IncomingStockRow());
    setValue("details", details);
  }

  function handleDeleteRow(rowId: string) {
    const details = getValues("details").filter((x) => x.rowId !== rowId);
    setValue("details", details);
  }

  async function handleSubmitForm() {
    const stockData: IncomingStockDto = getValues();
    const STOCK_DATA = {
      accountId: stockData.accountId,
      branchId: branch?.id ?? "",
      code: stockData.code,
      date: stockData.date,
      note: stockData.note,
      incomingStoreType: +stockData.incomingStoreType,
      storeId: stockData.storeId,
      details: stockData.details?.map((detailItem: IIncomingStoreDetails, index: number) => {
        const productUnits: any = getValues("details")[index]["productUnits"];
        return {
          productUnitId: detailItem.productUnitId,
          qty: detailItem.qty,
          price: detailItem.price,
          cost: detailItem.cost,
          productName: productUnits[index]?.product?.name,
          productUnits: productUnits?.map((unitData: IProductUnit) => {
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
        };
      }),
    };

    if (isView) return;
    if (isEdit) {
      await handleUpdate(STOCK_DATA);
    } else {
      await handleCreate(STOCK_DATA);
    }
  }

  async function handleCreate(stockData: any) {
    try {
      const response = await fetchClient<ResultHandler<IncomingStockDto>>(EndPointsEnums.INCOMING_STORE_TRANSACTION, {
        method: "POST",
        body: stockData,
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
      });

      if (response.status) {
        setIsModalSavedOpen(true);
        push("/" + tenantId + "/incoming-stock");
        return;
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  async function handleUpdate(stockData: any) {
    try {
      const response = await fetchClient<ResultHandler<IncomingStockDto>>(EndPointsEnums.INCOMING_STORE_TRANSACTION, {
        method: "PUT",
        body: stockData,
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
        params: {
          id: incomingStockId,
        },
      });

      if (response.status) {
        setIsModalSavedOpen(true);
        push("/" + tenantId + "/incoming-stock");
        return;
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  async function fetchNewCode() {
    if (!tenantId || incomingStockId || isEdit || isView) return;
    const code = await getNewIncomingStoreCode(i18n.language, tenantId);
    if (code !== undefined) setValue("code", code);
  }

  const calculateTotalQty = useCallback(() => {
    const totalRows = getValues("details");
    return totalRows.reduce((total, row) => total + (row.qty ?? 0), 0);
  }, [getValues]);

  const calculateTotalPrice = useCallback(() => {
    const totalRows = getValues("details");
    return totalRows.reduce((total, row) => total + (row.qty ?? 0) * (row.price ?? 0), 0);
  }, [getValues]);

  useEffect(() => {
    setTotalQty(calculateTotalQty());
    setTotalPrice(calculateTotalPrice());
  }, [watch("details"), calculateTotalQty, calculateTotalPrice]);

  useEffect(() => {
    if (incomingStockId && typeof incomingStockId === "string") {
      getIncomingStockTransactionById(i18n.language, tenantId, incomingStockId)
        .then((res) => {
          if (res) {
            const data = new IncomingStockDto({
              ...res,
              date: res.date ? dayjs(new Date(res.date)).toDate() : new Date(),
            });
            reset(data);
          }
        })
        .catch(console.log);
    }
  }, [incomingStockId]);

  useEffect(() => {
    if (tenantId) {
      getAllIncomingStoreTypes(i18n.language, tenantId).then((res) => {
        setIncomingStockTypeList(res ?? []);
      });

      getAllStores(i18n.language, tenantId).then((res) => {
        setStores(res?.listData ?? []);
      });

      getAllSuppliers(i18n.language, tenantId).then((res) => {
        setSuppliers(res?.listData ?? []);
      });

      getAllProduct(i18n.language, tenantId).then((res) => {
        setProducts(res?.listData ?? []);
      });
    }
    fetchNewCode();
  }, []);

  const handleUnitChange = (row: IncomingStockRow, unitId: string) => {
    const selectedUnit: any = [row.productUnits.find((x) => x.id === unitId)];
    const cost = selectedUnit[0]?.purchasPrice * (row.qty ?? 0);
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
            }
          : x,
      ),
    );
  };

  const handleQtyChange = (row: IncomingStockRow, qty: number) => {
    let cost = row.cost;

    if (row.productUnits?.length) {
      cost = qty * (row.productUnits[0]?.purchasPrice || 0);
    }

    setValue(
      "details",
      getValues("details").map((x) => (x.rowId === row.rowId ? { ...x, qty, cost } : x)),
    );
  };

  const handlePriceChange = (row: IncomingStockRow, price: number) => {
    const cost = (row.qty ?? 0) * price; // Calculate the updated cost based on the new price
    setValue(
      "details",
      getValues("details").map((x) => (x.rowId === row.rowId ? { ...x, price, cost } : x)),
    );
  };

  function handleClearForm() {
    reset(new IncomingStockDto());
  }

  function clearFirstRow() {
    const newDetails = getValues("details").map((row, index) => {
      if (index === 0) {
        return {
          ...row,
          productId: "",
          productUnitId: "",
          barcode: "",
          qty: null,
          cost: null,
          price: null,
          productUnits: [],
        };
      }
      return row;
    });
    setValue("details", newDetails);
  }

  // async function handleDelete() {
  //   try {
  //     const response = await fetchClient<ResultHandler<null>>(EndPointsEnums.INCOMING_STORE_TRANSACTION, {
  //       method: "DELETE",
  //       headers: {
  //         Tenant: tenantId,
  //         "Accept-Language": i18n.language,
  //       },
  //       params: {
  //         id: incomingStockId,
  //       },
  //     });

  //     if (response.status) {
  //       // toaster for success
  //       push("/" + tenantId + "/incoming-stock");
  //       return;
  //     }

  //     // toaster for error
  //   } catch (error) {
  //     console.error("Error deleting user:", error);
  //     // toaster for error
  //   }
  // }

  const handleProductChange = (row: IncomingStockRow, productId: string) => {
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
              price: selectedProduct?.productUnits[0]?.purchasPrice,
              cost: selectedProduct?.productUnits[0]?.purchasPrice * (row.qty ?? 0),
            }
          : x,
      ),
    );
  };

  const handleBarcodeChange = (row: IncomingStockRow, barcode: string) => {
    const selectedBarcode: any = products.find((x) => x.productUnits[0]?.barcode === barcode);

    setValue(
      "details",
      getValues("details").map((x) =>
        x.rowId === row.rowId
          ? {
              ...x,
              product: selectedBarcode,
              productId: selectedBarcode?.id,
              productUnitId: selectedBarcode?.productUnits[0]?.id,
              productUnits: selectedBarcode?.productUnits?.filter((x: IProductUnit) => x.isDefault)?.length
                ? selectedBarcode?.productUnits?.filter((x: IProductUnit) => x.isDefault)
                : [selectedBarcode?.productUnits[0]],
              barcode: selectedBarcode?.productUnits[0]?.barcode,
              price: selectedBarcode?.productUnits[0]?.purchasPrice,
              cost: selectedBarcode?.productUnits[0]?.purchasPrice * (row.qty ?? 0),
            }
          : x,
      ),
    );
  };

  return (
    <div className="container mx-auto flex justify-between items-center px-4 lg:px-12 mt-10">
      <div className="w-full p-8 pt-0 form-wrapper form_container">
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <ModalSavedAtom isOpen={isModalSavedOpen} setIsOpen={setIsModalSavedOpen} isEdit={isEdit} />

          <div className="flex items-center justify-between">
            <div className="table_title_div px-8 pt-3 border-[#e6e7ec] bg-white border-t-2 border-l-2 border-r-2 rounded-ss-md rounded-se-md">
              <MainCardTitleAtom title="Stock info" />
            </div>
            {!isView && (
              <div className="flex gap-3 mb-2 btns-wrapper">
                {!isEdit && <CreateButtonAtom onClick={handleClearForm} />}

                <SaveButtonAtom />

                {/* <Button
                  variant={"outlined"}
                   type="button"
                  onClick={() => push("/" + tenantId + "/incoming-stock")}
                  className="px-4 py-2 cancel_button bg-white border-0 rounded-lg shadow-sm text-grey"
                >
                  <span className="mx-2">{t("Cancel")}</span>
                </Button> */}
                {/* {isEdit && <DeleteButtonAtom onClick={handleDelete} />} */}
              </div>
            )}
          </div>

          <div className="w-full p-10 bg-white border-b-2 table_container border-l-2 border-r-2 space-y-5 ">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
              <div>
                <LabelAtom labelMessage="Document number" className="mb-2 text-lg leading-normal whitespace-nowrap text-ellipsis" />
                <TextFieldAtom
                  disabled={isView || isHttpClientLoading}
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                  placeholder={t("Document number")}
                  {...register("code")}
                  className="w-full h-12 px-5 py-1 mt-2 text-lg border-2 rounded-lg"
                />
                {errors.code?.message && <ErrorInputAtom errorMessage={errors.code?.message} />}
              </div>

              <div>
                <LabelAtom
                  labelMessage={t("Permission type")}
                  required
                  className="mb-2 text-lg leading-normal whitespace-nowrap text-ellipsis"
                />
                <DropdownBoxAtom
                  options={incomingStockTypeList}
                  fullWidth
                  value={watch("incomingStoreType")}
                  placeholder={t("Permission type")}
                  optionRender={(item) => item.value}
                  valueSelector={(item) => item.key}
                  triggerLabelDisplay={(value) => value?.value ?? ""}
                  onSelect={(item) => {
                    setValue("incomingStoreType", item.key.toString());
                  }}
                />
                {errors.incomingStoreType?.message && <ErrorInputAtom errorMessage={errors.incomingStoreType?.message} />}
              </div>

              <div>
                <LabelAtom
                  labelMessage={t("Document date")}
                  required
                  className="mb-2 text-lg leading-normal whitespace-nowrap text-ellipsis"
                />
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
                {errors.date?.message && <ErrorInputAtom errorMessage={errors.date?.message} />}
              </div>

              <div>
                <LabelAtom
                  labelMessage="Store name"
                  required
                  className="mb-2 text-lg leading-normal whitespace-nowrap text-ellipsis"
                />
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
                {errors.storeId?.message && <ErrorInputAtom errorMessage={errors.storeId?.message} />}
              </div>

              <div>
                <LabelAtom
                  labelMessage={t("supplier name")}
                  required
                  className="mb-2 text-lg leading-normal whitespace-nowrap text-ellipsis"
                />
                <DropdownBoxAtom
                  options={suppliers}
                  fullWidth
                  value={watch("accountId")}
                  placeholder={t("supplier name")}
                  filter={["name", "names"]}
                  optionRender={(item) => item.name}
                  valueSelector={(item) => (item?.id ? item?.id : "")}
                  modalChildren={<SupplierFormTemplate tenantId={tenantId} />}
                  triggerLabelDisplay={(value) => value?.name ?? ""}
                  onSelect={(item) => {
                    setValue("accountId", item?.id ? item.id : "");
                  }}
                />
                {errors.accountId?.message && <ErrorInputAtom errorMessage={errors.accountId?.message} />}
              </div>
              <div>
                <LabelAtom labelMessage={t("Notes")} className="mb-2 text-lg leading-normal whitespace-nowrap text-ellipsis" />
                <TextFieldAtom
                  placeholder={t("Notes")}
                  multiline
                  rows={1}
                  {...register("note")}
                  className="w-full h-12 px-5 py-1 mt-2 text-lg border-2 rounded-lg"
                  variant="outlined"
                  fullWidth
                />
                {errors.note?.message && <ErrorInputAtom errorMessage={errors.note?.message} />}
              </div>
            </div>
          </div>
          <div className="w-full p-10 bg-white border-b-2 table_container mt-10 border-l-2 border-r-2 space-y-5 mb-3">
            <TableAtom aria-label="product prices table" variant={"dynamic"}>
              <TableAtom.THead>
                <TableAtom.TRow>
                  <TableAtom.TCell component="th">#</TableAtom.TCell>
                  <TableAtom.TCell component="th">{t("Barcode")}</TableAtom.TCell>
                  <TableAtom.TCell component="th" className="min-w-[200px]">
                    {t("product name")} *
                    {/* {errors.accountId?.message && <ErrorInputAtom errorMessage={errors.accountId?.message} />} */}
                  </TableAtom.TCell>
                  <TableAtom.TCell component="th" className="min-w-[200px]">
                    {t("Unit")}
                  </TableAtom.TCell>
                  <TableAtom.TCell component="th">{t("Amount")}</TableAtom.TCell>
                  <TableAtom.TCell component="th">{t("Purchase Price")}</TableAtom.TCell>
                  <TableAtom.TCell component="th">{t("Total")}</TableAtom.TCell>
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
                        slotProps={{
                          input: {
                            readOnly: true,
                          },
                        }}
                        value={row.barcode}
                        onChange={(e) => handleBarcodeChange(row, e.target.value)}
                        disabled={isView || isHttpClientLoading}
                        fullWidth
                      />
                    </TableAtom.TCell>
                    <TableAtom.TCell className="min-w-[200px]">
                      <DropdownBoxAtom
                        options={products}
                        fullWidth
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
                    <TableAtom.TCell>
                      <DropdownBoxAtom
                        options={row.productUnits}
                        fullWidth
                        value={row.productUnitId}
                        placeholder={t("Unit")}
                        // filter={["unitName"]}
                        optionRender={(item) => item.unitName ?? ""}
                        valueSelector={(item) => (item?.id ? item.id : "")}
                        triggerLabelDisplay={(value) => value?.unitName ?? ""}
                        onSelect={(item) => {
                          handleUnitChange(row, item.id);
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
                        type="number"
                        value={row.price}
                        slotProps={{
                          input: {
                            readOnly: true,
                          },
                        }}
                        onChange={(e) => handlePriceChange(row, +e.target.value)}
                        inputProps={{
                          min: 0,
                        }}
                        disabled={isView || isHttpClientLoading}
                      />
                    </TableAtom.TCell>
                    <TableAtom.TCell>
                      <TextFieldAtom
                        size="small"
                        type="number"
                        slotProps={{
                          input: {
                            readOnly: true,
                          },
                        }}
                        value={row.cost}
                        disabled={isView || isHttpClientLoading}
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

            <div className="flex items-start justify-between mt-0 table-bottom">
              <AddNewRowButton handleAddRow={handleAddRow} />

              <div className="flex flex-col gap-4 p-3 border-solid border-2 border-gray-200">
                <div className="flex items-center justify-between text-lg total-item">
                  <p className="head ml-6">{t("Total quantity")}</p>
                  <p className="value ml-30">{totalQty}</p>
                </div>
                <div className="flex items-center justify-between text-lg total-item mt-2">
                  <p className="head ml-6">{t("Total price")}</p>
                  <p className="value ml-30">{totalPrice}</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
