"use client";

import { getAllRepresentatives } from "@/services/loadData";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SearchDto } from "@/@types/dto/SearchDto";
import { IPagination } from "@/@types/interfaces/IPagination";
import { useAppStore } from "@/store";
import { IRepresentative } from "@/@types/interfaces/IRepresentative";
import { ResultHandler } from "@/@types/classes/ResultHandler";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import fetchClient from "@/lib/fetchClient";
import Image from "next/image";
import active from "@/assets/images/active.svg";
import inactive from "@/assets/images/inactive.svg";
import LabelAtom from "@/components/atom/LabelAtom";
import { TextFieldAtom } from "@/components/atom/TextFieldAtom";
import ModalDeleteAtom from "@/components/atom/ModalDeleteAtom";
import { SearchButtonAtom } from "@/components/atom/SearchButtonAtom";
import { ResetButtonAtom } from "@/components/atom/ResetButtonAtom";
import AddNewButtonAtom from "@/components/atom/AddNewButtonAtom";
import { PaginationAtom } from "@/components/atom/PaginationAtom";
import TableAtom from "@/components/atom/TableAtom";
import { MainCardTitleAtom } from "@/components/atom/MainCardTitleAtom";

const initSearchValues = new SearchDto({
  readDto: { name: "", telephone: "" },
  selectColumns: ["id", "name", "mobile", "regons", "isTransactionSuspended", "createdOn"],
});

interface IViewRepresentativesPageProps {
  tenantId: string;
}

export default function ViewRepresentativesPage({ tenantId }: Readonly<IViewRepresentativesPageProps>) {
  const { t, i18n } = useTranslation();
  const { isHttpClientLoading } = useAppStore();
  const [deletedPopup, setDeletedPopup] = useState<IRepresentative | null>(null);
  const handleClose = () => setDeletedPopup(null);
  const [rows, setRows] = useState<IRepresentative[]>([]);
  const [pagination, setPagination] = useState<IPagination>();
  const { reset, register, handleSubmit, getValues, setValue, watch } = useForm<SearchDto>({
    defaultValues: { ...initSearchValues },
  });

  useEffect(() => {
    fetchRepresentatives(getValues());
  }, [tenantId, watch("page"), watch("pageSize")]);

  function handleSubmitForm(values: SearchDto) {
    console.log(values);
    fetchRepresentatives(values);
  }

  function fetchRepresentatives(params: SearchDto) {
    console.log(params);

    getAllRepresentatives(i18n.language, tenantId, params)
      .then((res) => {
        const indexedRows =
          res?.listData?.map((row, index) => ({
            ...row,
            index: index + 1,
          })) ?? [];
        setRows(indexedRows);
        setPagination(res?.paginationData);
        if (res) {
          setValue("page", res.paginationData.currentPage);
          setValue("pageSize", res.paginationData.pageSize);
        }
      })
      .catch(console.log);
  }

  async function handleDelete(id: any) {
    try {
      const response = await fetchClient<ResultHandler<null>>(EndPointsEnums.REPRESENTATIVE, {
        method: "DELETE",
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
        params: {
          id: id,
        },
      });

      if (response.status) {
        handleClose();
        fetchRepresentatives(getValues());
      } else {
        console.error("Error deleting");
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  }

  return (
    <div className="w-full">
      <div className="w-full p-8">
        <form className="w-full p-8 bg-white rounded-md" onSubmit={handleSubmit(handleSubmitForm)}>
          {/* Buttons */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-lg font-normal">{t("filter_search")}</p>
            <div className="flex gap-4">
              <SearchButtonAtom />
              <ResetButtonAtom
                disabled={isHttpClientLoading}
                type="button"
                onClick={() => {
                  reset({ ...initSearchValues, page: getValues("page"), pageSize: getValues("pageSize") });
                  fetchRepresentatives({ ...initSearchValues, page: getValues("page"), pageSize: getValues("pageSize") });
                }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/*  */}
            <div>
              <LabelAtom labelMessage="Representative name" />
              <TextFieldAtom
                disabled={isHttpClientLoading}
                placeholder={t("Enter representative name")}
                className="w-full"
                {...register("readDto.name")}
              />
            </div>

            {/*  */}
            <div>
              <LabelAtom labelMessage="Phone number" />
              <TextFieldAtom
                disabled={isHttpClientLoading}
                placeholder={t("enter phone number")}
                className="w-full"
                {...register("readDto.telephone")}
              />
            </div>
          </div>
        </form>

        <div className="flex items-center justify-between mt-8">
          <MainCardTitleAtom title="Representatives" totalCount={pagination?.totalCount} />

          <div className="flex">
            <AddNewButtonAtom href={"/" + tenantId + "/representatives/add"} />
          </div>
        </div>

        <TableAtom aria-label="Bank Card data">
          <TableAtom.THead>
            <TableAtom.TRow>
              <TableAtom.TCell component="th">#</TableAtom.TCell>
              <TableAtom.TCell component="th">{t("Representative name")}</TableAtom.TCell>
              <TableAtom.TCell component="th">{t("Mobile")}</TableAtom.TCell>
              <TableAtom.TCell component="th">{t("Region name")}</TableAtom.TCell>
              <TableAtom.TCell component="th">{t("status")}</TableAtom.TCell>
              <TableAtom.TCell component="th">{t("Created on")}</TableAtom.TCell>
              <TableAtom.TCell component="th"></TableAtom.TCell>
            </TableAtom.TRow>
          </TableAtom.THead>
          <TableAtom.TBody>
            {rows.map((item, index) => (
              <TableAtom.TRow key={item?.id}>
                <TableAtom.TCell>{index + 1}</TableAtom.TCell>
                <TableAtom.TCell>{item.name}</TableAtom.TCell>
                <TableAtom.TCell>{item.mobile}</TableAtom.TCell>
                <TableAtom.TCell>{item.regons}</TableAtom.TCell>
                <TableAtom.TCell>
                  <span
                    className={`flex items-center justify-center gap-2 px-2 py-1 rounded-[6px] w-[85px] ${item.isTransactionSuspended ? "bg-[#E3F6EB] text-[#3FB771]" : "bg-[#FCE3D6] text-[#D24A48]"}`}
                  >
                    {item.isTransactionSuspended ? (
                      <Image src={active} width={16} height={16} alt="status" />
                    ) : (
                      <Image src={inactive} width={16} height={16} alt="status" />
                    )}
                    {item.isTransactionSuspended ? t("Active") : t("Inactive")}
                  </span>
                </TableAtom.TCell>
                <TableAtom.TCell>
                  {item.createdOn && new Date(item.createdOn).toLocaleDateString("en", { dateStyle: "medium" })}
                </TableAtom.TCell>

                <TableAtom.TCellEnd
                  viewLink={"/" + tenantId + "/representatives/" + item?.id}
                  editLink={"/" + tenantId + "/representatives/" + item?.id + "/edit"}
                  onDelete={() => setDeletedPopup(item)}
                />
              </TableAtom.TRow>
            ))}
          </TableAtom.TBody>
        </TableAtom>

        <PaginationAtom
          page={watch("page")}
          changeSelectHandler={(val) => {
            setValue("page", 1);
            setValue("pageSize", +val.target.value);
          }}
          changePaginationHandler={(_, page) => {
            setValue("page", page);
          }}
          pageSize={watch("pageSize")}
          totalPages={pagination?.totalPages}
          totalCount={pagination?.totalCount}
        />
      </div>

      <ModalDeleteAtom
        isOpen={!!deletedPopup}
        deleteHandler={() => handleDelete(deletedPopup?.id)}
        closeHandler={handleClose}
        titleMessage="Delete representative?"
        descriptionMessage="When you delete the representative, you will lose all the representative information and it will be transferred to the deleted list"
      />
    </div>
  );
}
