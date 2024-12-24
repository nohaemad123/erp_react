"use client";

import { ResultHandler } from "@/@types/classes/ResultHandler";
import { ExpenseDto } from "@/@types/dto/ExpenseDto";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import { IExpense } from "@/@types/interfaces/IExpense";
import { expenseValidationSchema } from "@/@types/validators/expenseValidators";
import { CreateButtonAtom } from "@/components/atom/CreateButtonAtom";
import { DeleteButtonAtom } from "@/components/atom/DeleteButtonAtom";
import { ErrorInputAtom } from "@/components/atom/ErrorInputAtom";
import LabelAtom from "@/components/atom/LabelAtom";
import { MainCardTitleAtom } from "@/components/atom/MainCardTitleAtom";
import ModalSavedAtom from "@/components/atom/ModalSavedAtom";
import { SaveButtonAtom } from "@/components/atom/SaveButtonAtom";
import { TextFieldAtom } from "@/components/atom/TextFieldAtom";
import fetchClient from "@/lib/fetchClient";
import { getExpenseById } from "@/services/loadData";
import { useAppStore } from "@/store";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface IExpenseFormTemplateProps {
  tenantId: string;
  expenseId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function ExpenseFormTemplate({ tenantId, expenseId, isEdit, isView }: Readonly<IExpenseFormTemplateProps>) {
  const [isModalSavedOpen, setIsModalSavedOpen] = useState<boolean>(false);
  const { t, i18n } = useTranslation();
  const { push } = useRouter();
  const { isHttpClientLoading } = useAppStore();
  const { branch } = useAppStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ExpenseDto>({
    defaultValues: new ExpenseDto(),
    resolver: valibotResolver(expenseValidationSchema),
  });

  useEffect(() => {
    if (expenseId && typeof expenseId === "string") {
      getExpenseById(i18n.language, tenantId, expenseId)
        .then((res) => {
          if (res) {
            const data = new ExpenseDto({
              ...res,
              nameAr: res.names.find((name) => name.language === "ar")?.value,
              nameEn: res.names.find((name) => name.language === "en")?.value,
            });
            reset(data);
          }
        })
        .catch(console.log);
    }
  }, [expenseId]);

  async function handleCreate(expenseData: ExpenseDto) {
    try {
      const response = await fetchClient<ResultHandler<IExpense>>(EndPointsEnums.EXPENSE, {
        method: "POST",
        body: expenseData,
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
      });

      // console.log(response);

      if (response.status) {
        push("/" + tenantId + "/expenses");
        return;
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  async function handleUpdate(expenseData: ExpenseDto) {
    try {
      const response = await fetchClient<ResultHandler<IExpense>>(EndPointsEnums.EXPENSE, {
        method: "PUT",
        body: expenseData,
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
        params: {
          id: expenseId,
        },
      });

      // console.log(response);

      if (response.status) {
        push("/" + tenantId + "/expenses");
        return;
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  // Function to handle form submission
  async function handleSubmitForm(expenseData: ExpenseDto) {
    if (isView) return;

    expenseData.names ??= [];

    if (expenseData.nameEn) {
      expenseData.names.push({
        id: null,
        language: "en",
        value: expenseData.nameEn,
        localizationSetsId: null,
      });
    }

    if (expenseData.nameAr) {
      expenseData.names.push({
        id: null,
        language: "ar",
        value: expenseData.nameAr,
        localizationSetsId: null,
      });
    }

    expenseData.branchId = branch?.id;
    expenseData.id = expenseId;
    setIsModalSavedOpen(true);
    if (isEdit) {
      await handleUpdate(expenseData);
    } else {
      await handleCreate(expenseData);
    }
  }

  // Function to clear the form
  function handleClearForm() {
    reset(new ExpenseDto());
  }

  async function handleDelete() {
    try {
      const response = await fetchClient<ResultHandler<null>>(EndPointsEnums.EXPENSE, {
        method: "DELETE",
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
        params: {
          id: expenseId,
        },
      });

      if (response.status) {
        // "toaster for success
        push("/" + tenantId + "/expenses");
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
            <MainCardTitleAtom title="expenses data" />

            {!isView && (
              <div className="flex gap-3">
                {!isEdit && <CreateButtonAtom onClick={handleClearForm} />}

                <SaveButtonAtom />

                {isEdit && <DeleteButtonAtom onClick={handleDelete} />}
              </div>
            )}
          </div>

          {/* controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 p-10 bg-white border-solid border-[#E6E7EC] border rounded-md rounded-tr-none">
            {/*  */}
            <div>
              <LabelAtom labelMessage="Arabic expense name" required />
              <TextFieldAtom
                type="text"
                disabled={isView || isHttpClientLoading}
                placeholder={t("Arabic expense name")}
                {...register("nameAr")}
                className="w-full"
              />
              {errors.nameAr?.message && <ErrorInputAtom errorMessage={errors.nameAr?.message} />}
            </div>

            {/*  */}
            <div>
              <LabelAtom labelMessage="English expense name" />
              <TextFieldAtom
                type="text"
                disabled={isView || isHttpClientLoading}
                placeholder={t("English expense name")}
                {...register("nameEn")}
                className="w-full"
              />
              {errors.nameEn?.message && <ErrorInputAtom errorMessage={errors.nameEn?.message} />}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
