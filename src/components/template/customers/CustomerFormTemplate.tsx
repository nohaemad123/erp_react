"use client";

import { CustomerDto } from "@/@types/dto/CustomerDto";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import fetchClient from "@/lib/fetchClient";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ResultHandler } from "@/@types/classes/ResultHandler";
import { ICustomer } from "@/@types/interfaces/ICustomer";
import { customerValidationSchema } from "@/@types/validators/customerValidators";
import { useAppStore } from "@/store";
import { useEffect, useState } from "react";
import {
  getAllCountries,
  getAllCustomerGroups,
  getAllPaymentMethods,
  getAllCustomerPrices,
  getAllRegions,
  getCustomerById,
  getNewCustomerCode,
} from "@/services/loadData";
import { Checkbox, Accordion, AccordionDetails, AccordionSummary, Typography, FormControlLabel } from "@mui/material";
import { IRegion } from "@/@types/interfaces/IRegion";
import { ICustomerGroup } from "@/@types/interfaces/ICustomerGroup";
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
import DropdownBoxAtom from "@/components/atom/DropdownBoxAtom";
import { MobileFieldAtom } from "@/components/atom/MobileFieldAtom";

interface ICustomerFormTemplateProps {
  tenantId: string;
  customerId?: string;
  isEdit?: boolean;
  isView?: boolean;
  isModal?: boolean;
  onModalClose?: () => void;
}

export default function CustomerFormTemplate({
  tenantId,
  customerId,
  isEdit,
  isView,
  isModal,
  onModalClose,
}: Readonly<ICustomerFormTemplateProps>) {
  const { t, i18n } = useTranslation();
  const [isModalSavedOpen, setIsModalSavedOpen] = useState<boolean>(false);

  const { push } = useRouter();
  const { isHttpClientLoading } = useAppStore();
  const [countriesList, setCountriesList] = useState<ICountry[]>([]);
  const [regionsList, setRegionsList] = useState<IRegion[]>([]);
  const [customerGroupsList, setCustomerGroupsList] = useState<ICustomerGroup[]>([]);
  const [customerPricesList, setCustomerPricesList] = useState<IPrice[]>([]);
  const [customerPaymentMethodsList, setCustomerPaymentMethodsList] = useState<IPaymentMethod[]>([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CustomerDto>({
    defaultValues: new CustomerDto({ mobileCountryId: "SA" }),
    resolver: valibotResolver(customerValidationSchema),
  });

  async function handleSubmitForm(customerData: CustomerDto) {
    if (isView) return;
    customerData.names ??= [];

    if (customerData.nameEn) {
      customerData.names.push({
        id: null,
        language: "en",
        value: customerData.nameEn,
        localizationSetsId: null,
      });
    }

    if (customerData.nameAr) {
      customerData.names.push({
        id: null,
        language: "ar",
        value: customerData.nameAr,
        localizationSetsId: null,
      });
    }

    customerData.balance = Number(customerData.balance);
    customerData.balanceFirstDuration = Number(customerData.balanceFirstDuration);
    customerData.discountRate = Number(customerData.discountRate);
    customerData.creditLimit = Number(customerData.creditLimit);
    setIsModalSavedOpen(true);
    if (isEdit) {
      await handleUpdate(customerData);
    } else {
      await handleCreate(customerData);
    }
  }

  async function handleCreate(customerData: CustomerDto) {
    try {
      const response = await fetchClient<ResultHandler<ICustomer>>(EndPointsEnums.CUSTOMER, {
        method: "POST",
        body: customerData,
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
      });

      if (response.status) {
        if (isModal) {
          onModalClose?.();
        } else {
          push("/" + tenantId + "/customers");
        }
        return;
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  async function handleUpdate(customerData: CustomerDto) {
    try {
      const response = await fetchClient<ResultHandler<ICustomer>>(EndPointsEnums.CUSTOMER, {
        method: "PUT",
        body: customerData,
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
        params: {
          id: customerId,
        },
      });

      if (response.status) {
        if (isModal) {
          onModalClose?.();
        } else {
          push("/" + tenantId + "/customers");
        }
        return;
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  async function fetchNewCode() {
    if (!tenantId || customerId || isEdit || isView) return;
    const code = await getNewCustomerCode(i18n.language, tenantId);
    if (code !== undefined) setValue("code", code.toString());
  }

  async function fetchCustomerById() {
    if (!customerId || !tenantId) return;
    try {
      const res = await getCustomerById(i18n.language, tenantId, customerId);

      const data = new CustomerDto({
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
      getAllCustomerGroups(i18n.language, tenantId).then((res) => {
        setCustomerGroupsList(res?.listData ?? []);
      });
      getAllCountries(i18n.language, tenantId).then((res) => {
        setCountriesList(res?.listData ?? []);
      });
      getAllRegions(i18n.language, tenantId).then((res) => {
        setRegionsList(res?.listData ?? []);
      });
      getAllCustomerPrices(i18n.language, tenantId).then((res) => {
        setCustomerPricesList(res ?? []);
      });
      getAllPaymentMethods(i18n.language, tenantId).then((res) => {
        setCustomerPaymentMethodsList(res ?? []);
      });
    }
    fetchNewCode();
    fetchCustomerById();
  }, [customerId, tenantId]);

  function handleClearForm() {
    reset(new CustomerDto());
  }

  async function handleDelete() {
    try {
      const response = await fetchClient<ResultHandler<null>>(EndPointsEnums.CUSTOMER, {
        method: "DELETE",
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
        params: {
          id: customerId,
        },
      });

      if (response.status) {
        if (isModal) {
          onModalClose?.();
        } else {
          push("/" + tenantId + "/customers");
        }
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
            <MainCardTitleAtom title="Customer data" />

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
                  <LabelAtom labelMessage="Customer Code" />
                  <TextFieldAtom disabled placeholder={t("Customer Code")} {...register("code")} className="w-full" />
                  {errors.code?.message && <ErrorInputAtom errorMessage={errors.code?.message} />}
                </div>
              )}

              <div>
                <LabelAtom labelMessage="Customer Name AR" required />
                <TextFieldAtom
                  disabled={isView || isHttpClientLoading}
                  placeholder={t("Customer Name AR")}
                  {...register("nameAr")}
                  className="w-full"
                />
                {errors.nameAr?.message && <ErrorInputAtom errorMessage={errors.nameAr?.message} />}
              </div>

              <div>
                <LabelAtom labelMessage="Customer Name EN" />
                <TextFieldAtom
                  disabled={isView || isHttpClientLoading}
                  placeholder={t("Customer Name EN")}
                  {...register("nameEn")}
                  className="w-full"
                />
                {errors.nameEn?.message && <ErrorInputAtom errorMessage={errors.nameEn?.message} />}
              </div>

              <div>
                <LabelAtom labelMessage="Customer Group" required />
                <Controller
                  control={control}
                  name="customerGroupId"
                  render={({ field: { value, onChange } }) => (
                    <DropdownBoxAtom
                      options={customerGroupsList}
                      value={value}
                      fullWidth
                      optionRender={(item) => item?.name}
                      triggerLabelDisplay={(item) => item?.name ?? ""}
                      keySelector={(item) => item.id ?? Date.now()}
                      valueSelector={(item) => item.id}
                      filter={["name"]}
                      onSelect={(item) => {
                        onChange(item.id);
                      }}
                    />
                  )}
                />
                {errors.customerGroupId?.message && <ErrorInputAtom errorMessage={errors.customerGroupId?.message} />}
              </div>

              <div>
                <LabelAtom labelMessage="Mobile" />
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
                        className="w-full h-12 px-5 py-1 mt-2 text-lg border-2 rounded-lg"
                      />
                      {errors.city?.message && <ErrorInputAtom errorMessage={errors.city?.message} />}
                    </div>
                    <div>
                      <LabelAtom labelMessage="Neighborhood Number" />
                      <TextFieldAtom
                        disabled={isView || isHttpClientLoading}
                        placeholder={t("Neighborhood Number")}
                        {...register("neighborhoodNumber")}
                        className="w-full h-12 px-5 py-1 mt-2 text-lg border-2 rounded-lg"
                      />
                      {errors.neighborhoodNumber?.message && <ErrorInputAtom errorMessage={errors.neighborhoodNumber?.message} />}
                    </div>
                    <div>
                      <LabelAtom labelMessage="Street" />
                      <TextFieldAtom
                        disabled={isView || isHttpClientLoading}
                        placeholder={t("Street")}
                        {...register("street")}
                        className="w-full h-12 px-5 py-1 mt-2 text-lg border-2 rounded-lg"
                      />
                      {errors.street?.message && <ErrorInputAtom errorMessage={errors.street?.message} />}
                    </div>
                    <div>
                      <LabelAtom labelMessage="Building Number" />
                      <TextFieldAtom
                        disabled={isView || isHttpClientLoading}
                        placeholder={t("Building Number")}
                        {...register("buildingNumber")}
                        className="w-full h-12 px-5 py-1 mt-2 text-lg border-2 rounded-lg"
                      />
                      {errors.buildingNumber?.message && <ErrorInputAtom errorMessage={errors.buildingNumber?.message} />}
                    </div>
                    <div>
                      <LabelAtom labelMessage="Postal Code" />
                      <TextFieldAtom
                        disabled={isView || isHttpClientLoading}
                        placeholder={t("Postal Code")}
                        {...register("postalCode")}
                        className="w-full h-12 px-5 py-1 mt-2 text-lg border-2 rounded-lg"
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
                <Typography sx={{ fontSize: "16px", fontWeight: "500" }}>
                  {t("Financial Info")} (<LabelAtom labelMessage="optional" sx={{ color: "var(--primary)", display: "inline" }} />)
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="w-full p-2 space-y-5">
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                    <div>
                      <LabelAtom labelMessage="Credit Limit" />
                      <TextFieldAtom
                        disabled={isView || isHttpClientLoading}
                        placeholder={t("Credit Limit")}
                        inputMode="numeric"
                        {...register("creditLimit")}
                        className="w-full h-12 px-5 py-1 mt-2 text-lg border-2 rounded-lg"
                      />
                      {errors.creditLimit?.message && <ErrorInputAtom errorMessage={errors.creditLimit?.message} />}
                    </div>
                    <div>
                      <LabelAtom labelMessage="Discount Rate" />
                      <TextFieldAtom
                        disabled={isView || isHttpClientLoading}
                        placeholder={t("Discount Rate")}
                        inputMode="numeric"
                        {...register("discountRate")}
                        className="w-full h-12 px-5 py-1 mt-2 text-lg border-2 rounded-lg"
                      />
                      {errors.discountRate?.message && <ErrorInputAtom errorMessage={errors.discountRate?.message} />}
                    </div>
                    <div>
                      <LabelAtom labelMessage={t("Trade License")} />
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
                      <LabelAtom labelMessage="Customer Price" />
                      <Controller
                        control={control}
                        name="customerPriceId"
                        render={({ field: { value, onChange } }) => (
                          <DropdownBoxAtom
                            options={customerPricesList}
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

                      {errors.customerPriceId?.message && <ErrorInputAtom errorMessage={errors.customerPriceId?.message} />}
                    </div>
                    <div>
                      <LabelAtom labelMessage="Payment Method" />
                      <Controller
                        control={control}
                        name="paymentMethodId"
                        render={({ field: { value, onChange } }) => (
                          <DropdownBoxAtom
                            options={customerPaymentMethodsList}
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
                      <LabelAtom
                        labelMessage="Balance First Duration"
                        className="text-lg leading-normal whitespace-nowrap text-ellipsis"
                      />
                      <TextFieldAtom
                        disabled={isEdit || isView || isHttpClientLoading}
                        placeholder={t("Balance First Duration")}
                        inputMode="numeric"
                        {...register("balanceFirstDuration")}
                        className="w-full h-12 px-5 py-1 mt-2 text-lg border-2 rounded-lg"
                      />
                      {errors.balanceFirstDuration?.message && <ErrorInputAtom errorMessage={errors.balanceFirstDuration?.message} />}
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
