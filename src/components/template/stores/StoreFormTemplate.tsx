"use client";

import { storeValidationSchema } from "@/@types/validators/storeValidators";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StoreDto } from "@/@types/dto/StoreDto";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IFilterCriteria } from "@/@types/interfaces/ISearch";
import { getAllStoreKeepers, getStoreById } from "@/services/loadData";
import { IStoreKeeper } from "@/@types/interfaces/IStorKeeper";
import { useAppStore } from "@/store";
import { IStore } from "@/@types/interfaces/IStore";
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
import { MobileFieldAtom } from "@/components/atom/MobileFieldAtom";

interface IStoreFormTemplateProps {
  tenantId: string;
  storeId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

const filterCriteria: IFilterCriteria = {
  page: 1,
  pageSize: 20,
  search: "",
  readDto: {
    searchRoles: "",
    searchBranchs: "",
  },
  sortColumn: "",
  sortColumnDirection: "asc",
};

export default function StoreFormTemplate({ tenantId, storeId, isEdit, isView }: Readonly<IStoreFormTemplateProps>) {
  const { t, i18n } = useTranslation();
  const [isModalSavedOpen, setIsModalSavedOpen] = useState<boolean>(false);
  const { isHttpClientLoading } = useAppStore();
  const { push } = useRouter();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<StoreDto>({
    defaultValues: new StoreDto({ countryMobileId: "SA" }),
    resolver: valibotResolver(storeValidationSchema),
  });

  const { branch } = useAppStore();

  const [storeKeepers, setStoreKeeper] = useState<IStoreKeeper[]>([]);

  useEffect(() => {
    if (storeId && typeof storeId === "string") {
      getStoreById(i18n.language, tenantId, storeId)
        .then((res) => {
          if (res) {
            const data = new StoreDto({
              ...res,
              nameAr: res.names?.find((name) => name.language === "ar")?.value ?? "",
              nameEn: res.names?.find((name) => name.language === "en")?.value ?? "",
            });
            reset(data);
          }
        })
        .catch(console.log);
    }
    fetchStoreKeepers();
  }, [storeId]);

  function handleClearForm() {
    reset(new StoreDto());
  }

  async function handleCreate(storeData: StoreDto) {
    try {
      const response = await fetchClient<ResultHandler<IStore>>(EndPointsEnums.Store, {
        method: "POST",
        body: storeData,
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
      });

      // console.log(response);

      if (response.status) {
        push("/" + tenantId + "/stores");
        return;
      }
    } catch (error: any) {
      console.log(error);
    }
  }
  async function handleUpdate(storeData: StoreDto) {
    try {
      const response = await fetchClient<ResultHandler<IStore>>(EndPointsEnums.Store, {
        method: "PUT",
        body: storeData,
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
        params: {
          id: storeId,
        },
      });

      // console.log(response);

      if (response.status) {
        push("/" + tenantId + "/stores");
        return;
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  async function handleDelete() {
    try {
      const response = await fetchClient<ResultHandler<null>>(EndPointsEnums.Store, {
        method: "DELETE",
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
        params: {
          id: storeId,
        },
      });

      if (response.status) {
        // toaster for success
        push("/" + tenantId + "/stores");
        return;
      }

      // toaster for error
    } catch (error) {
      console.error("Error deleting user:", error);
      // toaster for error
    }
  }

  function fetchStoreKeepers() {
    getAllStoreKeepers(i18n.language, tenantId, { ...filterCriteria, selectColumns: [] })
      .then((res) => {
        console.log(res);
        setStoreKeeper(res?.listData ?? []);
      })
      .catch(console.log);
  }

  async function handleSubmitForm(storeData: StoreDto) {
    if (isView) return;
    storeData.names ??= [];

    if (storeData.nameEn) {
      storeData.names.push({
        id: null,
        language: "en",
        value: storeData.nameEn,
        localizationSetsId: null,
      });
    }

    if (storeData.nameAr) {
      storeData.names.push({
        id: null,
        language: "ar",
        value: storeData.nameAr,
        localizationSetsId: null,
      });
    }

    storeData.branchId = branch?.id;
    storeData.id = storeId;

    setIsModalSavedOpen(true);
    if (isEdit) {
      await handleUpdate(storeData);
    } else {
      await handleCreate(storeData);
    }
  }

  return (
    <div>
      <div className="w-full">
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <ModalSavedAtom isOpen={isModalSavedOpen} setIsOpen={setIsModalSavedOpen} isEdit={isEdit} />

          <div className="flex items-center justify-between">
            <MainCardTitleAtom title="Store data" />

            {!isView && (
              <div className="flex gap-3">
                {!isEdit && <CreateButtonAtom onClick={handleClearForm} />}

                <SaveButtonAtom />

                {isEdit && <DeleteButtonAtom onClick={handleDelete} />}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-10 bg-white border-solid border-[#E6E7EC] border rounded-md rounded-tr-none">
            {/*  */}
            <div>
              <LabelAtom labelMessage="Arabic store name" required />
              <TextFieldAtom
                disabled={isView || isHttpClientLoading}
                type="text"
                className="w-full"
                placeholder={t("Arabic store name")}
                {...register("nameAr")}
              />
              {errors.nameAr?.message && <ErrorInputAtom errorMessage={errors.nameAr?.message} />}
            </div>

            {/*  */}
            <div>
              <LabelAtom labelMessage="English store name" />
              <TextFieldAtom
                disabled={isView || isHttpClientLoading}
                type="text"
                className="w-full"
                placeholder={t("English store name")}
                {...register("nameEn")}
              />
              {errors.nameEn?.message && <ErrorInputAtom errorMessage={errors.nameEn?.message} />}
            </div>

            {/*  */}
            <div>
              <LabelAtom labelMessage="Mobile" />
              <MobileFieldAtom control={control} name="mobile" />

              {errors.mobile?.message && <ErrorInputAtom errorMessage={errors.mobile?.message} />}
              {errors.countryMobileId?.message && <ErrorInputAtom errorMessage={errors.countryMobileId?.message} />}
            </div>

            {/*  */}
            <div>
              <LabelAtom
                labelMessage="Store keeper name"
                className=" text-lg leading-normal whitespace-nowrap text-ellipsis"
                required
              />
              <Controller
                control={control}
                name="storeKeeperId"
                render={({ field: { value, onChange } }) => (
                  <DropdownBoxAtom
                    options={storeKeepers}
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
              {errors.storeKeeperId?.message && <ErrorInputAtom errorMessage={errors.storeKeeperId?.message} />}
            </div>

            {/* mobile */}
            <div>
              <LabelAtom labelMessage="Telephone" />
              <TextFieldAtom
                disabled={isView || isHttpClientLoading}
                type="text"
                placeholder={t("Telephone")}
                {...register("telephone")}
                className="w-full h-12 py-1 mt-2 text-lg border-2 rounded-lg"
              />
              {errors.telephone?.message && <ErrorInputAtom errorMessage={errors.telephone?.message} />}
            </div>

            {/*  */}
            <div>
              <LabelAtom labelMessage="Address" />
              <TextFieldAtom className="w-full" type="text" placeholder={t("Enter Address")} {...register("address")} />
              {errors.address?.message && <ErrorInputAtom errorMessage={errors.address?.message} />}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
