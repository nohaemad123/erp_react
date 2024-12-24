"use client";

import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import fetchClient from "@/lib/fetchClient";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import { useRouter } from "next/navigation";
import { ResultHandler } from "@/@types/classes/ResultHandler";
import { IBranch } from "@/@types/interfaces/IBranch";
import { useEffect, useState } from "react";
import { getAllProductGroups, getProductGroupById } from "@/services/loadData";
import { useAppStore } from "@/store";
import { ProductGroupDto } from "@/@types/dto/ProductGroupDto";
import { IProductGroup } from "@/@types/interfaces/IProductGroup";
import { productGroupValidationSchema } from "@/@types/validators/productGroupsValidators";
import { Checkbox } from "@mui/material";
import LabelAtom from "@/components/atom/LabelAtom";
import { TextFieldAtom } from "@/components/atom/TextFieldAtom";
import { ErrorInputAtom } from "@/components/atom/ErrorInputAtom";
import ModalSavedAtom from "@/components/atom/ModalSavedAtom";
import { SaveButtonAtom } from "@/components/atom/SaveButtonAtom";
import { CreateButtonAtom } from "@/components/atom/CreateButtonAtom";
import { DeleteButtonAtom } from "@/components/atom/DeleteButtonAtom";
import { MainCardTitleAtom } from "@/components/atom/MainCardTitleAtom";
import DropdownBoxAtom from "@/components/atom/DropdownBoxAtom";

interface IProductGroupFormTemplateProps {
  tenantId: string;
  productGroupId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function ProductGroupFormTemplate({
  tenantId,
  productGroupId,
  isEdit,
  isView,
}: Readonly<IProductGroupFormTemplateProps>) {
  const { t, i18n } = useTranslation();
  const { push } = useRouter();
  const { isHttpClientLoading } = useAppStore();
  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProductGroupDto>({
    defaultValues: new ProductGroupDto(),
    resolver: valibotResolver(productGroupValidationSchema),
  });
  const [productGroup, setProductGroup] = useState<IProductGroup[]>([]);
  const [isModalSavedOpen, setIsModalSavedOpen] = useState<boolean>(false);

  // Function to fetch Commission Type data
  function fetchAllProductGroup() {
    getAllProductGroups(i18n.language, tenantId)
      .then((res) => {
        setProductGroup(res?.listData ?? []);
      })
      .catch(console.log);
  }

  useEffect(() => {
    if (productGroupId && typeof productGroupId === "string") {
      getProductGroupById(i18n.language, tenantId, productGroupId)
        .then((res) => {
          console.log(res);
          if (res) {
            const data = new ProductGroupDto({
              ...res,
              nameAr: res.names.find((name) => name.language === "ar")?.value ?? "",
              nameEn: res.names.find((name) => name.language === "en")?.value ?? "",
            });
            reset(data);
          }
        })
        .catch(console.log);
    }
    fetchAllProductGroup();
  }, [productGroupId]);

  async function handleCreate(productGroupData: ProductGroupDto) {
    console.log(productGroupData);

    try {
      const response = await fetchClient<ResultHandler<IBranch>>(EndPointsEnums.PRODUCT_GROUP, {
        method: "POST",
        body: productGroupData,
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
      });

      // const responseData = await response;
      // console.log("register successful", response);

      if (response.status) {
        push("/" + tenantId + "/product-groups");
        return;
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  async function handleUpdate(productGroupData: ProductGroupDto) {
    try {
      const response = await fetchClient<ResultHandler<IBranch>>(EndPointsEnums.PRODUCT_GROUP, {
        method: "PUT",
        body: productGroupData,
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
        params: {
          id: productGroupId,
        },
      });

      // console.log(response);

      if (response.status) {
        push("/" + tenantId + "/product-groups");
        return;
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  async function handleSubmitForm(productGroupData: ProductGroupDto) {
    if (isView) return;

    productGroupData.names ??= [];

    if (productGroupData.name) {
      productGroupData.names.push({
        id: null,
        language: "ar",
        value: productGroupData.name,
        localizationSetsId: null,
      });
    }

    setIsModalSavedOpen(true);
    if (isEdit) {
      await handleUpdate(productGroupData);
    } else {
      await handleCreate(productGroupData);
    }
  }

  function handleClearForm() {
    reset(new ProductGroupDto());
  }

  async function handleDelete() {
    try {
      const response = await fetchClient<ResultHandler<null>>(EndPointsEnums.PRODUCT_GROUP, {
        method: "DELETE",
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
        params: {
          id: productGroupId,
        },
      });

      if (response.status) {
        // toaster for success
        push("/" + tenantId + "/product-groups");
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

        <div className="flex items-center justify-between">
          <MainCardTitleAtom title="Product Group Information" />

          {!isView && (
            <div className="flex gap-3">
              {!isEdit && <CreateButtonAtom onClick={handleClearForm} />}

              <SaveButtonAtom />
              {isEdit && <DeleteButtonAtom onClick={handleDelete} />}
            </div>
          )}
        </div>

        {/* controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-10 bg-white border-solid border-[#E6E7EC] border rounded-md rounded-tr-none">
          {/* name */}
          <div>
            <LabelAtom labelMessage="Product Group name" required />
            <TextFieldAtom
              disabled={isView || isHttpClientLoading}
              placeholder={t("Enter Product Group name")}
              className="w-full"
              {...register("name")}
            />
            {errors.name?.message && <ErrorInputAtom errorMessage={errors.name?.message} />}
          </div>

          {/* parent Id */}
          <div>
            <LabelAtom labelMessage="Main Group" />
            <Controller
              control={control}
              name="parentId"
              render={({ field: { value, onChange } }) => (
                <DropdownBoxAtom
                  options={productGroup}
                  value={value}
                  keySelector={(item) => item?.id ?? Date.now()}
                  valueSelector={(item) => item?.id}
                  fullWidth
                  optionRender={(item) => item?.name}
                  triggerLabelDisplay={(item) => item.name ?? ""}
                  filter={["name"]}
                  onSelect={(item) => {
                    onChange(item.id);
                  }}
                />
              )}
            />
            {errors.parentId?.message && <ErrorInputAtom errorMessage={errors.parentId?.message} />}
          </div>

          {/* is Transaction Suspended */}
          <div className="bg-[#E5EEF9] flex items-center p-3 mt-4">
            <Controller
              control={control}
              name="isTransactionSuspended"
              render={({ field: { value, onChange } }) => (
                <Checkbox
                  checked={value}
                  onChange={(e) => {
                    onChange(e.target.checked);
                  }}
                  disabled={isView || isHttpClientLoading}
                />
              )}
            />
            <LabelAtom labelMessage="stop dealing" sx={{ fontSize: "14px", fontWeight: "400", m: 0 }} />
          </div>
        </div>
      </form>
    </div>
  );
}
