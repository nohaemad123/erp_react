"use client";

import { ResultHandler } from "@/@types/classes/ResultHandler";
import { SalesOrderDetailsRow, SalesOrderDto } from "@/@types/dto/SalesOrderDto";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import { ICommissionType } from "@/@types/interfaces/ICommissionType";
import fetchClient from "@/lib/fetchClient";
import {
  getAllCustomers,
  getAllProducts,
  GetAllStores,
  getAllTaxType,
  getDiscountType,
  getNewSalesOrderCode,
} from "@/services/loadData";
import { useAppStore } from "@/store";
import { ButtonBase, MenuItem, Select } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FiTrash2 } from "react-icons/fi";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { IStore } from "@/@types/interfaces/IStore";
import { IProduct, IProductUnit } from "@/@types/interfaces/IProduct";
import { ITax } from "@/@types/interfaces/ITax";
import { handlePastePositiveInput, preventNegativeInput } from "@/@types/stables";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { salesOrderValidationSchema } from "@/@types/validators/SalesOrderValidators";
import { ICustomer } from "@/@types/interfaces/ICustomer";
import LabelAtom from "@/components/atom/LabelAtom";
import { TextFieldAtom } from "@/components/atom/TextFieldAtom";
import TableAtom from "@/components/atom/TableAtom";
import { ErrorInputAtom } from "@/components/atom/ErrorInputAtom";
import ModalSavedAtom from "@/components/atom/ModalSavedAtom";
import SearchDropMenuAtom from "@/components/atom/SearchDropMenuAtom";
import { SaveButtonAtom } from "@/components/atom/SaveButtonAtom";
import { CreateButtonAtom } from "@/components/atom/CreateButtonAtom";
import { AddNewRowButton } from "@/components/atom/AddNewRowButton";

interface ISalesOrderFormTemplateProps {
  tenantId: string;
}

export default function SalesOrderForm({ tenantId }: Readonly<ISalesOrderFormTemplateProps>) {
  const [isModalSavedOpen, setIsModalSavedOpen] = useState<boolean>(false);

  const { t, i18n } = useTranslation();
  const { isHttpClientLoading } = useAppStore();
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
  } = useForm<SalesOrderDto>({
    defaultValues: {
      ...new SalesOrderDto(),
      details: [new SalesOrderDetailsRow()],
    },
    resolver: valibotResolver(salesOrderValidationSchema),
  });
  const [customersList, setCustomersList] = useState<ICustomer[]>([]);
  const [stores, setStore] = useState<IStore[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredStore, setFilteredStore] = useState<IStore[]>([]);
  const [filteredCustomer, setFilteredCustomer] = useState<ICustomer[]>([]);
  const [filteredProduct, setFilteredProduct] = useState<IProduct[]>([]);
  const [totalQty, setTotalQty] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [finalTotalPrice, setFinalTotalPrice] = useState<number>(0);
  const [totalTax, setTotalTax] = useState<number>(0);
  const [taxes, setTaxes] = useState<ITax[]>([]);
  const [discountType, setDiscountType] = useState<ICommissionType[]>([]);

  useEffect(() => {
    getAllCustomers(i18n.language, tenantId)
      .then((res) => {
        setCustomersList(res?.listData ?? []);
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
    if (Object.keys(errors).length > 0) {
      console.error("Form errors:", errors);
    }
  }, [errors]);

  async function handleSubmitForm() {
    const orderData: SalesOrderDto = getValues();

    const ORDER_DATA = {
      branchId: branch?.id ?? "",
      customerId: orderData.customerId,
      code: orderData.code,
      date: new Date(orderData.date).toISOString(),
      note: orderData.note,
      storeId: orderData.storeId,
      discountType: orderData.discountType,
      discountValue: +orderData.discountValue,
      details: orderData.details?.map((detailItem: SalesOrderDetailsRow, index: number) => {
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
    await handleCreate(ORDER_DATA);
    setIsModalSavedOpen(true);
  }

  async function handleCreate(orderData: any) {
    try {
      const response = await fetchClient<ResultHandler<SalesOrderDto>>(EndPointsEnums.SALES_ORDER, {
        method: "POST",
        body: orderData,
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
      });

      if (response.status) {
        handleClearForm();
        // push("/" + tenantId + "/purchase-order");
        return;
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  function handleClearForm() {
    reset(new SalesOrderDto());
  }

  function handleAddRow() {
    const details: any = getValues("details");
    details.push(new SalesOrderDetailsRow());
    setValue("details", details);
  }

  function handleDeleteRow(rowId: string) {
    const details = getValues("details").filter((x) => x.rowId !== rowId);
    setValue("details", details);
  }

  async function fetchNewCode() {
    if (!tenantId) return;
    const code = await getNewSalesOrderCode(i18n.language, tenantId);
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
    return totalRows.reduce((total, row) => total + row.taxValue, 0);
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

  const handleUnitChange = (row: any, unitId: string) => {
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

  const handleQtyChange = (row: any, qty: number) => {
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

  const handleTaxChange = (row: any, taxId: any) => {
    const selectedTax: any = taxes.find((tax) => tax.id === taxId) || {};
    delete selectedTax?.names;

    const taxValue = row.cost * ((selectedTax?.taxRate || 0) / 100);
    setValue(
      "details",
      getValues("details").map((x) =>
        x.rowId === row.rowId ? { ...x, taxDetails: [selectedTax], taxValue: taxValue.toFixed(2), taxId } : x,
      ),
    );
  };

  const handleProductChange = (row: any, productId: string) => {
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
            <p className="pb-3 m-0 text-lg font-medium custom-border text-[var(--primary)]">{t("Sales order details")}</p>
          </div>
          <div className="flex gap-3 mb-2 btns-wrapper">
            <CreateButtonAtom onClick={handleClearForm} />
            <SaveButtonAtom />
          </div>
        </div>

        {/* controls */}
        <div className="w-full p-10 bg-white border-b-2 table_container border-l-2 border-r-2 space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {/* <p>{ errors}</p> */}
            <div>
              <LabelAtom labelMessage="Receipt number" />
              <TextFieldAtom
                disabled={isHttpClientLoading}
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
                placeholder={t("Receipt number")}
                {...register("code")}
                className="w-full h-12 px-5 py-1 mt-2 text-lg border-2 rounded-lg"
              />
              {errors.code?.message && <ErrorInputAtom errorMessage={errors.code?.message} />}
            </div>
            {/* dateTo */}
            <div>
              <LabelAtom labelMessage="Document date" />
              <Controller
                control={control}
                name="date"
                render={({ field: { value, onChange } }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={dayjs(value)}
                      className="w-full text-base"
                      onChange={(newValue) => onChange(newValue?.toDate() ?? null)}
                    />
                  </LocalizationProvider>
                )}
              />
              {errors.date?.message && <ErrorInputAtom errorMessage={errors.date?.message} />}
            </div>

            {/* supplier */}
            <div>
              <LabelAtom labelMessage="Customer" />
              <Controller
                control={control}
                name="customerId"
                render={({ field: { value, onChange } }) => (
                  <Select
                    disabled={isHttpClientLoading}
                    value={value}
                    onChange={onChange}
                    placeholder={t("Choose supplier name")}
                    fullWidth
                  >
                    <MenuItem
                      sx={{
                        padding: "0px",
                      }}
                    >
                      <SearchDropMenuAtom
                        isLoading={false}
                        placeholder={t("Search")}
                        onSearch={(value) => {
                          setFilteredCustomer(customersList.filter((item) => item.name?.toLowerCase().includes(value)));
                        }}
                      />
                    </MenuItem>
                    {filteredCustomer.length > 0
                      ? filteredCustomer.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))
                      : customersList.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                  </Select>
                )}
              />
              {errors.customerId?.message && <ErrorInputAtom errorMessage={errors.customerId?.message} />}
            </div>

            {/* stores */}
            <div>
              <LabelAtom labelMessage="Stores" />
              <Controller
                control={control}
                name="storeId"
                render={({ field: { value, onChange } }) => (
                  <Select disabled={isHttpClientLoading} value={value} onChange={onChange} placeholder={t("stores")} fullWidth>
                    <MenuItem
                      sx={{
                        padding: "0px",
                      }}
                    >
                      <SearchDropMenuAtom
                        isLoading={false}
                        placeholder={t("Search")}
                        onSearch={(value) => {
                          setFilteredStore(stores.filter((item) => item.name?.toLowerCase().includes(value)));
                        }}
                      />
                    </MenuItem>
                    {filteredStore.length > 0
                      ? filteredStore.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))
                      : stores.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                  </Select>
                )}
              />
              {errors.storeId?.message && <ErrorInputAtom errorMessage={errors.storeId?.message} />}
            </div>

            {/* notes */}
            <div>
              <LabelAtom labelMessage="Notes" />
              <TextFieldAtom
                placeholder={t("Notes")}
                multiline
                {...register("note")}
                className="w-full px-5 py-1 mt-2 text-lg border-2 rounded-lg"
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
          <TableAtom aria-label="product prices table">
            <TableAtom.THead>
              <TableAtom.TRow>
                <TableAtom.TCell component="th" align="center">
                  #
                </TableAtom.TCell>
                <TableAtom.TCell component="th">{t("Barcode")}</TableAtom.TCell>
                <TableAtom.TCell component="th" className="min-w-[150px]">
                  {t("Product name")} *
                </TableAtom.TCell>
                <TableAtom.TCell component="th" className="min-w-[150px]">
                  {t("Unit")}
                </TableAtom.TCell>
                <TableAtom.TCell component="th" className="min-w-[150px]">
                  {t("Taxes")}
                </TableAtom.TCell>
                <TableAtom.TCell component="th">{t("Quantity")}</TableAtom.TCell>
                <TableAtom.TCell component="th">{t("Purchase price")}</TableAtom.TCell>
                <TableAtom.TCell component="th">{t("Total")}</TableAtom.TCell>
                <TableAtom.TCell component="th">{t("Total taxes")}</TableAtom.TCell>
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
                      disabled={isHttpClientLoading}
                    />
                  </TableAtom.TCell>
                  <TableAtom.TCell className="min-w-[200px]">
                    <Select
                      size="small"
                      disabled={isHttpClientLoading}
                      value={row?.productId}
                      onChange={(e) => {
                        handleProductChange(row, e.target.value);
                      }}
                      fullWidth
                    >
                      <MenuItem
                        sx={{
                          padding: "0px",
                        }}
                      >
                        <SearchDropMenuAtom
                          isLoading={false}
                          placeholder={t("Search")}
                          onSearch={(value) => {
                            setFilteredProduct(products.filter((item) => item.name?.toLowerCase().includes(value)));
                          }}
                        />
                      </MenuItem>
                      {filteredProduct.length > 0
                        ? filteredProduct.map((item) => (
                            <MenuItem key={item.id} value={item.id}>
                              {item.name}
                            </MenuItem>
                          ))
                        : products.map((item) => (
                            <MenuItem key={item.id} value={item.id}>
                              {item.name}
                            </MenuItem>
                          ))}
                    </Select>
                  </TableAtom.TCell>
                  <TableAtom.TCell className="min-w-[200px]">
                    <Select
                      size="small"
                      disabled={isHttpClientLoading}
                      value={row?.productUnitId}
                      onChange={(e) => {
                        handleUnitChange(row, e.target.value);
                      }}
                      fullWidth
                    >
                      {row.productUnits?.map((item: any, index: number) =>
                        item && item.id ? (
                          <MenuItem key={item.id} value={item.id}>
                            <div className="block">
                              <span className="text-black font-bold"> {item.unitName}</span>
                            </div>
                          </MenuItem>
                        ) : (
                          <MenuItem key={`unknown-${index}`} disabled>
                            <div className="block">
                              <span className="text-gray-500">Invalid Item</span>
                            </div>
                          </MenuItem>
                        ),
                      )}
                    </Select>
                  </TableAtom.TCell>
                  <TableAtom.TCell>
                    <Select
                      size="small"
                      disabled={isHttpClientLoading}
                      value={row.taxId}
                      onChange={(e) => {
                        handleTaxChange(row, e.target.value);
                      }}
                      fullWidth
                    >
                      {row.taxDetails?.map((item: any) => (
                        <MenuItem key={item.taxTypeId} value={item.taxTypeId}>
                          {item.taxName}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableAtom.TCell>
                  <TableAtom.TCell>
                    <TextFieldAtom
                      size="small"
                      type="number"
                      value={row.qty}
                      inputProps={{
                        min: 0,
                      }}
                      disabled={isHttpClientLoading}
                      onChange={(e) => handleQtyChange(row, +e.target.value)}
                    />
                  </TableAtom.TCell>
                  <TableAtom.TCell>
                    <TextFieldAtom
                      size="small"
                      type="number"
                      value={row.price}
                      slotProps={{
                        input: {
                          readOnly: false,
                        },
                      }}
                      inputProps={{
                        min: 0,
                      }}
                      disabled={isHttpClientLoading}
                    />
                  </TableAtom.TCell>
                  <TableAtom.TCell>
                    <TextFieldAtom
                      size="small"
                      type="number"
                      value={row.cost}
                      disabled={isHttpClientLoading}
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
                      type="number"
                      value={row.taxValue}
                      disabled={isHttpClientLoading}
                      slotProps={{
                        input: {
                          readOnly: true,
                        },
                      }}
                      // onChange={(e) =>
                      //   setValue(
                      //     "details",
                      //     details.map((x) => (x.rowId === row.rowId ? { ...x, costWithTax: +e.target.value } : x)),
                      //   )
                      // }
                    />
                  </TableAtom.TCell>
                  <TableAtom.TCell>
                    <ButtonBase
                      disabled={isHttpClientLoading}
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
          {errors.details?.message && <ErrorInputAtom errorMessage={errors.details?.message} />}

          <div className="flex items-start justify-between mt-1">
            <AddNewRowButton handleAddRow={handleAddRow} />

            <div className="flex flex-col gap-4 p-3 border-solid border-2 border-gray-200">
              <div className="flex items-center justify-between text-basse total-item">
                <p className="head ml-6">{t("Total quantity")}</p>
                <p className="value">{totalQty}</p>
              </div>

              <div className="flex items-center justify-between text-basse total-item mt-2">
                <p className="head ml-6">{t("Discount")}</p>
                <p className="value flex border-solid border-2 border-[#E2E8F0] rounded-md w-1/2">
                  <TextFieldAtom
                    disabled={isHttpClientLoading}
                    type="number"
                    onKeyDown={preventNegativeInput}
                    onPaste={handlePastePositiveInput}
                    {...register("discountValue")}
                    className="w-full h-12 px-5 py-1 mt-2 border-2 rounded-lg"
                  />
                  {/* <input type="number" className="w-1/2 text-center border-0" name="discountValue" step="any" /> */}
                  <Controller
                    control={control}
                    name="discountType"
                    render={({ field: { value, onChange } }) => (
                      <Select
                        disabled={isHttpClientLoading}
                        value={value}
                        onChange={(e) => {
                          onChange(e);
                          calculateFinalTotalPrice();
                        }}
                        fullWidth
                      >
                        {discountType.map((item) => (
                          <MenuItem key={item.key} value={item.key}>
                            {item.value}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </p>
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
