"use client";

import { ResultHandler } from "@/@types/classes/ResultHandler";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import { IPagination } from "@/@types/interfaces/IPagination";
import fetchClient from "@/lib/fetchClient";
import { getAllOutgoingStoreTransactions } from "@/services/loadData";
import { useAppStore } from "@/store";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { IOutgoingStoreTransaction } from "@/@types/interfaces/IOutgoingStoreTransactions";
import ModalDeleteAtom from "@/components/atom/ModalDeleteAtom";
import { StockSearchDto } from "@/@types/dto/stockSearchDto";
import { stockValidationSchema } from "@/@types/validators/stockValidators";
import AddNewButtonAtom from "@/components/atom/AddNewButtonAtom";
import { PaginationAtom } from "@/components/atom/PaginationAtom";
import DatesFilterOrganism from "@/components/organisms/DatesFilterOrganism";
import TableAtom from "@/components/atom/TableAtom";
import { MainCardTitleAtom } from "@/components/atom/MainCardTitleAtom";

const initSearchValues = new StockSearchDto({
  selectColumns: [
    "id",
    "code",
    "storeName",
    "outgoingStoreTypeName",
    "customerName",
    "totalQuntity",
    "totalCost",
    "totalPrice",
    "date",
  ],
  sortColumnDirection: "asc",
  readDto: { from: null, to: null },
});

interface IOutgoingStockViewPageProps {
  tenantId: string;
}

export default function OutgoingStockViewPage({ tenantId }: Readonly<IOutgoingStockViewPageProps>) {
  const { t, i18n } = useTranslation();
  const { isHttpClientLoading } = useAppStore();
  const [rows, setRows] = useState<IOutgoingStoreTransaction[]>([]);
  const [pagination, setPagination] = useState<IPagination>();
  const [deletedOutgoingStock, setDeletedOutgoingStock] = useState<IOutgoingStoreTransaction | null>(null);
  const handleClose = () => setDeletedOutgoingStock(null);
  const { reset, control, handleSubmit, getValues, setValue, watch } = useForm<StockSearchDto>({
    defaultValues: { ...initSearchValues },
    resolver: valibotResolver(stockValidationSchema),
    mode: "onChange",
  });

  useEffect(() => {
    fetchOutgoingStocks(initSearchValues);
  }, [tenantId]);

  const handleSubmitForm = (values: StockSearchDto) => {
    values.page = 1;
    fetchOutgoingStocks(values);
    setValue("page", 1);
  };

  const handleReset = () => {
    reset({ ...initSearchValues, page: getValues("page"), pageSize: getValues("pageSize") });
    fetchOutgoingStocks({ ...initSearchValues, page: getValues("page"), pageSize: getValues("pageSize") });
  };

  function fetchOutgoingStocks(params: StockSearchDto) {
    getAllOutgoingStoreTransactions(i18n.language, tenantId, params)
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
      const response = await fetchClient<ResultHandler<null>>(EndPointsEnums.OUTGOING_STORE_TRANSACTION, {
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
        fetchOutgoingStocks(getValues());
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
          <MainCardTitleAtom title="Outgoing stock title" totalCount={pagination?.totalCount} />
          <div className="flex">
            <AddNewButtonAtom href={"/" + tenantId + "/outgoing-stock/add"} />
          </div>
        </div>

        <div className="p-2 table_container bg-white border-b-2 border-l-2 border-r-2 w-full">
          <div className="p-2 bg-white w-full">
            <TableAtom aria-label="Purchase Invoice data">
              <TableAtom.THead>
                <TableAtom.TRow>
                  <TableAtom.TCell component="th">#</TableAtom.TCell>
                  <TableAtom.TCell component="th">{t("Outgoing stock title")}</TableAtom.TCell>
                  <TableAtom.TCell component="th">{t("Store name")}</TableAtom.TCell>
                  <TableAtom.TCell component="th">{t("Customer")}</TableAtom.TCell>
                  <TableAtom.TCell component="th">{t("Amount")}</TableAtom.TCell>
                  <TableAtom.TCell component="th">{t("Value")}</TableAtom.TCell>
                  <TableAtom.TCell component="th">{t("Document date")}</TableAtom.TCell>
                  <TableAtom.TCell component="th"></TableAtom.TCell>
                </TableAtom.TRow>
              </TableAtom.THead>
              <TableAtom.TBody>
                {rows.map((item, index) => (
                  <TableAtom.TRow key={item?.id}>
                    <TableAtom.TCell>{index + 1}</TableAtom.TCell>
                    <TableAtom.TCell>{item.outgoingStoreTypeName}</TableAtom.TCell>
                    <TableAtom.TCell>{item.storeName}</TableAtom.TCell>
                    <TableAtom.TCell>{item.customerName}</TableAtom.TCell>
                    <TableAtom.TCell>{item.totalQuntity}</TableAtom.TCell>
                    <TableAtom.TCell>{item.totalCost}</TableAtom.TCell>
                    <TableAtom.TCell>
                      {item.date && new Date(item.date).toLocaleDateString("en", { dateStyle: "medium" })}
                    </TableAtom.TCell>
                    <TableAtom.TCellEnd
                      viewLink={"/" + tenantId + "/outgoing-stock/" + item?.id}
                      editLink={"/" + tenantId + "/outgoing-stock/" + item?.id + "/edit"}
                      onDelete={() => setDeletedOutgoingStock(item)}
                    />
                  </TableAtom.TRow>
                ))}
              </TableAtom.TBody>
            </TableAtom>
          </div>
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
        isOpen={!!deletedOutgoingStock}
        deleteHandler={handleDelete}
        closeHandler={handleClose}
        titleMessage="Delete outgoing stock?"
        descriptionMessage="When you delete the outgoing stock, you will lose all the outgoing stock information and it will be transferred to the deleted list"
      />
    </div>
  );
}