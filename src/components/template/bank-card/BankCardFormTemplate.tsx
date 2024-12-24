"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BankCardDto } from "@/@types/dto/BankCardDto";
import { bankCardValidationSchema } from "@/@types/validators/bankCardValidators";
import { Checkbox, FormControlLabel } from "@mui/material";
import { useAppStore } from "@/store";
import { useRouter } from "next/navigation";
import { getAllBanks, getBranchCardById } from "@/services/loadData";
import { useEffect, useState } from "react";
import { IBank } from "@/@types/interfaces/IBank";
import { IBankCard } from "@/@types/interfaces/IBankCard";
import { ResultHandler } from "@/@types/classes/ResultHandler";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import fetchClient from "@/lib/fetchClient";
import LabelAtom from "@/components/atom/LabelAtom";
import { TextFieldAtom } from "@/components/atom/TextFieldAtom";
import { ErrorInputAtom } from "@/components/atom/ErrorInputAtom";
import ModalSavedAtom from "@/components/atom/ModalSavedAtom";
import { SaveButtonAtom } from "@/components/atom/SaveButtonAtom";
import { CreateButtonAtom } from "@/components/atom/CreateButtonAtom";
import { DeleteButtonAtom } from "@/components/atom/DeleteButtonAtom";
import { MainCardTitleAtom } from "@/components/atom/MainCardTitleAtom";
import DropdownBoxAtom from "@/components/atom/DropdownBoxAtom";
import BankFormTemplate from "@/components/template/banks/BankFormTemplate";
import { getTranslatedName } from "@/@types/stables";

interface IBankCardFormTemplateProps {
  tenantId: string;
  bankCardId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function BankCardFormTemplate({ bankCardId, tenantId, isEdit, isView }: Readonly<IBankCardFormTemplateProps>) {
  const { t, i18n } = useTranslation();
  const [isModalSavedOpen, setIsModalSavedOpen] = useState<boolean>(false);

  const { push } = useRouter();
  const { isHttpClientLoading } = useAppStore();
  const [banks, setBanks] = useState<IBank[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<BankCardDto>({
    defaultValues: new BankCardDto(),
    resolver: valibotResolver(bankCardValidationSchema),
  });

  useEffect(() => {
    if (bankCardId && typeof bankCardId === "string") {
      getBranchCardById(i18n.language, tenantId, bankCardId)
        .then((res) => {
          if (res) {
            const data = new BankCardDto({
              ...res,
              nameAr: res.names?.find((name) => name.language === "ar")?.value ?? "",
              nameEn: res.names?.find((name) => name.language === "en")?.value ?? "",
            });
            reset(data);
          }
        })
        .catch(console.log);
    }
    fetchBanks();
  }, [bankCardId]);

  function fetchBanks() {
    getAllBanks(i18n.language, tenantId)
      .then((res) => {
        console.log(res);
        setBanks(res?.listData ?? []);
      })
      .catch(console.log);
  }

  async function handleSubmitForm(branchCardData: BankCardDto) {
    if (isView) return;

    branchCardData.names ??= [];

    if (branchCardData.nameEn) {
      branchCardData.names.push({
        id: null,
        language: "en",
        value: branchCardData.nameEn,
        localizationSetsId: null,
      });
    }

    if (branchCardData.nameAr) {
      branchCardData.names.push({
        id: null,
        language: "ar",
        value: branchCardData.nameAr,
        localizationSetsId: null,
      });
    }
    setIsModalSavedOpen(true);

    if (isEdit) {
      branchCardData.id = bankCardId;
      await handleUpdate(branchCardData);
    } else {
      await handleCreate(branchCardData);
    }
  }

  async function handleCreate(bankCardata: BankCardDto) {
    console.log(bankCardata);

    try {
      const response = await fetchClient<ResultHandler<IBankCard>>(EndPointsEnums.BANK_CARD, {
        method: "POST",
        body: bankCardata,
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
      });

      if (response.status) {
        push("/" + tenantId + "/bank-cards");
        return;
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  async function handleUpdate(bankCardata: BankCardDto) {
    console.log(bankCardata);

    try {
      const response = await fetchClient<ResultHandler<IBank>>(EndPointsEnums.BANK_CARD, {
        method: "PUT",
        body: bankCardata,
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
        params: {
          id: bankCardId,
        },
      });

      // console.log(response);

      if (response.status) {
        push("/" + tenantId + "/bank-cards");
        return;
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  function handleClearForm() {
    reset(new BankCardDto());
  }

  async function handleDelete() {
    try {
      const response = await fetchClient<ResultHandler<null>>(EndPointsEnums.BANK_CARD, {
        method: "DELETE",
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
        params: {
          id: bankCardId,
        },
      });

      if (response.status) {
        // toaster for success
        push("/" + tenantId + "/bank-cards");
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
            <MainCardTitleAtom title="Bank card data" />

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
              <LabelAtom labelMessage="Arabic bank card name" required />
              <TextFieldAtom
                placeholder={t("Arabic bank card name")}
                {...register("nameAr")}
                disabled={isView || isHttpClientLoading}
                className="w-full h-12 px-5 py-1 mt-2 text-lg border-2 rounded-lg"
              />
              {errors.nameAr?.message && <ErrorInputAtom errorMessage={errors.nameAr?.message} />}
            </div>

            <div>
              <LabelAtom labelMessage="English bank card name" />
              <TextFieldAtom
                placeholder={t("English bank card name")}
                {...register("nameEn")}
                disabled={isView || isHttpClientLoading}
                className="w-full"
              />
              {errors.nameEn?.message && <ErrorInputAtom errorMessage={errors.nameEn?.message} />}
            </div>

            {/*  */}
            <div>
              <LabelAtom labelMessage="Bank name" required />
              <Controller
                control={control}
                name="bankId"
                render={({ field: { value, onChange } }) => (
                  <DropdownBoxAtom
                    options={banks}
                    value={value}
                    keySelector={(item) => item.id ?? Date.now()}
                    valueSelector={(item) => item.id}
                    filter={["name", "names", "mobile", "code"]}
                    onSelect={(item) => {
                      onChange(item.id);
                    }}
                    fullWidth
                    optionRender={(item) => getTranslatedName(item.names ?? [], i18n.language) ?? item.name}
                    triggerLabelDisplay={(item) => item?.name ?? ""}
                    modalChildren={<BankFormTemplate tenantId={tenantId} />}
                  />
                )}
              />
              {errors.bankId?.message && <ErrorInputAtom errorMessage={errors.bankId?.message} />}
            </div>

            {/*  */}
            <div>
              <LabelAtom labelMessage="Discount rate" required />
              <Controller
                control={control}
                name="discountPercentage"
                render={({ field: { value, onChange } }) => (
                  <TextFieldAtom
                    disabled={isView || isHttpClientLoading}
                    className="w-full h-12 py-1 mt-2 text-lg border-2 rounded-lg"
                    slotProps={{
                      htmlInput: {
                        step: 0.1,
                      },
                    }}
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
              {errors.discountPercentage?.message && <ErrorInputAtom errorMessage={errors.discountPercentage?.message} />}
            </div>

            <div className="flex items-end mb-1">
              <Controller
                control={control}
                name="isDefault"
                render={({ field: { value, onChange } }) => (
                  <FormControlLabel
                    className="bg-[#E5EEF9]"
                    style={{ marginRight: 0, marginLeft: 0, width: "100%" }}
                    control={
                      <Checkbox
                        checked={value}
                        disabled={isView || isHttpClientLoading}
                        onChange={(e) => {
                          onChange(e.target.checked);
                        }}
                      />
                    }
                    label={t("default card")}
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
