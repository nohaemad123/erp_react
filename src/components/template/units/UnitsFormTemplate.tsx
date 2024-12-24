"use client";

import React, { useState } from "react";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import fetchClient from "@/lib/fetchClient";
import { ResultHandler } from "@/@types/classes/ResultHandler";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getUniyById } from "@/services/loadData";
import { UnitDto } from "@/@types/dto/UnitDto";
import { unitsValidationSchema } from "@/@types/validators/unitsValidators";
import { IUnit } from "@/@types/interfaces/IUnit";
import { useAppStore } from "@/store";
import LabelAtom from "@/components/atom/LabelAtom";
import { TextFieldAtom } from "@/components/atom/TextFieldAtom";
import { ErrorInputAtom } from "@/components/atom/ErrorInputAtom";
import ModalSavedAtom from "@/components/atom/ModalSavedAtom";
import { SaveButtonAtom } from "@/components/atom/SaveButtonAtom";
import { CreateButtonAtom } from "@/components/atom/CreateButtonAtom";
import { DeleteButtonAtom } from "@/components/atom/DeleteButtonAtom";
import { MainCardTitleAtom } from "@/components/atom/MainCardTitleAtom";

interface IUnitFormTemplateProps {
  tenantId: string;
  unitId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function UnitFormTemplate({ tenantId, unitId, isEdit, isView }: Readonly<IUnitFormTemplateProps>) {
  const { t, i18n } = useTranslation();
  const [isModalSavedOpen, setIsModalSavedOpen] = useState<boolean>(false);

  const { push } = useRouter();
  const { isHttpClientLoading } = useAppStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UnitDto>({
    defaultValues: new UnitDto(),
    resolver: valibotResolver(unitsValidationSchema),
  });

  useEffect(() => {
    if (unitId && typeof unitId === "string") {
      getUniyById(i18n.language, tenantId, unitId)
        .then((res) => {
          if (res) {
            const data = new UnitDto({
              ...res,
              nameAr: res.names.find((name) => name.language === "ar")?.value ?? "",
              nameEn: res.names.find((name) => name.language === "en")?.value ?? "",
            });
            reset(data);
          }
        })
        .catch(console.log);
    }
  }, [unitId]);

  async function handleCreate(unitsData: UnitDto) {
    try {
      const response = await fetchClient<ResultHandler<IUnit>>(EndPointsEnums.UNIT_TYPE, {
        method: "POST",
        body: unitsData,
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
      });

      if (response.status) {
        push("/" + tenantId + "/units");
        return;
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  async function handleUpdate(unitsData: UnitDto) {
    try {
      const response = await fetchClient<ResultHandler<IUnit>>(EndPointsEnums.UNIT_TYPE, {
        method: "PUT",
        body: unitsData,
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
        params: {
          id: unitId,
        },
      });

      if (response.status) {
        push("/" + tenantId + "/units");
        return;
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  // Function to handle form submission
  async function handleSubmitForm(unitsData: UnitDto) {
    if (isView) return;

    unitsData.names ??= [];

    if (unitsData.nameEn) {
      unitsData.names.push({
        id: null,
        language: "en",
        value: unitsData.nameEn,
        localizationSetsId: null,
      });
    }

    if (unitsData.nameAr) {
      unitsData.names.push({
        id: null,
        language: "ar",
        value: unitsData.nameAr,
        localizationSetsId: null,
      });
    }
    setIsModalSavedOpen(true);

    if (isEdit) {
      await handleUpdate(unitsData);
    } else {
      await handleCreate(unitsData);
    }
  }

  // Function to clear the form
  function handleClearForm() {
    reset(new UnitDto());
  }

  async function handleDelete() {
    try {
      const response = await fetchClient<ResultHandler<null>>(EndPointsEnums.UNIT_TYPE, {
        method: "DELETE",
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
        params: {
          id: unitId,
        },
      });

      if (response.status) {
        // toaster for success
        push("/" + tenantId + "/units");
        return;
      }

      // toaster for error
    } catch (error) {
      console.error("Error deleting:", error);
      // toaster for error
    }
  }

  return (
    <div className="w-full py-8">
      <div className="w-full p-8 pt-0 form-wrapper form_container">
        <form className="add_branch_form_container" onSubmit={handleSubmit(handleSubmitForm)}>
          <ModalSavedAtom isOpen={isModalSavedOpen} setIsOpen={setIsModalSavedOpen} isEdit={isEdit} />

          {/* Buttons */}
          <div className="flex items-center justify-between">
            <MainCardTitleAtom title="Unit Information" />

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
            {/* ar unit */}
            <div>
              <LabelAtom labelMessage="Unit Name Arabic" required />
              <TextFieldAtom
                disabled={isView || isHttpClientLoading}
                placeholder={t("Unit Name Arabic")}
                className="w-full"
                {...register("nameAr")}
              />
              <div>{errors.nameAr?.message && <ErrorInputAtom errorMessage={errors.nameAr?.message} />}</div>
            </div>

            {/* en unit */}
            <div>
              <LabelAtom labelMessage="Unit Name English" />
              <TextFieldAtom
                disabled={isView || isHttpClientLoading}
                placeholder={t("Unit Name English")}
                className="w-full"
                {...register("nameEn")}
              />
              <div>{errors.nameEn?.message && <ErrorInputAtom errorMessage={errors.nameEn?.message} />}</div>
            </div>

            {/* unit rate */}
            <div>
              <LabelAtom labelMessage="unit rate" required />
              <TextFieldAtom
                disabled={isView || isHttpClientLoading}
                {...register("factor")}
                placeholder={t("unit rate")}
                className="w-full"
                // type="number"
                // slotProps={{
                //   htmlInput: {
                //     step: 0.1,
                //     min: 0,
                //   },
                // }}
              />
              <div>{errors.factor?.message && <ErrorInputAtom errorMessage={errors.factor?.message} />}</div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
