"use client";

import { BranchDto } from "@/@types/dto/BranchDto";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { branchValidationSchema } from "@/@types/validators/branchValidators";
import fetchClient from "@/lib/fetchClient";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import { useRouter } from "next/navigation";
import { ResultHandler } from "@/@types/classes/ResultHandler";
import { IBranch } from "@/@types/interfaces/IBranch";
import { useEffect, useState } from "react";
import { getBranchById } from "@/services/loadData";
import { useAppStore } from "@/store";
import LabelAtom from "@/components/atom/LabelAtom";
import { TextFieldAtom } from "@/components/atom/TextFieldAtom";
import { ErrorInputAtom } from "@/components/atom/ErrorInputAtom";
import ModalSavedAtom from "@/components/atom/ModalSavedAtom";
import { SaveButtonAtom } from "@/components/atom/SaveButtonAtom";
import { CreateButtonAtom } from "@/components/atom/CreateButtonAtom";
import { DeleteButtonAtom } from "@/components/atom/DeleteButtonAtom";
import { MainCardTitleAtom } from "@/components/atom/MainCardTitleAtom";

interface IBranchFormTemplateProps {
  tenantId: string;
  branchId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function BranchFormTemplate({ tenantId, branchId, isEdit, isView }: Readonly<IBranchFormTemplateProps>) {
  const { t, i18n } = useTranslation();
  const [isModalSavedOpen, setIsModalSavedOpen] = useState<boolean>(false);

  const { push } = useRouter();
  const { isHttpClientLoading } = useAppStore();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<BranchDto>({
    defaultValues: new BranchDto(),
    resolver: valibotResolver(branchValidationSchema),
  });

  useEffect(() => {
    if (branchId && typeof branchId === "string") {
      getBranchById(i18n.language, tenantId, branchId)
        .then((res) => {
          if (res) {
            const data = new BranchDto({
              ...res,
              nameAr: res.names.find((name) => name.language === "ar")?.value ?? "",
              nameEn: res.names.find((name) => name.language === "en")?.value ?? "",
            });

            reset(data);
          }
        })
        .catch(console.log);
    }
  }, [branchId]);

  async function handleCreate(branchData: BranchDto) {
    try {
      const response = await fetchClient<ResultHandler<IBranch>>(EndPointsEnums.BRANCH, {
        method: "POST",
        body: branchData,
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
      });

      if (response.status) {
        push("/" + tenantId + "/branches");
        return;
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  async function handleUpdate(branchData: BranchDto) {
    try {
      const response = await fetchClient<ResultHandler<IBranch>>(EndPointsEnums.BRANCH, {
        method: "PUT",
        body: branchData,
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
        params: {
          id: branchId,
        },
      });

      if (response.status) {
        push("/" + tenantId + "/branches");
        return;
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  async function handleSubmitForm(branchData: BranchDto) {
    if (isView) return;

    branchData.names ??= [];

    if (branchData.nameEn) {
      branchData.names.push({
        id: null,
        language: "en",
        value: branchData.nameEn,
        localizationSetsId: null,
      });
    }

    if (branchData.nameAr) {
      branchData.names.push({
        id: null,
        language: "ar",
        value: branchData.nameAr,
        localizationSetsId: null,
      });
    }

    setIsModalSavedOpen(true);
    if (isEdit) {
      await handleUpdate(branchData);
    } else {
      await handleCreate(branchData);
    }
  }

  function handleClearForm() {
    reset(new BranchDto());
  }

  async function handleDelete() {
    try {
      const response = await fetchClient<ResultHandler<null>>(EndPointsEnums.BRANCH, {
        method: "DELETE",
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
        params: {
          id: branchId,
        },
      });

      if (response.status) {
        push("/" + tenantId + "/branches");
        return;
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }

  return (
    <div>
      <div className="w-full">
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <ModalSavedAtom isOpen={isModalSavedOpen} setIsOpen={setIsModalSavedOpen} isEdit={isEdit} />

          <div className="flex items-center justify-between">
            <MainCardTitleAtom title="Branch data" />

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
              <LabelAtom labelMessage="Arabic branch name" required />
              <TextFieldAtom
                className="w-full mt-2"
                disabled={isView || isHttpClientLoading}
                placeholder={t("Arabic branch name")}
                {...register("nameAr")}
              />
              {errors.nameAr?.message && <ErrorInputAtom errorMessage={errors.nameAr?.message} />}
            </div>
            <div>
              <LabelAtom labelMessage="English branch name" />
              <TextFieldAtom
                className="w-full"
                disabled={isView || isHttpClientLoading}
                placeholder={t("English branch name")}
                {...register("nameEn")}
              />
              {errors.nameEn?.message && <ErrorInputAtom errorMessage={errors.nameEn?.message} />}
            </div>
            <div>
              <LabelAtom labelMessage="Phone number" />
              <TextFieldAtom
                className="w-full"
                disabled={isView || isHttpClientLoading}
                placeholder={t("Phone number")}
                {...register("mobile")}
              />
              {errors.mobile?.message && <ErrorInputAtom errorMessage={errors.mobile?.message} />}
            </div>
            <div>
              <LabelAtom labelMessage="Barcode address" />
              <TextFieldAtom
                className="w-full"
                multiline
                disabled={isView || isHttpClientLoading}
                placeholder={t("Barcode address")}
                {...register("barcodeAddress")}
              />
              {errors.barcodeAddress?.message && <ErrorInputAtom errorMessage={errors.barcodeAddress?.message} />}
            </div>
            <div>
              <LabelAtom labelMessage="Bills" />
              <TextFieldAtom
                className="w-full"
                disabled={isView || isHttpClientLoading}
                placeholder={t("Bills")}
                {...register("invoiceFormat")}
              />
              {errors.invoiceFormat?.message && <ErrorInputAtom errorMessage={errors.invoiceFormat?.message} />}
            </div>
            <div>
              <LabelAtom labelMessage="Address" />
              <TextFieldAtom
                className="w-full"
                multiline
                disabled={isView || isHttpClientLoading}
                placeholder={t("Address")}
                {...register("address")}
              />
              {errors.address?.message && <ErrorInputAtom errorMessage={errors.address?.message} />}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
