"use client";

import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { FiTrash2 } from "react-icons/fi";
import fetchClient from "@/lib/fetchClient";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import { useRouter } from "next/navigation";
import { ResultHandler } from "@/@types/classes/ResultHandler";
import { useEffect, useState } from "react";
import {
  getAllProductGroups,
  getAllSuppliers,
  getAllTaxType,
  getAllUnits,
  getNewPaymentCode,
  getProductById,
} from "@/services/loadData";
import { useAppStore } from "@/store";
import { ProductDto, ProductUnitRow } from "@/@types/dto/ProductDto";
import { IProductTaxType } from "@/@types/interfaces/IProduct";
import { productValidationSchema } from "@/@types/validators/productValidators";
import { Checkbox, FormControlLabel, Autocomplete, ButtonBase } from "@mui/material";
import { IProductGroup } from "@/@types/interfaces/IProductGroup";
import { ISupplier } from "@/@types/interfaces/ISupplier";
import { IUnit } from "@/@types/interfaces/IUnit";
import { classNameGen } from "@/lib/cn";
import LabelAtom from "@/components/atom/LabelAtom";
import { TextFieldAtom } from "@/components/atom/TextFieldAtom";
import TableAtom from "@/components/atom/TableAtom";
import { ErrorInputAtom } from "@/components/atom/ErrorInputAtom";
import ModalSavedAtom from "@/components/atom/ModalSavedAtom";
import { SaveButtonAtom } from "@/components/atom/SaveButtonAtom";
import { CreateButtonAtom } from "@/components/atom/CreateButtonAtom";
import { DeleteButtonAtom } from "@/components/atom/DeleteButtonAtom";
import { AddNewRowButton } from "@/components/atom/AddNewRowButton";
import { MainCardTitleAtom } from "@/components/atom/MainCardTitleAtom";
import DropdownBoxAtom from "@/components/atom/DropdownBoxAtom";
import SupplierFormTemplate from "@/components/template/suppliers/SupplierFormTemplate";

interface IProductFormTemplateProps {
  tenantId: string;
  productId?: string;
  isEdit?: boolean;
}

export default function ProductFormTemplate({ tenantId, productId, isEdit }: Readonly<IProductFormTemplateProps>) {
  const [isModalSavedOpen, setIsModalSavedOpen] = useState<boolean>(false);

  // const [openAddSupplier, setOpenAddSupplier] = useState(false);
  // const [openEditSupplier, setOpenEditSupplier] = useState(false);
  // const handleOpenAddSupplier = () => setOpenAddSupplier(true);
  // const handleCloseAddSupplier = () => setOpenAddSupplier(false);
  // const handleOpenEditSupplier = () => setOpenEditSupplier(true);
  // const handleCloseEditSupplier = () => setOpenEditSupplier(false);

  const { t, i18n } = useTranslation();
  const { push } = useRouter();
  const { isHttpClientLoading } = useAppStore();
  const {
    register,
    reset,
    handleSubmit,
    control,
    getValues,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductDto>({
    defaultValues: new ProductDto({ productUnits: [new ProductUnitRow({})] }),
    resolver: valibotResolver(productValidationSchema),
  });
  const [productGroupsList, setProductGroupsList] = useState<IProductGroup[]>([]);
  const [suppliersList, setSuppliersList] = useState<ISupplier[]>([]);
  const [taxTypeList, setTaxTypeList] = useState<IProductTaxType[]>([]);
  const [unitsList, setUnitsList] = useState<IUnit[]>([]);

  const isView = !!productId && !isEdit;
  const disabled = isView || isHttpClientLoading;

  useEffect(() => {
    getAllProductGroups(i18n.language, tenantId)
      .then((res) => {
        setProductGroupsList(res?.listData ?? []);
      })
      .catch(console.log);
    getAllSuppliers(i18n.language, tenantId)
      .then((res) => {
        setSuppliersList(res?.listData ?? []);
      })
      .catch(console.log);
    getAllTaxType(i18n.language, tenantId)
      .then((res) => {
        setTaxTypeList(
          res?.listData.map((x) => ({
            taxTypeId: x.id,
            productId: null,
            taxName: x.name,
            taxRate: x.rate,
          })) ?? [],
        );
      })
      .catch(console.log);
    getAllUnits(i18n.language, tenantId)
      .then((res) => {
        setUnitsList(res?.listData ?? []);
      })
      .catch(console.log);

    if (productId && typeof productId === "string") {
      getProductById(i18n.language, tenantId, productId)
        .then((res) => {
          if (res) {
            const data = new ProductDto({
              ...res,
              productUnits: res.productUnits.map((x) => new ProductUnitRow(x)),
              nameAr: res.names.find((name) => name.language === "ar")?.value ?? "",
              nameEn: res.names.find((name) => name.language === "en")?.value ?? "",
            });

            reset(data);
          }
        })
        .catch(console.log);
    }
    fetchNewCode();
  }, [productId]);

  async function handleCreate(productData: ProductDto) {
    try {
      const response = await fetchClient<ResultHandler<null>>(EndPointsEnums.PRODUCT, {
        method: "POST",
        body: productData,
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
      });

      // const responseData = await response;
      // console.log("register successful", response);

      if (response.status) {
        push("/" + tenantId + "/products");
        return;
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  async function handleUpdate(productData: ProductDto) {
    productData.productTaxType = productData.productTaxType.map((x) => ({ ...x, productId: getValues("id") ?? null }));
    productData.productUnits = productData.productUnits.map((x) => ({ ...x, productId: getValues("id") ?? null }));

    try {
      const response = await fetchClient<ResultHandler<null>>(EndPointsEnums.PRODUCT, {
        method: "PUT",
        body: productData,
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
        params: {
          id: productId,
        },
      });

      // console.log(response);

      if (response.status) {
        push("/" + tenantId + "/products");
        return;
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  async function fetchNewCode() {
    if (!tenantId || productId || isEdit || isView) return;
    const code = await getNewPaymentCode(i18n.language, tenantId);
    if (code !== undefined) setValue("code", code);
  }

  async function handleSubmitForm(productData: ProductDto) {
    if (isView) return;

    productData.names ??= [];

    if (productData.nameEn) {
      productData.names.push({
        id: null,
        language: "en",
        value: productData.nameEn,
        localizationSetsId: null,
      });
    }

    if (productData.nameAr) {
      productData.names.push({
        id: null,
        language: "ar",
        value: productData.nameAr,
        localizationSetsId: null,
      });
    }

    setIsModalSavedOpen(true);
    if (isEdit) {
      await handleUpdate(productData);
    } else {
      await handleCreate(productData);
    }
  }

  function handleClearForm() {
    reset(new ProductDto());
    setValue("productUnits", [new ProductUnitRow()]);
  }

  async function handleDelete() {
    try {
      const response = await fetchClient<ResultHandler<null>>(EndPointsEnums.PRODUCT, {
        method: "DELETE",
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
        params: {
          id: productId,
        },
      });

      if (response.status) {
        // toaster for success
        push("/" + tenantId + "/products");
        return;
      }

      // toaster for error
    } catch (error) {
      console.error("Error deleting:", error);
      // toaster for error
    }
  }

  function clearFirstRow() {
    const newDetails = getValues("productUnits").map((row, index) => {
      if (index === 0) {
        return {
          ...row,
          barcode: "",
          unitItemTypeId: "",
          salePrice: 0,
          purchasPrice: 0,
          lowestSellingPrice: 0,
          wholesalePrice: 0,
          customerPrice: 0,
        };
      }
      return row;
    });
    setValue("productUnits", newDetails);
  }

  function handleAddRow() {
    const productUnits = getValues("productUnits");
    productUnits.push(new ProductUnitRow());
    setValue("productUnits", productUnits);
  }

  function handleDeleteRow(rowId: string) {
    const productUnits = getValues("productUnits").filter((x) => x.rowId !== rowId);
    setValue("productUnits", productUnits);
  }

  return (
    <>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <ModalSavedAtom isOpen={isModalSavedOpen} setIsOpen={setIsModalSavedOpen} isEdit={isEdit} />

        <div className="w-full mb-6">
          <div className="flex items-center justify-between">
            <MainCardTitleAtom title="Product data" />

            {!isView && (
              <div className="flex gap-3">
                {!isEdit && <CreateButtonAtom onClick={handleClearForm} />}

                <SaveButtonAtom />

                {isEdit && <DeleteButtonAtom onClick={handleDelete} />}
              </div>
            )}
          </div>

          <div className="w-full p-10 bg-white border-b-2 border-l-2 border-r-2 space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
              <div>
                <LabelAtom labelMessage={t("Product Code")} required />
                <TextFieldAtom disabled={disabled} placeholder={t("Product Code")} {...register("code")} className="w-full" />
                {errors.code?.message && <ErrorInputAtom errorMessage={errors.code?.message} />}
              </div>

              <div>
                <LabelAtom labelMessage="Product Name EN" />
                <TextFieldAtom disabled={disabled} placeholder={t("Product Name EN")} {...register("nameEn")} className="w-full" />
                {errors.nameEn?.message && <ErrorInputAtom errorMessage={errors.nameEn?.message} />}
              </div>

              <div>
                <LabelAtom labelMessage="Product Name AR" required />
                <TextFieldAtom disabled={disabled} placeholder={t("Product Name AR")} {...register("nameAr")} className="w-full" />
                {errors.nameAr?.message && <ErrorInputAtom errorMessage={errors.nameAr?.message} />}
              </div>

              <div>
                <LabelAtom labelMessage={t("Model Number")} />
                <TextFieldAtom disabled={disabled} placeholder={t("Model Number")} {...register("modelNumber")} className="w-full" />
                {errors.modelNumber?.message && <ErrorInputAtom errorMessage={errors.modelNumber?.message} />}
              </div>

              <div>
                <LabelAtom labelMessage="Supplier" required />

                <Controller
                  control={control}
                  name="vendorId"
                  render={({ field: { value, onChange } }) => (
                    <DropdownBoxAtom
                      options={suppliersList}
                      value={value}
                      keySelector={(item) => item.id ?? Date.now()}
                      valueSelector={(item) => item.id}
                      fullWidth
                      optionRender={(item) => item.name}
                      triggerLabelDisplay={(item) => item.name ?? ""}
                      filter={["name"]}
                      onSelect={(item) => {
                        onChange(item.id);
                      }}
                      modalChildren={<SupplierFormTemplate tenantId={tenantId} />}
                    />
                  )}
                />
                {errors.vendorId?.message && <ErrorInputAtom errorMessage={errors.vendorId?.message} />}
              </div>

              <div>
                <LabelAtom labelMessage="Product Group" required />

                <Controller
                  control={control}
                  name="productGroupId"
                  render={({ field: { value, onChange } }) => (
                    <DropdownBoxAtom
                      options={productGroupsList}
                      value={value}
                      keySelector={(item) => item.id ?? Date.now()}
                      valueSelector={(item) => item.id}
                      fullWidth
                      optionRender={(item) => item.name}
                      triggerLabelDisplay={(item) => item.name ?? ""}
                      filter={["name"]}
                      onSelect={(item) => {
                        onChange(item.id);
                      }}
                    />
                  )}
                />
                {errors.productGroupId?.message && <ErrorInputAtom errorMessage={errors.productGroupId?.message} />}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full pt-0 mb-6">
          <div className="flex items-center justify-between">
            <MainCardTitleAtom title="Product Prices" />
          </div>
          <div className="w-full bg-white border-b-2 table_container border-l-2 border-r-2 space-y-5 pb-3 mb-3">
            <TableAtom aria-label="product prices table" variant={"dynamic"}>
              <TableAtom.THead>
                <TableAtom.TRow>
                  <TableAtom.TCell align="center" component="th">
                    #
                  </TableAtom.TCell>
                  <TableAtom.TCell component="th">{t("Barcode")}</TableAtom.TCell>
                  <TableAtom.TCell component="th">{t("Unit")} *</TableAtom.TCell>
                  <TableAtom.TCell component="th">{t("Purchase Price")}</TableAtom.TCell>
                  <TableAtom.TCell component="th">{t("Sale Price")}</TableAtom.TCell>
                  <TableAtom.TCell component="th">{t("Lowest Sale Price")}</TableAtom.TCell>
                  <TableAtom.TCell component="th">{t("Whole Sale Price")}</TableAtom.TCell>
                  <TableAtom.TCell component="th"></TableAtom.TCell>
                </TableAtom.TRow>
              </TableAtom.THead>
              <TableAtom.TBody>
                {watch("productUnits")?.map((row, index, productUnits) => (
                  <TableAtom.TRow key={row.rowId}>
                    <TableAtom.TCell align="center" scope="row">
                      {index + 1}
                    </TableAtom.TCell>
                    <TableAtom.TCell>
                      <TextFieldAtom
                        size="small"
                        value={row.barcode}
                        disabled={disabled}
                        onChange={(e) =>
                          setValue(
                            "productUnits",
                            productUnits.map((x) => (x.rowId === row.rowId ? { ...x, barcode: e.target.value } : x)),
                          )
                        }
                      />
                    </TableAtom.TCell>
                    <TableAtom.TCell>
                      <DropdownBoxAtom
                        size="small"
                        options={unitsList}
                        value={row.unitItemTypeId}
                        keySelector={(item) => item.id ?? Date.now()}
                        valueSelector={(item) => item.id}
                        fullWidth
                        optionRender={(item) => item.name}
                        triggerLabelDisplay={(item) => item.name ?? ""}
                        filter={["name"]}
                        onSelect={(item) => {
                          setValue(
                            "productUnits",
                            productUnits.map((x) => (x.rowId === row.rowId ? { ...x, unitItemTypeId: item.id } : x)),
                          );
                        }}
                      />
                    </TableAtom.TCell>
                    <TableAtom.TCell>
                      <TextFieldAtom
                        size="small"
                        type="number"
                        value={row.purchasPrice}
                        disabled={disabled}
                        onChange={(e) =>
                          setValue(
                            "productUnits",
                            productUnits.map((x) => (x.rowId === row.rowId ? { ...x, purchasPrice: +e.target.value } : x)),
                          )
                        }
                      />
                    </TableAtom.TCell>
                    <TableAtom.TCell>
                      <TextFieldAtom
                        size="small"
                        type="number"
                        value={row.salePrice}
                        disabled={disabled}
                        onChange={(e) =>
                          setValue(
                            "productUnits",
                            productUnits.map((x) => (x.rowId === row.rowId ? { ...x, salePrice: +e.target.value } : x)),
                          )
                        }
                      />
                    </TableAtom.TCell>
                    <TableAtom.TCell>
                      <TextFieldAtom
                        size="small"
                        type="number"
                        value={row.lowestSellingPrice}
                        disabled={disabled}
                        onChange={(e) =>
                          setValue(
                            "productUnits",
                            productUnits.map((x) => (x.rowId === row.rowId ? { ...x, lowestSellingPrice: +e.target.value } : x)),
                          )
                        }
                      />
                    </TableAtom.TCell>
                    <TableAtom.TCell>
                      <TextFieldAtom
                        size="small"
                        type="number"
                        value={row.wholesalePrice}
                        disabled={disabled}
                        onChange={(e) =>
                          setValue(
                            "productUnits",
                            productUnits.map((x) => (x.rowId === row.rowId ? { ...x, wholesalePrice: +e.target.value } : x)),
                          )
                        }
                      />
                    </TableAtom.TCell>
                    {!isView && (
                      <TableAtom.TCell>
                        <ButtonBase
                          disabled={disabled}
                          onClick={() => {
                            if (index !== 0) {
                              handleDeleteRow(row.rowId);
                            } else {
                              clearFirstRow();
                            }
                          }}
                          type="button"
                          className={classNameGen(
                            "text-center m-auto border-0 flex bg-transparent text-gray-500 justify-center items-center w-8 h-8 p-2 leading-4 transition-colors duration-200  rounded-md cursor-pointer group",
                            disabled && "opacity-50",
                          )}
                        >
                          <FiTrash2 width="20" className="w-4 h-4  min-w-4 min-h-4 " />
                        </ButtonBase>
                      </TableAtom.TCell>
                    )}
                  </TableAtom.TRow>
                ))}
              </TableAtom.TBody>
            </TableAtom>
            {errors.productUnits?.message && <ErrorInputAtom errorMessage={errors.productUnits?.message} />}

            {!isView && (
              <div className="mx-2">
                <AddNewRowButton handleAddRow={handleAddRow} />
              </div>
            )}
          </div>
        </div>

        <div className="w-full  pt-0">
          <div className="flex items-center justify-between">
            <MainCardTitleAtom title="Stock data" />
          </div>

          <div className="w-full p-10 bg-white border-b-2 table_container border-l-2 border-r-2 space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
              <div>
                <LabelAtom labelMessage="Min Limit" />
                <TextFieldAtom
                  disabled={disabled}
                  placeholder={t("Min Limit")}
                  {...register("minLimit")}
                  className="w-full h-12 px-5 py-1 mt-2 border-2 rounded-lg"
                />
                {errors.minLimit?.message && <ErrorInputAtom errorMessage={errors.minLimit?.message} />}
              </div>

              <div>
                <LabelAtom labelMessage="Max Limit" />
                <TextFieldAtom
                  disabled={disabled}
                  placeholder={t("Max Limit")}
                  {...register("maxLimit")}
                  className="w-full h-12 px-5 py-1 mt-2 border-2 rounded-lg"
                />
                {errors.maxLimit?.message && <ErrorInputAtom errorMessage={errors.maxLimit?.message} />}
              </div>

              <div>
                <LabelAtom labelMessage="Reorder Limit" />
                <TextFieldAtom
                  disabled={disabled}
                  placeholder={t("Reorder Limit")}
                  {...register("reorderLimit")}
                  className="w-full h-12 px-5 py-1 mt-2 border-2 rounded-lg"
                />
                {errors.reorderLimit?.message && <ErrorInputAtom errorMessage={errors.reorderLimit?.message} />}
              </div>

              <div>
                <LabelAtom labelMessage="Max Discount" className="block mb-2 leading-normal whitespace-nowrap text-ellipsis" />
                <TextFieldAtom
                  disabled={disabled}
                  placeholder={t("Max Discount")}
                  {...register("maxDiscount")}
                  className="w-full h-12 px-5 py-1 mt-2 border-2 rounded-lg"
                />
                {errors.maxDiscount?.message && <ErrorInputAtom errorMessage={errors.maxDiscount?.message} />}
              </div>

              <div>
                <LabelAtom labelMessage="Discount on product" />
                <TextFieldAtom
                  disabled={disabled}
                  placeholder={t("Discount on product")}
                  {...register("discount")}
                  className="w-full h-12 px-5 py-1 mt-2 border-2 rounded-lg"
                />
                {errors.discount?.message && <ErrorInputAtom errorMessage={errors.discount?.message} />}
              </div>

              <div>
                <LabelAtom labelMessage="Representative commission" />
                <TextFieldAtom
                  disabled={disabled}
                  placeholder={t("Representative commission")}
                  {...register("commission")}
                  className="w-full h-12 px-5 py-1 mt-2 border-2 rounded-lg"
                />
                {errors.commission?.message && <ErrorInputAtom errorMessage={errors.commission?.message} />}
              </div>

              <div>
                <LabelAtom labelMessage="Customers Points" />
                <TextFieldAtom
                  type="number"
                  disabled={disabled}
                  placeholder={t("Customers Points")}
                  {...register("customerPoints")}
                  className="w-full h-12 px-5 py-1 mt-2 border-2 rounded-lg"
                />
                {errors.customerPoints?.message && <ErrorInputAtom errorMessage={errors.customerPoints?.message} />}
              </div>
              <div>
                <LabelAtom labelMessage="Tax Type" />
                <Controller
                  control={control}
                  name="productTaxType"
                  render={({ field: { value, onChange } }) => (
                    <Autocomplete
                      value={value}
                      disabled={disabled}
                      options={taxTypeList}
                      getOptionLabel={(option) => option.taxName || ""}
                      getOptionKey={(item) => item.taxTypeId}
                      onChange={(_, value: IProductTaxType[]) => {
                        onChange(value);
                      }}
                      multiple={true}
                      renderInput={(params) => <TextFieldAtom {...params} placeholder={t("Choose tax types")} />}
                    />
                  )}
                />
                {errors.productTaxType?.message && <ErrorInputAtom errorMessage={errors.productTaxType?.message} />}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
              <div>
                <Controller
                  control={control}
                  name="isCashOnly"
                  render={({ field: { value, onChange } }) => (
                    <FormControlLabel
                      className="bg-[#E5EEF9] w-full"
                      style={{ marginRight: 0, marginLeft: 0 }}
                      control={
                        <Checkbox
                          checked={value}
                          disabled={disabled}
                          onChange={(e) => {
                            onChange(e.target.checked);
                          }}
                        />
                      }
                      label={t("Cash only")}
                    />
                  )}
                />
                {errors.isCashOnly?.message && <ErrorInputAtom errorMessage={errors.isCashOnly?.message} />}
              </div>
              <div>
                <Controller
                  control={control}
                  name="isNonReturnable"
                  render={({ field: { value, onChange } }) => (
                    <FormControlLabel
                      className="bg-[#E5EEF9] w-full"
                      style={{ marginRight: 0, marginLeft: 0 }}
                      control={
                        <Checkbox
                          checked={value}
                          disabled={disabled}
                          onChange={(e) => {
                            onChange(e.target.checked);
                          }}
                        />
                      }
                      label={t("Non Returnable")}
                    />
                  )}
                />
                {errors.isNonReturnable?.message && <ErrorInputAtom errorMessage={errors.isNonReturnable?.message} />}
              </div>
              <div>
                <Controller
                  control={control}
                  name="isTransactionSuspended"
                  render={({ field: { value, onChange } }) => (
                    <FormControlLabel
                      className="bg-[#E5EEF9] w-full"
                      style={{ marginRight: 0, marginLeft: 0 }}
                      control={
                        <Checkbox
                          checked={value}
                          disabled={disabled}
                          onChange={(e) => {
                            onChange(e.target.checked);
                          }}
                        />
                      }
                      label={t("stop dealing")}
                    />
                  )}
                />
                {errors.isTransactionSuspended?.message && <ErrorInputAtom errorMessage={errors.isTransactionSuspended?.message} />}
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
