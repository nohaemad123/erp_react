"use client";

import React, { useState } from "react";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import fetchClient from "@/lib/fetchClient";
import { ResultHandler } from "@/@types/classes/ResultHandler";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import { useRouter } from "next/navigation";
import { RepresentativeDto } from "@/@types/dto/RepresentativeDto";
import { representativeValidatorsSchema } from "@/@types/validators/representativeValidators";
import { useEffect } from "react";
import { IRepresentative, IRepresentativeRegion } from "@/@types/interfaces/IRepresentative";
import { getAllCommissionType, getAllRegions, getRepresentativeById } from "@/services/loadData";
import { IRegion } from "@/@types/interfaces/IRegion";
import { ICommissionType } from "@/@types/interfaces/ICommissionType";
import { useAppStore } from "@/store";
import { Checkbox, InputAdornment } from "@mui/material";
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

interface IRepresentativeFormTemplateProps {
  tenantId: string;
  representativeId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function RepresentativesFormTemplate({
  tenantId,
  representativeId,
  isEdit,
  isView,
}: Readonly<IRepresentativeFormTemplateProps>) {
  const [isModalSavedOpen, setIsModalSavedOpen] = useState<boolean>(false);

  const { t, i18n } = useTranslation();
  const { push } = useRouter();
  const { isHttpClientLoading, branch } = useAppStore();
  const [regions, setRegions] = useState<IRegion[]>([]);
  const [_regionObj, setRegionObj] = useState<{ [key: string]: IRegion | undefined }>({});
  const [commissionType, setCommissionType] = useState<ICommissionType[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    getValues,
  } = useForm<RepresentativeDto>({
    defaultValues: new RepresentativeDto({ countryMobileId: "SA" }),
    resolver: valibotResolver(representativeValidatorsSchema),
  });

  // Function to fetch user role data
  function fetchAllRegions() {
    getAllRegions(i18n.language, tenantId)
      .then((res) => {
        setRegions(res?.listData ?? []);
        if (res?.listData) {
          const obj: { [key: string]: IRegion | undefined } = {};
          for (const region of res.listData) {
            obj[region.id] = region;
          }
          setRegionObj(obj);
        }
      })
      .catch(console.log);
  }

  // Function to fetch Commission Type data
  function fetchAllCommissionType() {
    getAllCommissionType(i18n.language, tenantId)
      .then((res) => {
        setCommissionType(res ?? []);
      })
      .catch(console.log);
  }

  useEffect(() => {
    if (representativeId && typeof representativeId === "string") {
      getRepresentativeById(i18n.language, tenantId, representativeId)
        .then((res) => {
          if (res) {
            console.log(res);
            reset(new RepresentativeDto({ ...res }));
          }
        })
        .catch(console.log);
    }
    fetchAllRegions();
    fetchAllCommissionType();
  }, [representativeId]);

  async function handleCreate(representativeData: RepresentativeDto) {
    console.log(representativeData);

    try {
      const response = await fetchClient<ResultHandler<IRepresentative>>(EndPointsEnums.REPRESENTATIVE, {
        method: "POST",
        body: representativeData,
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
      });

      // console.log(response);

      if (response.status) {
        push("/" + tenantId + "/representatives");
        return;
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  async function handleUpdate(representativeData: RepresentativeDto) {
    console.log(representativeData);

    representativeData.regonIds = representativeData.regonIds.map((x) => ({ regionId: x.regionId }));
    try {
      const response = await fetchClient<ResultHandler<IRepresentative>>(EndPointsEnums.REPRESENTATIVE, {
        method: "PUT",
        body: representativeData,
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
        params: {
          id: representativeId,
        },
      });

      // console.log(response);

      if (response.status) {
        push("/" + tenantId + "/representatives");
        return;
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  // Function to handle form submission
  async function handleSubmitForm(representativeData: RepresentativeDto) {
    if (isView) return;

    representativeData.branchId = branch?.id ?? "";
    const body = {
      ...representativeData,
      telephone: getValues("telephone").replace(/\s+/g, ""),
    };
    setIsModalSavedOpen(true);

    if (isEdit) {
      await handleUpdate(body);
    } else {
      await handleCreate(body);
    }
  }

  // Function to clear the form
  function handleClearForm() {
    reset(new RepresentativeDto());
  }

  async function handleDelete() {
    try {
      const response = await fetchClient<ResultHandler<null>>(EndPointsEnums.REPRESENTATIVE, {
        method: "DELETE",
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
        params: {
          id: representativeId,
        },
      });

      if (response.status) {
        // toaster for success
        push("/" + tenantId + "/representatives");
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

        {/* Buttons */}
        <div className="flex items-center justify-between">
          <MainCardTitleAtom title="Representative Information" />

          {!isView && (
            <div className="flex gap-3">
              {!isEdit && <CreateButtonAtom onClick={handleClearForm} />}
              <SaveButtonAtom />

              {isEdit && <DeleteButtonAtom onClick={handleDelete} />}
            </div>
          )}
        </div>

        {/* controls */}
        <div className="p-10 bg-white border-solid border-[#E6E7EC] border rounded-md rounded-tr-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* name */}
            <div>
              <LabelAtom labelMessage={t("Representative name")} required />
              <TextFieldAtom
                disabled={isView || isHttpClientLoading}
                type="text"
                placeholder={t("Enter representative name")}
                className="w-full text-base"
                {...register("name")}
              />
              {errors.name?.message && <ErrorInputAtom errorMessage={errors.name?.message} />}
            </div>

            {/* Region */}
            <div>
              <LabelAtom labelMessage="Region name" />
              <Controller
                control={control}
                name="regonIds"
                render={({ field: { value, onChange } }) => (
                  <DropdownBoxAtom
                    options={regions.map((x) => {
                      const curr: IRepresentativeRegion = {
                        regionId: x.id,
                        name: x.name,
                      };
                      return curr;
                    })}
                    value={value}
                    placeholder="Select Region"
                    filter={["name"]}
                    keepOpen
                    fullWidth
                    optionRender={(item) => item.name}
                    valueSelector={(item) => item.regionId}
                    triggerLabelDisplay={(value) => value?.name ?? ""}
                    onSelect={(item) => {
                      if (value.some((x) => x.regionId === item.regionId)) {
                        onChange(value.filter((x) => x.regionId !== item.regionId));
                      } else {
                        onChange([...value, item]);
                      }
                    }}
                  />
                )}
              />
              {errors.regonIds?.message && <ErrorInputAtom errorMessage={errors.regonIds?.message} />}
            </div>

            {/* Mobile */}
            <div>
              <LabelAtom labelMessage="Mobile" />
              <MobileFieldAtom control={control} name="mobile" />
              {errors.mobile?.message && <ErrorInputAtom errorMessage={errors.mobile?.message} />}
              {errors.countryMobileId?.message && <ErrorInputAtom errorMessage={errors.countryMobileId?.message} />}
            </div>

            {/* another telephone */}
            <div>
              <LabelAtom labelMessage="another Mobile" />
              <MobileFieldAtom control={control} name="telephone" />
              {errors.telephone?.message && <ErrorInputAtom errorMessage={errors.telephone?.message} />}

              {errors.countryMobileId?.message && <ErrorInputAtom errorMessage={errors.countryMobileId?.message} />}
            </div>

            {/* address */}
            <div>
              <LabelAtom labelMessage="Address" />
              <TextFieldAtom
                disabled={isView || isHttpClientLoading}
                type="text"
                placeholder={t("Enter Address")}
                className="w-full text-base"
                {...register("address")}
              />
              {errors.address?.message && <ErrorInputAtom errorMessage={errors.address?.message} />}
            </div>
          </div>

          <div
            style={{
              width: "fit-content",
              padding: "7px 13px",
              fontWeight: "400",
              boxShadow: "0px 4px 10px #7090B01F",
              color: "#226AB2",
              margin: "16px 0",
            }}
          >
            {t("sales commission")}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* commission Type Id */}
            <div>
              <LabelAtom labelMessage="Commission type" />
              <Controller
                control={control}
                name="commissionTypeId"
                render={({ field: { value, onChange } }) => (
                  <DropdownBoxAtom
                    options={commissionType}
                    value={value}
                    keySelector={(item) => item.key ?? Date.now()}
                    valueSelector={(item) => item.key}
                    fullWidth
                    optionRender={(item) => item?.value}
                    triggerLabelDisplay={(item) => item?.value}
                    filter={["value"]}
                    onSelect={(item) => {
                      onChange(item.key);
                    }}
                  />
                )}
              />

              {errors.commissionTypeId?.message && <ErrorInputAtom errorMessage={errors.commissionTypeId?.message} />}
            </div>

            {/* commission Rate */}
            <div>
              <LabelAtom labelMessage="Commission value" />
              <TextFieldAtom
                disabled={isView || isHttpClientLoading}
                type="text"
                placeholder={t("Enter percentage commission")}
                {...register("commissionRate")}
                className="w-full text-base"
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start">%</InputAdornment>,
                  },
                }}
              />
              {errors.commissionRate?.message && <ErrorInputAtom errorMessage={errors.commissionRate?.message} />}
            </div>

            {/* collection Commission */}
            <div>
              <LabelAtom labelMessage="collection Commission" />
              <TextFieldAtom
                disabled={isView || isHttpClientLoading}
                type="text"
                placeholder={t("Enter collection Commission")}
                {...register("collectionCommission")}
                className="w-full text-base"
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start">%</InputAdornment>,
                  },
                }}
              />
              {errors.collectionCommission?.message && <ErrorInputAtom errorMessage={errors.collectionCommission?.message} />}
            </div>

            {/* sendDataToMail */}
            <div className="m-0 bg-[#E5EEF9] flex items-center gap-2">
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
              <LabelAtom labelMessage="stop dealing" sx={{ mb: 0 }} />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
