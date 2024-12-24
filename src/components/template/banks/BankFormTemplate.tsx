"use client";

import { BankDto } from "@/@types/dto/BankDto";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import fetchClient from "@/lib/fetchClient";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ResultHandler } from "@/@types/classes/ResultHandler";
import { IBank } from "@/@types/interfaces/IBank";
import { bankValidationSchema } from "@/@types/validators/bankValidators";
import { useAppStore } from "@/store";
import { useEffect, useState } from "react";
import { getBankById } from "@/services/loadData";
import LabelAtom from "@/components/atom/LabelAtom";
import { TextFieldAtom } from "@/components/atom/TextFieldAtom";
import { ErrorInputAtom } from "@/components/atom/ErrorInputAtom";
import ModalSavedAtom from "@/components/atom/ModalSavedAtom";
import { SaveButtonAtom } from "@/components/atom/SaveButtonAtom";
import { CreateButtonAtom } from "@/components/atom/CreateButtonAtom";
import { DeleteButtonAtom } from "@/components/atom/DeleteButtonAtom";
import { MainCardTitleAtom } from "@/components/atom/MainCardTitleAtom";
import { MobileFieldAtom } from "@/components/atom/MobileFieldAtom";

interface IBankFormTemplateProps {
  tenantId: string;
  bankId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function BankFormTemplate({ tenantId, bankId, isEdit, isView }: Readonly<IBankFormTemplateProps>) {
  const { t, i18n } = useTranslation();
  const [isModalSavedOpen, setIsModalSavedOpen] = useState<boolean>(false);
  const { push } = useRouter();
  const { branch } = useAppStore();
  const { isHttpClientLoading } = useAppStore();
  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    formState: { errors },
  } = useForm<BankDto>({
    defaultValues: new BankDto({ countryMobileId: "SA" }),
    resolver: valibotResolver(bankValidationSchema),
  });

  async function handleSubmitForm(bankData: BankDto) {
    if (isView) return;
    bankData.names ??= [];

    if (bankData.nameEn) {
      bankData.names.push({
        id: null,
        language: "en",
        value: bankData.nameEn,
        localizationSetsId: null,
      });
    }

    if (bankData.nameAr) {
      bankData.names.push({
        id: null,
        language: "ar",
        value: bankData.nameAr,
        localizationSetsId: null,
      });
    }

    bankData.branchId = branch?.id;
    bankData.balanceFirstDuration = Number(bankData.balanceFirstDuration);

    setIsModalSavedOpen(true);
    if (isEdit) {
      await handleUpdate(bankData);
    } else {
      await handleCreate(bankData);
    }
  }

  async function handleCreate(bankData: BankDto) {
    const body = {
      ...bankData,
      mobile: getValues("mobile").replace(/\s+/g, ""),
    };

    try {
      const response = await fetchClient<ResultHandler<IBank>>(EndPointsEnums.BANK, {
        method: "POST",
        body: body,
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
      });

      // console.log(response);

      if (response.status) {
        push("/" + tenantId + "/banks");
        return;
      }
    } catch (error: any) {
      console.log(error);
    }
  }
  async function handleUpdate(bankData: BankDto) {
    const updatedBody = {
      ...bankData,
      mobile: getValues("mobile").replace(/\s+/g, ""),
    };

    try {
      const response = await fetchClient<ResultHandler<IBank>>(EndPointsEnums.BANK, {
        method: "PUT",
        body: updatedBody,
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
        params: {
          id: bankId,
        },
      });

      // console.log(response);

      if (response.status) {
        push("/" + tenantId + "/banks");
        return;
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (bankId && typeof bankId === "string") {
      getBankById(i18n.language, tenantId, bankId)
        .then((res) => {
          if (res) {
            const data = new BankDto({
              ...res,
              countryMobileId: "SA",
              nameAr: res.names.find((name) => name.language === "ar")?.value ?? "",
              nameEn: res.names.find((name) => name.language === "en")?.value ?? "",
            });

            reset(data);
          }
        })
        .catch(console.log);
    }
  }, [bankId]);

  function handleClearForm() {
    reset(new BankDto());
  }

  async function handleDelete() {
    try {
      const response = await fetchClient<ResultHandler<null>>(EndPointsEnums.BANK, {
        method: "DELETE",
        headers: {
          Tenant: tenantId,
        },
        params: {
          id: bankId,
        },
      });

      if (response.status) {
        // "toaster for success
        push("/" + tenantId + "/banks");
        return;
      }

      // "toaster for error
    } catch (error) {
      console.error("Error deleting user:", error);
      // "toaster for error
    }
  }

  return (
    <div>
      <div className="w-full">
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <ModalSavedAtom isOpen={isModalSavedOpen} setIsOpen={setIsModalSavedOpen} isEdit={isEdit} />

          <div className="flex items-center justify-between">
            <MainCardTitleAtom title="Bank data" />

            {!isView && (
              <div className="flex gap-3">
                {!isEdit && <CreateButtonAtom onClick={handleClearForm} />}

                <SaveButtonAtom />

                {isEdit && <DeleteButtonAtom onClick={handleDelete} />}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-10 bg-white border-solid border-[#E6E7EC] border rounded-md rounded-tr-none">
            <div>
              <LabelAtom labelMessage="English bank name" />
              <TextFieldAtom
                disabled={isView || isHttpClientLoading}
                placeholder={t("English bank name")}
                {...register("nameEn")}
                className="w-full"
              />
              {errors.nameEn?.message && <ErrorInputAtom errorMessage={errors.nameEn?.message} />}
            </div>

            {/*  */}
            <div>
              <LabelAtom required labelMessage="Arabic bank name" />
              <TextFieldAtom
                disabled={isView || isHttpClientLoading}
                placeholder={t("Arabic bank name")}
                {...register("nameAr")}
                className="w-full"
              />
              {errors.nameAr?.message && <ErrorInputAtom errorMessage={errors.nameAr?.message} />}
            </div>

            {/*   */}
            <div>
              <LabelAtom labelMessage="Mobile" />
              <MobileFieldAtom control={control} name="mobile" />

              {errors.mobile?.message && <ErrorInputAtom errorMessage={errors.mobile?.message} />}

              {errors.countryMobileId?.message && <ErrorInputAtom errorMessage={errors.countryMobileId?.message} />}
            </div>

            {/*  */}
            <div>
              <LabelAtom labelMessage="Email" />
              <TextFieldAtom
                placeholder={t("Email")}
                disabled={isView || isHttpClientLoading}
                {...register("email")}
                className="w-full"
              />
              {errors.email?.message && <ErrorInputAtom errorMessage={errors.email?.message} />}
            </div>

            {/*  */}
            <div>
              <LabelAtom labelMessage="Initial balance" />

              <TextFieldAtom
                type="number"
                placeholder={t("Initial balance")}
                disabled={isView || isHttpClientLoading}
                {...register("balanceFirstDuration")}
                className="w-full"
              />
              {errors.balanceFirstDuration?.message && <ErrorInputAtom errorMessage={errors.balanceFirstDuration?.message} />}
            </div>

            {/*  */}
            <div>
              <LabelAtom labelMessage="notes" />
              <TextFieldAtom
                multiline
                className="w-full"
                disabled={isView || isHttpClientLoading}
                placeholder={t("notes")}
                {...register("notes")}
              />

              {errors.notes?.message && <ErrorInputAtom errorMessage={errors.notes?.message} />}
            </div>

            {/*  */}
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
        </form>
      </div>
    </div>
  );
}
