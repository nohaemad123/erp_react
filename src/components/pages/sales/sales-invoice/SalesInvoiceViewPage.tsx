"use client";

import { ResultHandler } from "@/@types/classes/ResultHandler";
import { ISalesInvoiceDto } from "@/@types/dto/SalesInvoiceDto";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import { IPagination } from "@/@types/interfaces/IPagination";
import fetchClient from "@/lib/fetchClient";
import { getAllSalesInvoicesList } from "@/services/loadData";
import { useAppStore } from "@/store";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import AddNewButtonAtom from "@/components/atom/AddNewButtonAtom";
import { PaginationAtom } from "@/components/atom/PaginationAtom";
import ModalDeleteAtom from "@/components/atom/ModalDeleteAtom";
import TableAtom from "@/components/atom/TableAtom";
import DatesFilterOrganism from "@/components/organisms/DatesFilterOrganism";
import { SalesSearchDto } from "@/@types/dto/SalesSearchDto";
import { salesValidationSchema } from "@/@types/validators/salesValidators";

const initSearchValues = new SalesSearchDto({
  readDto: { dateFrom: null, dateTo: null },
  selectColumns: ["id", "code", "store", "customer", "qty", "subTotal", "netTotal", "date"],
  // sortColumnDirection: "asc",
});

interface ISalesInvoiceViewPageProps {
  tenantId: string;
}

export default function SalesInvoiceViewPage({ tenantId }: Readonly<ISalesInvoiceViewPageProps>) {
  const { t, i18n } = useTranslation();
  const { isHttpClientLoading } = useAppStore();
  const [rows, setRows] = useState<ISalesInvoiceDto[]>([]);
  const [pagination, setPagination] = useState<IPagination>();
  const [deletedSalesInvoice, setDeletedSalesInvoice] = useState<ISalesInvoiceDto | null>(null);
  const handleClose = () => setDeletedSalesInvoice(null);

  const { reset, control, handleSubmit, getValues, setValue, watch } = useForm<SalesSearchDto>({
    defaultValues: { ...initSearchValues },
    resolver: valibotResolver(salesValidationSchema),
    mode: "onChange",
  });

  useEffect(() => {
    fetchSalesInvoices(initSearchValues);
  }, [tenantId]);

  const handleSubmitForm = (values: SalesSearchDto) => {
    values.page = 1;
    fetchSalesInvoices(values);
    setValue("page", 1);
  };

  const handleReset = () => {
    reset({ ...initSearchValues, page: getValues("page"), pageSize: getValues("pageSize") });
    fetchSalesInvoices({ ...initSearchValues, page: getValues("page"), pageSize: getValues("pageSize") });
  };

  function fetchSalesInvoices(params: SalesSearchDto) {
    getAllSalesInvoicesList(i18n.language, tenantId, params)
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

  async function handleDelete() {
    if (!deletedSalesInvoice?.id) return;
    try {
      const response = await fetchClient<ResultHandler<null>>(EndPointsEnums.SALES_INVOICE, {
        method: "DELETE",
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
        params: {
          id: deletedSalesInvoice.id,
        },
      });

      if (response.status) {
        handleClose();
        fetchSalesInvoices(getValues());
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
            fromControlName="readDto.dateFrom"
            toControlName="readDto.dateTo"
          />
        </form>
        <div className="flex items-center justify-between mt-10">
          <div className="table_title_div px-6 pt-3 border-[#e6e7ec] bg-white border-t-2 border-l-2 border-r-2 rounded-ss-md rounded-se-md">
            <p className="pb-3 m-0 text-[12px] font-normal custom-border text-[var(--primary)]">
              {t("Sales invoice title")}

              <span className="rounded-md mx-3 bg-[var(--primary)] font-light text-white text-sm px-2 py-0.5">
                {pagination?.totalCount}
              </span>
            </p>
          </div>
          <div className="flex">
            <AddNewButtonAtom href={"/" + tenantId + "/sales-invoice/add"} />
          </div>
        </div>

        <div className="p-2 table_container bg-white border-b-2 border-l-2 border-r-2 w-full">
          <div className="p-2 bg-white w-full">
            <TableAtom aria-label="Sales Invoice data">
              <TableAtom.THead>
                <TableAtom.TRow>
                  <TableAtom.TCell component="th">#</TableAtom.TCell>
                  <TableAtom.TCell component="th">{t("Document date")}</TableAtom.TCell>
                  <TableAtom.TCell component="th">{t("Customer name")}</TableAtom.TCell>
                  <TableAtom.TCell component="th">{t("Store name")}</TableAtom.TCell>
                  <TableAtom.TCell component="th">{t("Amount")}</TableAtom.TCell>
                  <TableAtom.TCell component="th">{t("Payment status")}</TableAtom.TCell>
                  <TableAtom.TCell component="th">{t("Net amount")}</TableAtom.TCell>
                  <TableAtom.TCell component="th"></TableAtom.TCell>
                </TableAtom.TRow>
              </TableAtom.THead>
              <TableAtom.TBody>
                {rows.map((item, index) => (
                  <TableAtom.TRow key={item?.id}>
                    <TableAtom.TCell>{index + 1}</TableAtom.TCell>
                    <TableAtom.TCell>
                      {item.date && new Date(item.date).toLocaleDateString("en", { dateStyle: "medium" })}
                    </TableAtom.TCell>
                    <TableAtom.TCell>{item.customerName}</TableAtom.TCell>
                    <TableAtom.TCell>{item.storeName}</TableAtom.TCell>
                    <TableAtom.TCell>{item.qty}</TableAtom.TCell>
                    <TableAtom.TCell>{}</TableAtom.TCell>
                    <TableAtom.TCell>{}</TableAtom.TCell>
                    <TableAtom.TCellEnd
                      viewLink={"/" + tenantId + "/sales-invoice/" + item?.id}
                      editLink={"/" + tenantId + "/sales-invoice/" + item?.id + "/edit"}
                      onDelete={() => setDeletedSalesInvoice(item)}
                      onPrint={() => {}}
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
        isOpen={!!deletedSalesInvoice}
        deleteHandler={handleDelete}
        closeHandler={handleClose}
        titleMessage="Delete sales invoice"
        descriptionMessage="When you delete the sales invoice, you will lose all the sales invoice information and it will be transferred to the deleted list"
      />
    </div>
  );
}
