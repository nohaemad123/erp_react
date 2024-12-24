"use client";

import { SupplierDto } from "@/@types/dto/SupplierDto";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import fetchClient from "@/lib/fetchClient";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ResultHandler } from "@/@types/classes/ResultHandler";
import { ISupplier } from "@/@types/interfaces/ISupplier";
import { supplierValidationSchema } from "@/@types/validators/supplierValidators";
import { useAppStore } from "@/store";
import { useEffect, useState } from "react";
import {
  getAllCountries,
  getAllSupplierGroups,
  getAllPaymentMethods,
  getAllSupplierPrices,
  getAllRegions,
  getSupplierById,
  getNewSupplierCode,
} from "@/services/loadData";
import { Checkbox, Accordion, AccordionDetails, AccordionSummary, Typography, FormControlLabel } from "@mui/material";
import { IRegion } from "@/@types/interfaces/IRegion";
import { ISupplierGroup } from "@/@types/interfaces/ISupplierGroup";
import { MdArrowDownward } from "react-icons/md";
import { ICountry } from "@/@types/interfaces/ICountry";
import { IPrice } from "@/@types/interfaces/IPrice";
import { IPaymentMethod } from "@/@types/interfaces/IPaymentMethod";
import LabelAtom from "@/components/atom/LabelAtom";
import { TextFieldAtom } from "@/components/atom/TextFieldAtom";
import { ErrorInputAtom } from "@/components/atom/ErrorInputAtom";
import ModalSavedAtom from "@/components/atom/ModalSavedAtom";
import { SaveButtonAtom } from "@/components/atom/SaveButtonAtom";
import { CreateButtonAtom } from "@/components/atom/CreateButtonAtom";
import { DeleteButtonAtom } from "@/components/atom/DeleteButtonAtom";
import { MainCardTitleAtom } from "@/components/atom/MainCardTitleAtom";
import { MobileFieldAtom } from "@/components/atom/MobileFieldAtom";
import DropdownBoxAtom from "@/components/atom/DropdownBoxAtom";

interface ISupplierFormTemplateProps {
  tenantId: string;
  supplierId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function SupplierFormTemplate({ tenantId, supplierId, isEdit, isView }: Readonly<ISupplierFormTemplateProps>) {
  const { t, i18n } = useTranslation();
  const { push } = useRouter();
  const [isModalSavedOpen, setIsModalSavedOpen] = useState<boolean>(false);

  const { isHttpClientLoading } = useAppStore();
  const [countriesList, setCountriesList] = useState<ICountry[]>([]);
  const [regionsList, setRegionsList] = useState<IRegion[]>([]);
  const [supplierGroupsList, setSupplierGroupsList] = useState<ISupplierGroup[]>([]);
  const [supplierPricesList, setSupplierPricesList] = useState<IPrice[]>([]);
  const [supplierPaymentMethodsList, setSupplierPaymentMethodsList] = useState<IPaymentMethod[]>([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SupplierDto>({
    defaultValues: new SupplierDto({ mobileCountryId: "SA" }),
    resolver: valibotResolver(supplierValidationSchema),
  });

  async function handleSubmitForm(supplierData: SupplierDto) {
    console.log(supplierData);
    if (isView) return;
    supplierData.names ??= [];

    if (supplierData.nameEn) {
      supplierData.names.push({
        id: null,
        language: "en",
        value: supplierData.nameEn,
        localizationSetsId: null,
      });
    }

    if (supplierData.nameAr) {
      supplierData.names.push({
        id: null,
        language: "ar",
        value: supplierData.nameAr,
        localizationSetsId: null,
      });
    }
    supplierData.balance = Number(supplierData.balance);
    supplierData.balanceFirstDuration = Number(supplierData.balanceFirstDuration);
    supplierData.dealingDiscount = Number(supplierData.dealingDiscount);
    supplierData.debitLimit = Number(supplierData.debitLimit);
    setIsModalSavedOpen(true);

    if (isEdit) {
      await handleUpdate(supplierData);
    } else {
      await handleCreate(supplierData);
    }
  }

  async function handleCreate(supplierData: SupplierDto) {
    try {
      const response = await fetchClient<ResultHandler<ISupplier>>(EndPointsEnums.VENDOR, {
        method: "POST",
        body: supplierData,
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
      });

      if (response.status) {
        push("/" + tenantId + "/suppliers");
        return;
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  async function handleUpdate(supplierData: SupplierDto) {
    try {
      const response = await fetchClient<ResultHandler<ISupplier>>(EndPointsEnums.VENDOR, {
        method: "PUT",
        body: supplierData,
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
        params: {
          id: supplierId,
        },
      });

      if (response.status) {
        push("/" + tenantId + "/suppliers");
        return;
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  async function fetchNewCode() {
    if (!tenantId || supplierId || isEdit || isView) return;
    const code = await getNewSupplierCode(i18n.language, tenantId);
    if (code !== undefined) setValue("code", code.toString());
  }

  async function fetchSupplierById() {
    if (!supplierId || !tenantId) return;
    try {
      const res = await getSupplierById(i18n.language, tenantId, supplierId);

      const data = new SupplierDto({
        ...res,
        nameAr: res?.names.find((name) => name.language === "ar")?.value ?? "",
        nameEn: res?.names.find((name) => name.language === "en")?.value ?? "",
      });

      reset(data);
    } catch (error: any) {
      console.log(error);
    }
    return null;
  }

  useEffect(() => {
    if (tenantId) {
      getAllSupplierGroups(i18n.language, tenantId).then((res) => {
        setSupplierGroupsList(res?.listData ?? []);
      });
      getAllCountries(i18n.language, tenantId).then((res) => {
        setCountriesList(res?.listData ?? []);
      });
      getAllRegions(i18n.language, tenantId).then((res) => {
        setRegionsList(res?.listData ?? []);
      });
      getAllSupplierPrices(i18n.language, tenantId).then((res) => {
        setSupplierPricesList(res ?? []);
      });
      getAllPaymentMethods(i18n.language, tenantId).then((res) => {
        setSupplierPaymentMethodsList(res ?? []);
      });
    }
    fetchNewCode();
    fetchSupplierById();
  }, [supplierId, tenantId]);

  function handleClearForm() {
    reset(new SupplierDto());
  }

  async function handleDelete() {
    try {
      const response = await fetchClient<ResultHandler<null>>(EndPointsEnums.VENDOR, {
        method: "DELETE",
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
        params: {
          id: supplierId,
        },
      });

      if (response.status) {
        // toaster for success
        push("/" + tenantId + "/suppliers");
        return;
      }

      // toaster for error
    } catch (error) {
      console.error("Error deleting user:", error);
      // toaster for error
    }
  }

  return (
    <div>
      <div className="w-full">
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <ModalSavedAtom isOpen={isModalSavedOpen} setIsOpen={setIsModalSavedOpen} isEdit={isEdit} />

          <div className="flex items-center justify-between">
            <MainCardTitleAtom title="supplier data" />

            {!isView && (
              <div className="flex gap-3">
                {!isEdit && <CreateButtonAtom onClick={handleClearForm} />}
                <SaveButtonAtom />
                {isEdit && <DeleteButtonAtom onClick={handleDelete} />}
              </div>
            )}
          </div>

          <div className="w-full p-10 bg-white border-solid border-[#E6E7EC] border space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {!isView && (
                <div>
                  <LabelAtom labelMessage="Supplier Code" required />
                  <TextFieldAtom
                    disabled={isView || isHttpClientLoading}
                    placeholder={t("Supplier Code")}
                    {...register("code")}
                    className="w-full"
                  />
                  {errors.code?.message && <ErrorInputAtom errorMessage={errors.code?.message} />}
                </div>
              )}

              <div>
                <LabelAtom labelMessage="Supplier Name AR" required />
                <TextFieldAtom
                  disabled={isView || isHttpClientLoading}
                  placeholder={t("Supplier Name AR")}
                  {...register("nameAr")}
                  className="w-full"
                />
                {errors.nameAr?.message && <ErrorInputAtom errorMessage={errors.nameAr?.message} />}
              </div>

              <div>
                <LabelAtom labelMessage="Supplier Name EN" />
                <TextFieldAtom
                  disabled={isView || isHttpClientLoading}
                  placeholder={t("Supplier Name EN")}
                  {...register("nameEn")}
                  className="w-full"
                />
                {errors.nameEn?.message && <ErrorInputAtom errorMessage={errors.nameEn?.message} />}
              </div>

              <div>
                <LabelAtom labelMessage={t("Supplier Group")} required />
                <Controller
                  control={control}
                  name="vendorGroupId"
                  render={({ field: { value, onChange } }) => (
                    <DropdownBoxAtom
                      options={supplierGroupsList}
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
                {errors.vendorGroupId?.message && <ErrorInputAtom errorMessage={errors.vendorGroupId?.message} />}
              </div>

              <div>
                <LabelAtom labelMessage="Country" />
                <MobileFieldAtom control={control} name="mobile" />

                {errors.mobile?.message && <ErrorInputAtom errorMessage={errors.mobile?.message} />}
                {errors.mobileCountryId?.message && <ErrorInputAtom errorMessage={errors.mobileCountryId?.message} />}
              </div>

              <div>
                <LabelAtom labelMessage="Telephone" />
                <TextFieldAtom
                  disabled={isView || isHttpClientLoading}
                  placeholder={t("Telephone")}
                  inputMode="numeric"
                  {...register("telephone")}
                  className="w-full"
                />
                {errors.telephone?.message && <ErrorInputAtom errorMessage={errors.telephone?.message} />}
              </div>
            </div>

            <Accordion sx={{ boxShadow: "none", border: "0", mt: "24px" }}>
              <AccordionSummary
                expandIcon={<MdArrowDownward />}
                sx={{
                  bgcolor: "#E9F0F7",
                  color: "var(--primary)",
                  borderRadius: "8px",
                  border: "1px solid #BAD1E7",
                  height: "38px",
                  minHeight: "38px",
                }}
              >
                <Typography sx={{ fontSize: "16px", fontWeight: "500" }}>
                  {t("Address")} (<LabelAtom labelMessage="optional" sx={{ color: "var(--primary)", display: "inline" }} />)
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="w-full p-2 space-y-5">
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                    <div>
                      <LabelAtom labelMessage="Country" />
                      <Controller
                        control={control}
                        name="countryId"
                        render={({ field: { value, onChange } }) => (
                          <DropdownBoxAtom
                            options={countriesList}
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

                      {errors.countryId?.message && <ErrorInputAtom errorMessage={errors.countryId?.message} />}
                    </div>

                    <div>
                      <LabelAtom labelMessage="City" />
                      <TextFieldAtom
                        disabled={isView || isHttpClientLoading}
                        placeholder={t("City")}
                        {...register("city")}
                        className="w-full "
                      />
                      {errors.city?.message && <ErrorInputAtom errorMessage={errors.city?.message} />}
                    </div>

                    <div>
                      <LabelAtom labelMessage="Neighborhood Number" />
                      <TextFieldAtom
                        disabled={isView || isHttpClientLoading}
                        placeholder={t("Neighborhood Number")}
                        {...register("neighborhoodNumber")}
                        className="w-full "
                      />
                      {errors.neighborhoodNumber?.message && <ErrorInputAtom errorMessage={errors.neighborhoodNumber?.message} />}
                    </div>

                    <div>
                      <LabelAtom labelMessage="Street" />
                      <TextFieldAtom
                        disabled={isView || isHttpClientLoading}
                        placeholder={t("Street")}
                        {...register("street")}
                        className="w-full "
                      />
                      {errors.street?.message && <ErrorInputAtom errorMessage={errors.street?.message} />}
                    </div>

                    <div>
                      <LabelAtom labelMessage="Building Number" />
                      <TextFieldAtom
                        disabled={isView || isHttpClientLoading}
                        placeholder={t("Building Number")}
                        {...register("buildingNumber")}
                        className="w-full "
                      />
                      {errors.buildingNumber?.message && <ErrorInputAtom errorMessage={errors.buildingNumber?.message} />}
                    </div>

                    <div>
                      <LabelAtom labelMessage="Postal Code" />
                      <TextFieldAtom
                        disabled={isView || isHttpClientLoading}
                        placeholder={t("Postal Code")}
                        {...register("postalCode")}
                        className="w-full "
                      />
                      {errors.postalCode?.message && <ErrorInputAtom errorMessage={errors.postalCode?.message} />}
                    </div>

                    <div>
                      <LabelAtom labelMessage="Region" />
                      <Controller
                        control={control}
                        name="regionId"
                        render={({ field: { value, onChange } }) => (
                          <DropdownBoxAtom
                            options={regionsList}
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

                      {errors.regionId?.message && <ErrorInputAtom errorMessage={errors.regionId?.message} />}
                    </div>

                    <div>
                      <LabelAtom labelMessage="Address" />
                      <TextFieldAtom
                        disabled={isView || isHttpClientLoading}
                        placeholder={t("Address")}
                        {...register("address")}
                        className="w-full"
                      />
                      {errors.address?.message && <ErrorInputAtom errorMessage={errors.address?.message} />}
                    </div>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ boxShadow: "none", border: "0", mt: "24px" }}>
              <AccordionSummary
                expandIcon={<MdArrowDownward />}
                sx={{
                  bgcolor: "#E9F0F7",
                  color: "var(--primary)",
                  borderRadius: "8px",
                  border: "1px solid #BAD1E7",
                  height: "38px",
                  minHeight: "38px",
                }}
              >
                <Typography>
                  {t("Financial Info")} ({t("optional")})
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="w-full p-2 space-y-5">
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                    <div>
                      <LabelAtom labelMessage="Credit Limit" />
                      <TextFieldAtom
                        type="number"
                        disabled={isView || isHttpClientLoading}
                        placeholder={t("Credit Limit")}
                        inputMode="numeric"
                        {...register("debitLimit")}
                        className="w-full h-12 px-5 py-1 mt-2 text-lg border-2 rounded-lg"
                      />
                      {errors.debitLimit?.message && <ErrorInputAtom errorMessage={errors.debitLimit?.message} />}
                    </div>
                    <div>
                      <LabelAtom labelMessage="Discount Rate" />
                      <TextFieldAtom
                        type="number"
                        disabled={isView || isHttpClientLoading}
                        placeholder={t("Discount Rate")}
                        inputMode="numeric"
                        {...register("dealingDiscount")}
                        className="w-full h-12 px-5 py-1 mt-2 text-lg border-2 rounded-lg"
                      />
                      {errors.dealingDiscount?.message && <ErrorInputAtom errorMessage={errors.dealingDiscount?.message} />}
                    </div>
                    <div>
                      <LabelAtom labelMessage="Trade License" />
                      <TextFieldAtom
                        disabled={isView || isHttpClientLoading}
                        placeholder={t("Trade License")}
                        {...register("tradeLicense")}
                        className="w-full h-12 px-5 py-1 mt-2 text-lg border-2 rounded-lg"
                      />
                      {errors.tradeLicense?.message && <ErrorInputAtom errorMessage={errors.tradeLicense?.message} />}
                    </div>
                    <div>
                      <LabelAtom labelMessage="Tax Number" />
                      <TextFieldAtom
                        disabled={isView || isHttpClientLoading}
                        placeholder={t("Tax Number")}
                        {...register("taxNumber")}
                        className="w-full h-12 px-5 py-1 mt-2 text-lg border-2 rounded-lg"
                      />
                      {errors.taxNumber?.message && <ErrorInputAtom errorMessage={errors.taxNumber?.message} />}
                    </div>
                    <div>
                      <LabelAtom labelMessage="Other Identifier" />
                      <TextFieldAtom
                        disabled={isView || isHttpClientLoading}
                        placeholder={t("Other Identifier")}
                        {...register("otherIdentifier")}
                        className="w-full h-12 px-5 py-1 mt-2 text-lg border-2 rounded-lg"
                      />
                      {errors.otherIdentifier?.message && <ErrorInputAtom errorMessage={errors.otherIdentifier?.message} />}
                    </div>
                    <div>
                      <LabelAtom labelMessage="Supplier Price" className="block mb-2 text-base" />
                      <Controller
                        control={control}
                        name="vendorPriceId"
                        render={({ field: { value, onChange } }) => (
                          <DropdownBoxAtom
                            options={supplierPricesList}
                            value={value}
                            keySelector={(item) => item.key ?? Date.now()}
                            valueSelector={(item) => item.key}
                            fullWidth
                            optionRender={(item) => item?.value}
                            triggerLabelDisplay={(item) => item?.value}
                            filter={["value"]}
                            onSelect={(item) => {
                              onChange(item.key);
                            }}
                          />
                        )}
                      />

                      {errors.vendorPriceId?.message && <ErrorInputAtom errorMessage={errors.vendorPriceId?.message} />}
                    </div>
                    <div>
                      <LabelAtom labelMessage="Payment Method" />
                      <Controller
                        control={control}
                        name="paymentMethodId"
                        render={({ field: { value, onChange } }) => (
                          <DropdownBoxAtom
                            options={supplierPaymentMethodsList}
                            value={value}
                            keySelector={(item) => item.key ?? Date.now()}
                            valueSelector={(item) => item.key}
                            fullWidth
                            optionRender={(item) => item?.value}
                            triggerLabelDisplay={(item) => item?.value}
                            filter={["value"]}
                            onSelect={(item) => {
                              onChange(item.key);
                            }}
                          />
                        )}
                      />
                      {errors.paymentMethodId?.message && <ErrorInputAtom errorMessage={errors.paymentMethodId?.message} />}
                    </div>
                    <div>
                      <LabelAtom labelMessage="Balance First Duration" />
                      <TextFieldAtom
                        disabled={isView || isEdit || isHttpClientLoading}
                        placeholder={t("Balance First Duration")}
                        inputMode="numeric"
                        {...register("balanceFirstDuration")}
                        className="w-full h-12 px-5 py-1 mt-2 text-lg border-2 rounded-lg"
                      />
                      {errors.balanceFirstDuration?.message && <ErrorInputAtom errorMessage={errors.balanceFirstDuration.message} />}
                    </div>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
              <Controller
                control={control}
                name="isTransactionSuspended"
                render={({ field: { value, onChange } }) => (
                  <FormControlLabel
                    style={{ marginRight: 0, marginLeft: 0, backgroundColor: "#E5EEF9" }}
                    control={
                      <Checkbox
                        checked={value}
                        disabled={isView || isHttpClientLoading}
                        onChange={(e) => {
                          onChange(e.target.checked);
                        }}
                      />
                    }
                    label={t("stop dealing")}
                  />
                )}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
