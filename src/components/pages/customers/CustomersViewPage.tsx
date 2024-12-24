"use client";

import { ICustomer } from "@/@types/interfaces/ICustomer";
import { getAllCustomers } from "@/services/loadData";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SearchDto } from "@/@types/dto/SearchDto";
import { searchValidationSchema } from "@/@types/validators/searchValidators";
import { IPagination } from "@/@types/interfaces/IPagination";
import { useAppStore } from "@/store";
import { ResultHandler } from "@/@types/classes/ResultHandler";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import fetchClient from "@/lib/fetchClient";
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
  selectColumns: ["id", "name", "Mobile", "taxNumber", "balanceFirstDuration"],
  sortColumnDirection: "asc",
});

interface ICustomersViewPageProps {
  tenantId: string;
}

export default function CustomersViewPage({ tenantId }: Readonly<ICustomersViewPageProps>) {
  const { t, i18n } = useTranslation();
  const { isHttpClientLoading } = useAppStore();
  const [deletedPopup, setDeletedPopup] = useState<ICustomer | null>(null);
  const handleClose = () => setDeletedPopup(null);
  const [rows, setRows] = useState<ICustomer[]>([]);
  const [pagination, setPagination] = useState<IPagination>();
  const { reset, register, handleSubmit, getValues, setValue, watch } = useForm<SearchDto>({
    defaultValues: { ...initSearchValues },
    resolver: valibotResolver(searchValidationSchema),
  });

  useEffect(() => {
    fetchCustomers(initSearchValues);
  }, [tenantId]);

  function handleSubmitForm(values: SearchDto) {
    values.page = 1;
    fetchCustomers(values);
    setValue("page", 1);
  }

  function fetchCustomers(params: SearchDto) {
    getAllCustomers(i18n.language, tenantId, params)
      .then((res) => {
        const indexedRows =
          res?.listData?.map((row, index) => ({
            ...row,
            index: index + 1,
          })) ?? [];
        setRows(indexedRows);
        setPagination(res?.paginationData);
        setValue("pageSize", res?.paginationData.pageSize ?? 10);
      })
      .catch(console.log);
  }

  async function handleDelete(id?: string) {
    if (!id) return;
    try {
      const response = await fetchClient<ResultHandler<null>>(EndPointsEnums.CUSTOMER, {
        method: "DELETE",
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
        params: {
          id,
        },
      });

      if (response.status) {
        handleClose();
        fetchCustomers(getValues());
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
                  fetchCustomers({ ...initSearchValues, page: getValues("page"), pageSize: getValues("pageSize") });
                }}
              />
            </div>
          </div>

          <div>
            <LabelAtom labelMessage="Customer name" />
            <TextFieldAtom disabled={isHttpClientLoading} placeholder={t("Search")} {...register("search")} className="w-full" />
          </div>
        </form>

        <div className="flex items-center justify-between mt-8">
          <MainCardTitleAtom title="Customers" totalCount={pagination?.totalCount} />

          <div className="flex">
            <AddNewButtonAtom href={"/" + tenantId + "/customers/add"} />
          </div>
        </div>

        <TableAtom aria-label="Bank Card data">
          <TableAtom.THead>
            <TableAtom.TRow>
              <TableAtom.TCell component="th">#</TableAtom.TCell>
              <TableAtom.TCell component="th">{t("Customer name")}</TableAtom.TCell>
              <TableAtom.TCell component="th">{t("Mobile")}</TableAtom.TCell>
              <TableAtom.TCell component="th">{t("Tax Number")}</TableAtom.TCell>
              <TableAtom.TCell component="th">{t("balance")}</TableAtom.TCell>
              <TableAtom.TCell component="th">{""}</TableAtom.TCell>
            </TableAtom.TRow>
          </TableAtom.THead>
          <TableAtom.TBody>
            {rows.map((item, index) => (
              <TableAtom.TRow key={item?.id}>
                <TableAtom.TCell>{index + 1}</TableAtom.TCell>
                <TableAtom.TCell>{item.name}</TableAtom.TCell>
                <TableAtom.TCell>{item.mobile}</TableAtom.TCell>
                <TableAtom.TCell>{item.taxNumber}</TableAtom.TCell>
                <TableAtom.TCell>{item.balanceFirstDuration}</TableAtom.TCell>
                <TableAtom.TCellEnd
                  viewLink={"/" + tenantId + "/customers/" + item?.id}
                  editLink={"/" + tenantId + "/customers/" + item?.id + "/edit"}
                  onDelete={() => setDeletedPopup(item)}
                />
              </TableAtom.TRow>
            ))}
          </TableAtom.TBody>
        </TableAtom>

        <PaginationAtom
          page={watch("page")}
          changeSelectHandler={(val) => {
            const obj = { ...getValues(), page: 1, pageSize: +val.target.value };
            fetchCustomers(obj);
            setValue("page", 1);
            setValue("pageSize", +val.target.value);
          }}
          changePaginationHandler={(_, page) => {
            const obj = { ...getValues(), page };
            fetchCustomers(obj);
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
        titleMessage="Delete customer?"
        descriptionMessage="When you delete the customer, you will lose all the customer information and it will be transferred to the deleted list"
      />
    </div>
  );
}
