"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { getAllExpenses } from "@/services/loadData";
import { SearchDto } from "@/@types/dto/SearchDto";
import { useAppStore } from "@/store";
import { IPagination } from "@/@types/interfaces/IPagination";
import { ResultHandler } from "@/@types/classes/ResultHandler";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import fetchClient from "@/lib/fetchClient";
import { IExpense } from "@/@types/interfaces/IExpense";
import LabelAtom from "@/components/atom/LabelAtom";
import { TextFieldAtom } from "@/components/atom/TextFieldAtom";
import ModalDeleteAtom from "@/components/atom/ModalDeleteAtom";
import { ResetButtonAtom } from "@/components/atom/ResetButtonAtom";
import { SearchButtonAtom } from "@/components/atom/SearchButtonAtom";
import AddNewButtonAtom from "@/components/atom/AddNewButtonAtom";
import { PaginationAtom } from "@/components/atom/PaginationAtom";
import TableAtom from "@/components/atom/TableAtom";
import { MainCardTitleAtom } from "@/components/atom/MainCardTitleAtom";

const initSearchValues = new SearchDto({
  selectColumns: ["id", "name", "createdOn"],
});

interface IViewExpensePageProps {
  tenantId: string;
}

export default function ViewExpensePage({ tenantId }: Readonly<IViewExpensePageProps>) {
  const { t, i18n } = useTranslation();
  const { isHttpClientLoading } = useAppStore();
  const [deletedPopup, setDeletedPopup] = useState<IExpense | null>(null);
  const handleClose = () => setDeletedPopup(null);
  const [rows, setRows] = useState<IExpense[]>([]);
  const [pagination, setPagination] = useState<IPagination>();
  const { reset, register, handleSubmit, getValues, setValue, watch } = useForm<SearchDto>({
    defaultValues: { ...initSearchValues },
  });

  useEffect(() => {
    fetchExpenses(getValues());
  }, [tenantId, watch("page"), watch("pageSize")]);

  function handleSubmitForm(values: SearchDto) {
    console.log(values);
    fetchExpenses(values);
  }

  function fetchExpenses(params: SearchDto) {
    getAllExpenses(i18n.language, tenantId, params)
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
      const response = await fetchClient<ResultHandler<null>>(EndPointsEnums.EXPENSE, {
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
        fetchExpenses(getValues());
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
            <p className="text-lg font-normal">{t("Search and filter")}</p>
            <div className="flex gap-4">
              <SearchButtonAtom />
              <ResetButtonAtom
                disabled={isHttpClientLoading}
                type="button"
                onClick={() => {
                  reset({ ...initSearchValues, page: getValues("page"), pageSize: getValues("pageSize") });
                  fetchExpenses({ ...initSearchValues, page: getValues("page"), pageSize: getValues("pageSize") });
                }}
              />
            </div>
          </div>

          {/* Controls */}
          <div>
            <LabelAtom labelMessage="Expense name" />
            <TextFieldAtom className="w-full" placeholder={t("Expense name")} {...register("search")} />
          </div>
        </form>

        <div className="flex items-center justify-between mt-8">
          <MainCardTitleAtom title="Expenses" totalCount={pagination?.totalCount} />

          <div className="flex">
            <AddNewButtonAtom href={"/" + tenantId + "/expenses/add"} />
          </div>
        </div>

        <TableAtom aria-label="Bank Card data">
          <TableAtom.THead>
            <TableAtom.TRow>
              <TableAtom.TCell component="th">#</TableAtom.TCell>
              <TableAtom.TCell component="th">{t("Expense name")}</TableAtom.TCell>
              <TableAtom.TCell component="th">{t("Created on")}</TableAtom.TCell>
              <TableAtom.TCell component="th">{""}</TableAtom.TCell>
            </TableAtom.TRow>
          </TableAtom.THead>
          <TableAtom.TBody>
            {rows.map((item, index) => (
              <TableAtom.TRow key={item?.id}>
                <TableAtom.TCell>{index + 1}</TableAtom.TCell>
                <TableAtom.TCell>{item?.name}</TableAtom.TCell>
                <TableAtom.TCell>
                  {item?.createdOn ? new Date(item.createdOn).toLocaleDateString("en", { dateStyle: "medium" }) : ""}
                </TableAtom.TCell>
                <TableAtom.TCellEnd
                  viewLink={"/" + tenantId + "/expenses/" + item?.id}
                  editLink={"/" + tenantId + "/expenses/" + item?.id + "/edit"}
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
        titleMessage="Delete expense?"
        descriptionMessage="When you delete the expense, you will lose all the expense information and it will be transferred to the deleted list"
      />
    </div>
  );
}
