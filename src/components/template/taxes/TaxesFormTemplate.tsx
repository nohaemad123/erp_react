"use client";

import { ResultHandler } from "@/@types/classes/ResultHandler";
import { TaxDto } from "@/@types/dto/TaxDto";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import { ITax } from "@/@types/interfaces/ITax";
import { taxValidationSchema } from "@/@types/validators/taxValidators";
import { CreateButtonAtom } from "@/components/atom/CreateButtonAtom";
import { DeleteButtonAtom } from "@/components/atom/DeleteButtonAtom";
import { ErrorInputAtom } from "@/components/atom/ErrorInputAtom";
import LabelAtom from "@/components/atom/LabelAtom";
import { MainCardTitleAtom } from "@/components/atom/MainCardTitleAtom";
import ModalSavedAtom from "@/components/atom/ModalSavedAtom";
import { SaveButtonAtom } from "@/components/atom/SaveButtonAtom";
import { TextFieldAtom } from "@/components/atom/TextFieldAtom";
import fetchClient from "@/lib/fetchClient";
import { getTaxById } from "@/services/loadData";
import { useAppStore } from "@/store";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface ITaxFormTemplateProps {
  tenantId: string;
  taxId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function TaxesFormTemplate({ tenantId, taxId, isEdit, isView }: Readonly<ITaxFormTemplateProps>) {
  const { t, i18n } = useTranslation();
  const [isModalSavedOpen, setIsModalSavedOpen] = useState<boolean>(false);

  const { push } = useRouter();
  const { isHttpClientLoading } = useAppStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaxDto>({
    defaultValues: new TaxDto(),
    resolver: valibotResolver(taxValidationSchema),
  });

  useEffect(() => {
    if (taxId && typeof taxId === "string") {
      getTaxById(i18n.language, tenantId, taxId)
        .then((res) => {
          if (res) {
            const data = new TaxDto({
              ...res,
              nameAr: res.names.find((name) => name.language === "ar")?.value,
              nameEn: res.names.find((name) => name.language === "en")?.value,
            });
            reset(data);
          }
        })
        .catch(console.log);
    }
  }, [taxId]);

  async function handleCreate(taxesData: TaxDto) {
    try {
      const response = await fetchClient<ResultHandler<ITax>>(EndPointsEnums.TAX_TYPE, {
        method: "POST",
        body: taxesData,
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
      });

      // console.log(response);

      if (response.status) {
        push("/" + tenantId + "/taxes");
        return;
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  async function handleUpdate(taxesData: TaxDto) {
    try {
      const response = await fetchClient<ResultHandler<ITax>>(EndPointsEnums.TAX_TYPE, {
        method: "PUT",
        body: taxesData,
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
        params: {
          id: taxId,
        },
      });

      // console.log(response);

      if (response.status) {
        push("/" + tenantId + "/taxes");
        return;
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  // Function to handle form submission
  async function handleSubmitForm(taxesData: TaxDto) {
    if (isView) return;

    taxesData.names ??= [];

    if (taxesData.nameEn) {
      taxesData.names.push({
        id: null,
        language: "en",
        value: taxesData.nameEn,
        localizationSetsId: null,
      });
    }

    if (taxesData.nameAr) {
      taxesData.names.push({
        id: null,
        language: "ar",
        value: taxesData.nameAr,
        localizationSetsId: null,
      });
    }
    setIsModalSavedOpen(true);

    if (isEdit) {
      await handleUpdate(taxesData);
    } else {
      await handleCreate(taxesData);
    }
  }

  // Function to clear the form
  function handleClearForm() {
    reset(new TaxDto());
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
          id: taxId,
        },
      });

      if (response.status) {
        // "toaster for success
        push("/" + tenantId + "/taxes");
        return;
      }

      // "toaster for error
    } catch (error) {
      console.error("Error deleting:", error);
      // "toaster for error
    }
  }

  return (
    <div>
      <div className="w-full">
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <ModalSavedAtom isOpen={isModalSavedOpen} setIsOpen={setIsModalSavedOpen} isEdit={isEdit} />

          {/* buttons */}
          <div className="flex items-center justify-between">
            <MainCardTitleAtom title="Taxes data" />

            {!isView && (
              <div className="flex gap-3 mb-2 btns-wrapper">
                {!isEdit && <CreateButtonAtom onClick={handleClearForm} />}
                <SaveButtonAtom />
                {isEdit && <DeleteButtonAtom onClick={handleDelete} />}
              </div>
            )}
          </div>

          {/* controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-10 bg-white border-solid border-[#E6E7EC] border rounded-md rounded-tr-none">
            {/* code */}
            <div>
              <LabelAtom labelMessage="Tax code" required />
              <TextFieldAtom
                type="text"
                disabled={isView || isHttpClientLoading}
                placeholder={t("Tax code")}
                className="w-full text-base"
                {...register("code")}
              />
              {errors.code?.message && <ErrorInputAtom errorMessage={errors.code?.message} />}
            </div>

            {/* name ar */}
            <div>
              <LabelAtom labelMessage="Arabic tax name" required />
              <TextFieldAtom
                type="text"
                disabled={isView || isHttpClientLoading}
                placeholder={t("enter Arabic tax name")}
                className="w-full text-base"
                {...register("nameAr")}
              />
              {errors.nameAr?.message && <ErrorInputAtom errorMessage={errors.nameAr?.message} />}
            </div>

            {/* name en */}
            <div>
              <LabelAtom labelMessage="English tax name" />
              <TextFieldAtom
                type="text"
                disabled={isView || isHttpClientLoading}
                placeholder={t("enter English tax name")}
                className="w-full text-base"
                {...register("nameEn")}
              />
              {errors.nameEn?.message && <ErrorInputAtom errorMessage={errors.nameEn?.message} />}
            </div>

            {/* rate */}
            <div>
              <LabelAtom labelMessage="Tax rate" required />
              <div className="relative">
                <TextFieldAtom
                  className="w-full h-12 py-1 mt-2 text-lg border-2 rounded-lg"
                  disabled={isView || isHttpClientLoading}
                  placeholder={t("Tax rate")}
                  {...register("rate")}
                />
                <div className="absolute bottom-2 left-5 ">
                  <span className="text-[14px] font-normal text-[#c2c2c2]">%</span>
                </div>
              </div>
              {errors.rate?.message && <ErrorInputAtom errorMessage={errors.rate?.message} />}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
