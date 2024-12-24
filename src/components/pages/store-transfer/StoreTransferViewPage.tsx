"use client";

import { ResultHandler } from "@/@types/classes/ResultHandler";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import { IPagination } from "@/@types/interfaces/IPagination";
import fetchClient from "@/lib/fetchClient";
import { getAllStoreTransferTransactions } from "@/services/loadData";
import { useAppStore } from "@/store";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { IStoreTransferTransaction } from "@/@types/interfaces/IStoreTransferTransaction";
import ModalDeleteAtom from "@/components/atom/ModalDeleteAtom";
import { StockSearchDto } from "@/@types/dto/stockSearchDto";
import { stockValidationSchema } from "@/@types/validators/stockValidators";
import AddNewButtonAtom from "@/components/atom/AddNewButtonAtom";
import { PaginationAtom } from "@/components/atom/PaginationAtom";
import TableAtom from "@/components/atom/TableAtom";
import { MainCardTitleAtom } from "@/components/atom/MainCardTitleAtom";
import DatesFilterOrganism from "@/components/organisms/DatesFilterOrganism";

const initSearchValues = new StockSearchDto({
  selectColumns: ["id", "code", "fromStoreName", "toStoreName", "totalQuntity", "totalCost", "totalPrice", "date"],
  sortColumnDirection: "asc",
  readDto: { from: null, to: null },
});

interface IStoreTransferViewPageProps {
  tenantId: string;
}

export default function StoreTransferViewPage({ tenantId }: Readonly<IStoreTransferViewPageProps>) {
  const { t, i18n } = useTranslation();
  const { isHttpClientLoading } = useAppStore();
  const [rows, setRows] = useState<IStoreTransferTransaction[]>([]);
  const [pagination, setPagination] = useState<IPagination>();
  const [deletedIncomingStock, setDeletedIncomingStock] = useState<IStoreTransferTransaction | null>(null);
  const handleClose = () => setDeletedIncomingStock(null);
  const { reset, control, handleSubmit, getValues, setValue, watch } = useForm<StockSearchDto>({
    defaultValues: { ...initSearchValues },
    resolver: valibotResolver(stockValidationSchema),
    mode: "onChange",
  });

  useEffect(() => {
    fetchStoreTransfers(initSearchValues);
  }, [tenantId]);

  const handleSubmitForm = (values: StockSearchDto) => {
    values.page = 1;
    fetchStoreTransfers(values);
    setValue("page", 1);
  };

  const handleReset = () => {
    reset({ ...initSearchValues, page: getValues("page"), pageSize: getValues("pageSize") });
    fetchStoreTransfers({ ...initSearchValues, page: getValues("page"), pageSize: getValues("pageSize") });
  };

  function fetchStoreTransfers(params: StockSearchDto) {
    getAllStoreTransferTransactions(i18n.language, tenantId, params)
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
      const response = await fetchClient<ResultHandler<null>>(EndPointsEnums.TRANSFER_STORE_TRANSACTION, {
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
        fetchStoreTransfers(getValues());
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
        <form className="w-full p-8 mt-5 bg-white rounded-md" onSubmit={handleSubmit(handleSubmitForm)}>
          <DatesFilterOrganism
            watch={watch} // Watch the form fields
            isHttpClientLoading={isHttpClientLoading} // Whether the HTTP request is in progress
            handleReset={handleReset} // Handle form reset
            control={control} // Pass react-hook-form's control for managing form state
            fromControlName="readDto.from"
            toControlName="readDto.to"
          />
        </form>
        <div className="flex items-center justify-between mt-10">
          <MainCardTitleAtom title="Store transfer title" totalCount={pagination?.totalCount} />
          <div className="flex">
            <AddNewButtonAtom href={"/" + tenantId + "/store-transfer/add"} />
          </div>
        </div>

        <div className="p-2 bg-white w-full">
          <TableAtom aria-label="Store Transfer ">
            <TableAtom.THead>
              <TableAtom.TRow>
                <TableAtom.TCell component="th">#</TableAtom.TCell>
                <TableAtom.TCell component="th">{t("From store name")}</TableAtom.TCell>
                <TableAtom.TCell component="th">{t("To store name")}</TableAtom.TCell>
                <TableAtom.TCell component="th">{t("Amount")}</TableAtom.TCell>
                <TableAtom.TCell component="th">{t("Total cost")}</TableAtom.TCell>
                <TableAtom.TCell component="th">{t("Total selling price")}</TableAtom.TCell>
                <TableAtom.TCell component="th">{t("Document date")}</TableAtom.TCell>
                <TableAtom.TCell component="th"></TableAtom.TCell>
              </TableAtom.TRow>
            </TableAtom.THead>
            <TableAtom.TBody>
              {rows.map((item, index) => (
                <TableAtom.TRow key={item?.id}>
                  <TableAtom.TCell>{index + 1}</TableAtom.TCell>
                  <TableAtom.TCell>{item.fromStoreName}</TableAtom.TCell>
                  <TableAtom.TCell>{item.toStoreName}</TableAtom.TCell>
                  <TableAtom.TCell>{item?.totalQuantity}</TableAtom.TCell>
                  <TableAtom.TCell>{item.totalCost}</TableAtom.TCell>
                  <TableAtom.TCell>{item.totalPrice}</TableAtom.TCell>
                  <TableAtom.TCell>
                    {item.date && new Date(item.date).toLocaleDateString("en", { dateStyle: "medium" })}
                  </TableAtom.TCell>

                  <TableAtom.TCellEnd
                    viewLink={"/" + tenantId + "/store-transfer/" + item?.id}
                    editLink={"/" + tenantId + "/store-transfer/" + item?.id + "/edit"}
                    onDelete={() => setDeletedIncomingStock(item)}
                  />
                </TableAtom.TRow>
              ))}
            </TableAtom.TBody>
          </TableAtom>
        </div>
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
        isOpen={!!deletedIncomingStock}
        deleteHandler={() => handleDelete(deletedIncomingStock?.id)}
        closeHandler={handleClose}
        titleMessage="Delete store transfer"
        descriptionMessage="When you delete the store transfer, you will lose all the store transfer information and it will be transferred to the deleted list"
      />
    </div>
  );
}
