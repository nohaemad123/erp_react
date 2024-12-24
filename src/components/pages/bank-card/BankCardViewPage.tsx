"use client";
import { ResultHandler } from "@/@types/classes/ResultHandler";
import { SearchDto } from "@/@types/dto/SearchDto";
import { searchValidationSchema } from "@/@types/validators/searchValidators";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import { IPagination } from "@/@types/interfaces/IPagination";
import fetchClient from "@/lib/fetchClient";
import { useAppStore } from "@/store";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { getAllBankCards } from "@/services/loadData";
import { IBankCard } from "@/@types/interfaces/IBankCard";

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
  selectColumns: ["id", "name", "bankName", "discountPercentage", "createdOn"],
});

interface IBankCardViewPageProps {
  tenantId: string;
}

export default function BankCardViewPage({ tenantId }: Readonly<IBankCardViewPageProps>) {
  const { t, i18n } = useTranslation();
  const { isHttpClientLoading } = useAppStore();
  const [deletedPopup, setDeletedPopup] = useState<IBankCard | null>(null);
  const handleClose = () => setDeletedPopup(null);
  const [rows, setRows] = useState<IBankCard[]>([]);
  const [pagination, setPagination] = useState<IPagination>();
  const { reset, register, handleSubmit, getValues, setValue, watch } = useForm<SearchDto>({
    defaultValues: { ...initSearchValues },
    resolver: valibotResolver(searchValidationSchema),
  });

  useEffect(() => {
    fetchBankCards(getValues());
  }, [tenantId, watch("page"), watch("pageSize")]);

  function handleSubmitForm(values: SearchDto) {
    fetchBankCards(values);
  }

  function fetchBankCards(params: SearchDto) {
    getAllBankCards(i18n.language, tenantId, params)
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
      const response = await fetchClient<ResultHandler<null>>(EndPointsEnums.BANK_CARD, {
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
        fetchBankCards(getValues());
      } else {
        console.error("Error deleting user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }

  return (
    <div className="w-full">
      <div className="w-full p-8">
        <form className="w-full p-8 bg-white rounded-md" onSubmit={handleSubmit(handleSubmitForm)}>
          <div className="flex justify-between items-center mb-6">
            <p className="text-lg font-normal">{t("Search and filter")}</p>
            <div className="flex gap-4">
              <SearchButtonAtom />
              <ResetButtonAtom
                disabled={isHttpClientLoading}
                type="button"
                onClick={() => {
                  reset({ ...initSearchValues, page: getValues("page"), pageSize: getValues("pageSize") });
                  fetchBankCards({ ...initSearchValues, page: getValues("page"), pageSize: getValues("pageSize") });
                }}
              />
            </div>
          </div>

          <div>
            <LabelAtom labelMessage="Card name" />
            <TextFieldAtom disabled={isHttpClientLoading} placeholder={t("Card name")} {...register("search")} className="w-full" />
          </div>
        </form>

        <div className="flex items-center justify-between mt-8">
          <MainCardTitleAtom totalCount={pagination?.totalCount} title="Banks cards" />
          <div className="flex">
            <AddNewButtonAtom href={"/" + tenantId + "/bank-cards/add"} />
          </div>
        </div>

        <TableAtom aria-label="Bank Card data">
          <TableAtom.THead>
            <TableAtom.TRow>
              <TableAtom.TCell component="th">#</TableAtom.TCell>
              <TableAtom.TCell component="th">{t("Card name")}</TableAtom.TCell>
              <TableAtom.TCell component="th">{t("Bank name")}</TableAtom.TCell>
              <TableAtom.TCell component="th">{t("Discount percentage")}</TableAtom.TCell>
              <TableAtom.TCell component="th">{t("Created on")}</TableAtom.TCell>
              <TableAtom.TCell component="th">{""}</TableAtom.TCell>
            </TableAtom.TRow>
          </TableAtom.THead>
          <TableAtom.TBody>
            {rows.map((item, index) => (
              <TableAtom.TRow key={item?.id}>
                <TableAtom.TCell>{index + 1}</TableAtom.TCell>
                <TableAtom.TCell>{item.name}</TableAtom.TCell>
                <TableAtom.TCell>{item.bankName}</TableAtom.TCell>
                <TableAtom.TCell>{item.discountPercentage}</TableAtom.TCell>
                <TableAtom.TCell>
                  {item?.createdOn ? new Date(item.createdOn).toLocaleDateString("en", { dateStyle: "medium" }) : ""}
                </TableAtom.TCell>
                <TableAtom.TCellEnd
                  viewLink={"/" + tenantId + "/bank-cards/" + item?.id}
                  editLink={"/" + tenantId + "/bank-cards/" + item?.id + "/edit"}
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
          changePaginationHandler={(_e, page) => {
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
        titleMessage="Delete bank card?"
        descriptionMessage="When you delete the bank card, you will lose all the bank card information and it will be transferred to the deleted list"
      />
    </div>
  );
}
