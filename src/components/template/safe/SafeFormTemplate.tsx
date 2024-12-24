"use client";

import { ResultHandler } from "@/@types/classes/ResultHandler";
import { SafeDto } from "@/@types/dto/SafeDto";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import { ISafe } from "@/@types/interfaces/ISafe";
import { safeValidationSchema } from "@/@types/validators/safeValidators";
import { CreateButtonAtom } from "@/components/atom/CreateButtonAtom";
import { DeleteButtonAtom } from "@/components/atom/DeleteButtonAtom";
import { ErrorInputAtom } from "@/components/atom/ErrorInputAtom";
import LabelAtom from "@/components/atom/LabelAtom";
import { MainCardTitleAtom } from "@/components/atom/MainCardTitleAtom";
import ModalSavedAtom from "@/components/atom/ModalSavedAtom";
import { SaveButtonAtom } from "@/components/atom/SaveButtonAtom";
import { TextFieldAtom } from "@/components/atom/TextFieldAtom";
import fetchClient from "@/lib/fetchClient";
import { getSafeById } from "@/services/loadData";
import { useAppStore } from "@/store";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface ISafeFormTemplateProps {
  tenantId: string;
  safeId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function SafeFormTemplate({ tenantId, safeId, isEdit, isView }: Readonly<ISafeFormTemplateProps>) {
  const { t, i18n } = useTranslation();
  const [isModalSavedOpen, setIsModalSavedOpen] = useState<boolean>(false);

  const { push } = useRouter();
  const { isHttpClientLoading } = useAppStore();
  const { branch } = useAppStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SafeDto>({
    defaultValues: new SafeDto(),
    resolver: valibotResolver(safeValidationSchema),
  });

  useEffect(() => {
    if (safeId && typeof safeId === "string") {
      getSafeById(i18n.language, tenantId, safeId)
        .then((res) => {
          if (res) {
            const data = new SafeDto({
              ...res,
              nameAr: res.names.find((name) => name.language === "ar")?.value,
              nameEn: res.names.find((name) => name.language === "en")?.value,
            });
            reset(data);
          }
        })
        .catch(console.log);
    }
  }, [safeId]);

  async function handleCreate(safesData: SafeDto) {
    try {
      const response = await fetchClient<ResultHandler<ISafe>>(EndPointsEnums.SAFE, {
        method: "POST",
        body: safesData,
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
      });

      // console.log(response);

      if (response.status) {
        push("/" + tenantId + "/safes");
        return;
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  async function handleUpdate(safesData: SafeDto) {
    try {
      const response = await fetchClient<ResultHandler<ISafe>>(EndPointsEnums.SAFE, {
        method: "PUT",
        body: safesData,
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
        params: {
          id: safeId,
        },
      });

      // console.log(response);

      if (response.status) {
        push("/" + tenantId + "/safes");
        return;
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  // Function to handle form submission
  async function handleSubmitForm(safesData: SafeDto) {
    if (isView) return;

    safesData.names ??= [];

    if (safesData.nameEn) {
      safesData.names.push({
        id: null,
        language: "en",
        value: safesData.nameEn,
        localizationSetsId: null,
      });
    }

    if (safesData.nameAr) {
      safesData.names.push({
        id: null,
        language: "ar",
        value: safesData.nameAr,
        localizationSetsId: null,
      });
    }
    setIsModalSavedOpen(true);
    safesData.branchId = branch?.id;
    safesData.balanceFirstDuration = Number(safesData.balanceFirstDuration);
    if (isEdit) {
      await handleUpdate(safesData);
    } else {
      await handleCreate(safesData);
    }
  }

  // Function to clear the form
  function handleClearForm() {
    reset(new SafeDto());
  }

  async function handleDelete() {
    try {
      const response = await fetchClient<ResultHandler<null>>(EndPointsEnums.TAX_TYPE, {
        method: "DELETE",
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
        params: {
          id: safeId,
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
    <div className="w-full">
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <ModalSavedAtom isOpen={isModalSavedOpen} setIsOpen={setIsModalSavedOpen} isEdit={isEdit} />

        {/* buttons */}
        <div className="flex items-center justify-between">
          <MainCardTitleAtom title="Safes data" />

          {!isView && (
            <div className="flex gap-3">
              {!isEdit && <CreateButtonAtom onClick={handleClearForm} />}

              <SaveButtonAtom />
              {isEdit && <DeleteButtonAtom onClick={handleDelete} />}
            </div>
          )}
        </div>

        {/* controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-10 bg-white border-solid border-[#E6E7EC] border rounded-md rounded-tr-none">
          {/*  */}
          <div>
            <LabelAtom labelMessage="Arabic safe name" required />
            <TextFieldAtom
              type="text"
              disabled={isView || isHttpClientLoading}
              placeholder={t("Arabic safe name")}
              {...register("nameAr")}
              className="w-full"
            />
            {errors.nameAr?.message && <ErrorInputAtom errorMessage={errors.nameAr?.message} />}
          </div>

          {/*  */}
          <div>
            <LabelAtom labelMessage="English safe name" />
            <TextFieldAtom
              type="text"
              disabled={isView || isHttpClientLoading}
              placeholder={t("English safe name")}
              {...register("nameEn")}
              className="w-full"
            />
            {errors.nameEn?.message && <ErrorInputAtom errorMessage={errors.nameEn?.message} />}
          </div>

          {/*  */}
          <div>
            <LabelAtom labelMessage="Balance first duration" />
            <div className="relative">
              <TextFieldAtom
                className="w-full h-12 py-1 mt-2 text-lg border-2 rounded-lg"
                disabled={isView || isEdit || isHttpClientLoading}
                placeholder={t("Balance first duration")}
                {...register("balanceFirstDuration")}
                sx={{
                  "& input": {
                    paddingInlineStart: "40px",
                  },
                }}
              />
              <div className="absolute bottom-2 right-5 ">
                <span className="text-[14px] font-normal text-[#C2C2C2]">SAR</span>
              </div>
            </div>
            {errors.balanceFirstDuration?.message && <ErrorInputAtom errorMessage={errors.balanceFirstDuration?.message} />}
          </div>
        </div>
      </form>
    </div>
  );
}
