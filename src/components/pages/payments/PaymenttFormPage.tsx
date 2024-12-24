"use client";

import { ResultHandler } from "@/@types/classes/ResultHandler";
import { PaymentDto } from "@/@types/dto/PaymentDto";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import { ISafe } from "@/@types/interfaces/ISafe";
import fetchClient from "@/lib/fetchClient";
import { getAllAccounts, getAllSafes, getNewPaymentCode, getPaymentById } from "@/services/loadData";
import { useAppStore } from "@/store";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { MenuItem, Select } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { IPayment } from "@/@types/interfaces/IPayment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { IAccount } from "@/@types/interfaces/IAccount";
import { paymentValidationSchema } from "@/@types/validators/paymentValidators";
import LabelAtom from "@/components/atom/LabelAtom";
import { TextFieldAtom } from "@/components/atom/TextFieldAtom";
import { ErrorInputAtom } from "@/components/atom/ErrorInputAtom";
import ModalSavedAtom from "@/components/atom/ModalSavedAtom";
import SearchDropMenuAtom from "@/components/atom/SearchDropMenuAtom";
import { SaveButtonAtom } from "@/components/atom/SaveButtonAtom";
import { CreateButtonAtom } from "@/components/atom/CreateButtonAtom";
import { DeleteButtonAtom } from "@/components/atom/DeleteButtonAtom";

interface IPaymentFormPageProps {
  tenantId: string;
  paymentId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function PaymenttFormPage({ tenantId, paymentId, isEdit, isView }: Readonly<IPaymentFormPageProps>) {
  const [isModalSavedOpen, setIsModalSavedOpen] = useState<boolean>(false);
  const { t, i18n } = useTranslation();
  const { push } = useRouter();
  const { isHttpClientLoading } = useAppStore();
  const { branch } = useAppStore();
  const [accounts, setAccounts] = useState<IAccount[]>([]);
  const [safes, setSafes] = useState<ISafe[]>([]);
  const [filteredAccount, setFilteredAccount] = useState<IAccount[]>([]);
  const [filteredSafe, setFilteredSafe] = useState<ISafe[]>([]);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm<PaymentDto>({
    defaultValues: new PaymentDto(),
    resolver: valibotResolver(paymentValidationSchema),
  });

  useEffect(() => {
    if (paymentId && typeof paymentId === "string") {
      getPaymentById(i18n.language, tenantId, paymentId)
        .then((res) => {
          if (res) {
            const data = new PaymentDto({
              ...res,
              date: res.date ? new Date(res.date) : null,
            });
            reset(data);
          }
        })
        .catch(console.log);
    }

    fetchNewCode();
    fetchAccounts();
    fetchSafes();
  }, [paymentId]);

  function fetchAccounts() {
    getAllAccounts(i18n.language, tenantId)
      .then((res) => {
        if (res) {
          setAccounts(res?.listData ?? []);
        }
      })
      .catch(console.log);
  }

  function fetchSafes() {
    getAllSafes(i18n.language, tenantId)
      .then((res) => {
        if (res) {
          setSafes(res?.listData ?? []);
        }
      })
      .catch(console.log);
  }

  async function handleCreate(paymentsData: PaymentDto) {
    try {
      const response = await fetchClient<ResultHandler<IPayment>>(EndPointsEnums.PAYMENT, {
        method: "POST",
        body: paymentsData,
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
      });

      // console.log(response);

      if (response.status) {
        push("/" + tenantId + "/payments");
        return;
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  async function handleUpdate(paymentsData: PaymentDto) {
    try {
      const response = await fetchClient<ResultHandler<IPayment>>(EndPointsEnums.PAYMENT, {
        method: "PUT",
        body: paymentsData,
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
        params: {
          id: paymentId,
        },
      });

      // console.log(response);

      if (response.status) {
        push("/" + tenantId + "/payments");
        return;
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  // Function to handle form submission
  async function handleSubmitForm(paymentsData: PaymentDto) {
    if (isView) return;

    paymentsData.branchId = branch?.id;
    paymentsData.amount = Number(paymentsData.amount);

    setIsModalSavedOpen(true);

    if (isEdit) {
      await handleUpdate(paymentsData);
    } else {
      await handleCreate(paymentsData);
    }
  }

  async function fetchNewCode() {
    if (!tenantId || paymentId || isEdit || isView) return;
    const code = await getNewPaymentCode(i18n.language, tenantId);
    if (code !== undefined) setValue("code", code.toString());
  }

  // Function to clear the form
  function handleClearForm() {
    reset(new PaymentDto());
  }

  async function handleDelete() {
    try {
      const response = await fetchClient<ResultHandler<null>>(EndPointsEnums.PAYMENT, {
        method: "DELETE",
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
        params: {
          id: paymentId,
        },
      });

      if (response.status) {
        // toaster for success
        push("/" + tenantId + "/safes");
        return;
      }

      // toaster for error
    } catch (error) {
      console.error("Error deleting:", error);
      // toaster for error
    }
  }

  return (
    <div className="w-full p-8 pt-0 form-wrapper form_container mt-10">
      <ModalSavedAtom isOpen={isModalSavedOpen} setIsOpen={setIsModalSavedOpen} isEdit={isEdit} />

      <form className="add_branch_form_container" onSubmit={handleSubmit(handleSubmitForm)}>
        {/* buttons */}
        <div className="flex items-center justify-between">
          <div className="px-8 pt-3 bg-white border-t-2 border-l-2 border-r-2 rounded-ss-md rounded-se-md">
            <p className="pb-3 m-0 text-lg font-medium custom-border text-[var(--primary)]">{t("Payments data")}</p>
          </div>
          {!isView && (
            <div className="flex gap-3 mb-2 btns-wrapper">
              {!isEdit && <CreateButtonAtom onClick={handleClearForm} />}
              <SaveButtonAtom />
              {isEdit && <DeleteButtonAtom onClick={handleDelete} />}
            </div>
          )}
        </div>

        {/* controls */}
        <div className="flex-wrap justify-between w-full p-10 bg-white border-b-2 border-l-2 border-r-2 sm:block md:block lg:flex xl:flex">
          {/*  */}
          <div className="mb-6 sm:w-full md:w-full lg:w-1/3 pe-10">
            <LabelAtom labelMessage="Document number" />
            <TextFieldAtom type="text" disabled placeholder={t("Document number")} {...register("code")} className="w-full" />
            {errors.code?.message && <ErrorInputAtom errorMessage={errors.code?.message} />}
          </div>

          {/*  */}
          <div className="mb-6 sm:w-full md:w-full lg:w-1/3 pe-10">
            <LabelAtom labelMessage="Document date" required />

            <Controller
              control={control}
              name="date"
              render={({ field: { value, onChange } }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    disabled={isView || isHttpClientLoading}
                    value={dayjs(value)}
                    className="w-full"
                    onChange={(newValue) => onChange(newValue?.toDate() ?? null)}
                  />
                </LocalizationProvider>
              )}
            />
            {errors.date?.message && <ErrorInputAtom errorMessage={errors.date?.message} />}
          </div>

          {/*  */}
          <div className="mb-6 sm:w-full md:w-full lg:w-1/3 pe-10">
            <LabelAtom labelMessage="Account" required />
            <Controller
              control={control}
              name="toAccountId"
              render={({ field: { value, onChange } }) => (
                <Select
                  disabled={isView || isHttpClientLoading}
                  value={value}
                  className="w-full"
                  onChange={(e) => {
                    onChange(e.target.value);
                  }}
                  placeholder={t("Account")}
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
                        setFilteredAccount(accounts.filter((item) => item.name?.toLowerCase().includes(value)));
                      }}
                    />
                  </MenuItem>
                  {filteredAccount.length > 0
                    ? filteredAccount.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))
                    : accounts.map((account) => (
                        <MenuItem key={account.id} value={account.id}>
                          {account.name}
                        </MenuItem>
                      ))}
                </Select>
              )}
            />
            {errors.toAccountId?.message && <ErrorInputAtom errorMessage={errors.toAccountId?.message} />}
          </div>

          {/*  */}
          <div className="mb-6 sm:w-full md:w-full lg:w-1/3 pe-10">
            <LabelAtom labelMessage="Safe name" required />
            <Controller
              control={control}
              name="fromAccountId"
              render={({ field: { value, onChange } }) => (
                <Select
                  disabled={isView || isHttpClientLoading}
                  value={value}
                  className="w-full"
                  onChange={(e) => {
                    onChange(e.target.value);
                  }}
                  placeholder={t("Account")}
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
                        setFilteredSafe(safes.filter((item) => item.name?.toLowerCase().includes(value)));
                      }}
                    />
                  </MenuItem>
                  {filteredSafe.length > 0
                    ? filteredSafe.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))
                    : safes.map((safe) => (
                        <MenuItem key={safe.id} value={safe.id}>
                          {safe.name}
                        </MenuItem>
                      ))}
                </Select>
              )}
            />
            {errors.toAccountId?.message && <ErrorInputAtom errorMessage={errors.toAccountId?.message} />}
          </div>

          {/*  */}
          <div className="mb-6 sm:w-full md:w-full lg:w-1/3 pe-10">
            <LabelAtom labelMessage="Amount" />
            <div className="relative">
              <TextFieldAtom
                className="w-full h-12 py-1 mt-2 text-lg border-2 rounded-lg"
                disabled={isView || isHttpClientLoading}
                placeholder={t("Amount")}
                {...register("amount")}
              />
              <div className={`absolute ${i18n.language === "ar" ? "left-5" : "right-5"} top-[50%] -translate-y-[50%]`}>
                <span className="text-lg">{t("SAR")}</span>
              </div>
            </div>
            {errors.amount?.message && <ErrorInputAtom errorMessage={errors.amount?.message} />}
          </div>

          {/* notes */}
          <div className="mb-6 sm:w-full md:w-full lg:w-1/3 pe-10">
            <LabelAtom labelMessage="notes" />
            <TextFieldAtom type="text" multiline placeholder={t("notes")} {...register("note")} className="w-full" />
            {errors.note?.message && <ErrorInputAtom errorMessage={errors.note?.message} />}
          </div>
        </div>
      </form>
    </div>
  );
}
