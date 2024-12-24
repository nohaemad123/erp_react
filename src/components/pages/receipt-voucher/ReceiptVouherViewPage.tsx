"use client";

import { getAllAccounts, getAllReceiptVoucher, getAllSafes } from "@/services/loadData";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SearchDto } from "@/@types/dto/SearchDto";
import { searchValidationSchema } from "@/@types/validators/searchValidators";
import { IPagination } from "@/@types/interfaces/IPagination";
import { useAppStore } from "@/store";
import { MenuItem, Select } from "@mui/material";
import { ResultHandler } from "@/@types/classes/ResultHandler";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import fetchClient from "@/lib/fetchClient";
import { IAccount } from "@/@types/interfaces/IAccount";
import { ISafe } from "@/@types/interfaces/ISafe";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { IPayment } from "@/@types/interfaces/IPayment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { IReceiptVourcher } from "@/@types/interfaces/IReceiptVoucher";
import LabelAtom from "@/components/atom/LabelAtom";
import ModalDeleteAtom from "@/components/atom/ModalDeleteAtom";
import { SearchButtonAtom } from "@/components/atom/SearchButtonAtom";
import { ResetButtonAtom } from "@/components/atom/ResetButtonAtom";
import AddNewButtonAtom from "@/components/atom/AddNewButtonAtom";
import { PaginationAtom } from "@/components/atom/PaginationAtom";
import TableAtom from "@/components/atom/TableAtom";
import { MainCardTitleAtom } from "@/components/atom/MainCardTitleAtom";

const initSearchValues = new SearchDto({
  readDto: {
    fromAccountId: "",
    toAccountId: "",
    date: null,
    dateFrom: null,
    dateTo: null,
  },
  selectColumns: ["id", "code", "date", "fromAccount", "toAccount", "amount"],
});

interface IReceiptVoucherViewPageProps {
  tenantId: string;
}
export default function ReceiptVoucherViewPage({ tenantId }: Readonly<IReceiptVoucherViewPageProps>) {
  const [accounts, setAccounts] = useState<IAccount[]>([]);
  const [safes, setSafes] = useState<ISafe[]>([]);
  const { t, i18n } = useTranslation();
  const { isHttpClientLoading } = useAppStore();
  const [rows, setRows] = useState<IPayment[]>([]);
  const [pagination, setPagination] = useState<IPagination>();
  const [deletedIncomingStock, setDeletedIncomingStock] = useState<IReceiptVourcher | null>(null);
  const handleClose = () => setDeletedIncomingStock(null);
  const { reset, handleSubmit, control, getValues, setValue, watch } = useForm<SearchDto>({
    defaultValues: { ...initSearchValues },
    resolver: valibotResolver(searchValidationSchema),
  });

  useEffect(() => {
    fetchAccounts();
    fetchSafes();
    fetchReceiptVoucher(getValues());
  }, [tenantId, watch("page"), watch("pageSize")]);

  function handleSubmitForm(values: SearchDto) {
    fetchReceiptVoucher(values);
  }

  function fetchAccounts() {
    getAllAccounts(i18n.language, tenantId)
      .then((res) => {
        if (res) {
          setAccounts(res?.listData ?? []);
        }
      })
      .catch(console.log);
  }

  function fetchSafes() {
    getAllSafes(i18n.language, tenantId)
      .then((res) => {
        if (res) {
          setSafes(res?.listData ?? []);
        }
      })
      .catch(console.log);
  }

  function fetchReceiptVoucher(params: SearchDto) {
    getAllReceiptVoucher(i18n.language, tenantId, params)
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

  async function handleDelete(id?: string) {
    if (!id) return;
    try {
      const response = await fetchClient<ResultHandler<null>>(EndPointsEnums.RECEIPT_VOUCHER, {
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
        fetchReceiptVoucher(getValues());
      } else {
        console.error("Error deleting user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }

  return (
    <div className="w-full">
      <div className="w-full p-10 mt-5">
        <form className="w-full p-8 mt-5 bg-white rounded-md" onSubmit={handleSubmit(handleSubmitForm)}>
          <div className="flex justify-between w-full search_header">
            <p className="m-0 text-xl font-semibold">{t("Search and filter")}</p>
            <div className="flex gap-4">
              <SearchButtonAtom />
              <ResetButtonAtom
                disabled={isHttpClientLoading}
                type="button"
                className="px-5 ml-3 search_button border-[#E6E6E6] normal-case text-primary py-1 text-[14px] font-semibold border-2 rounded-lg"
                onClick={() => {
                  reset({ ...initSearchValues, page: getValues("page"), pageSize: getValues("pageSize") });
                  fetchReceiptVoucher({ ...initSearchValues, page: getValues("page"), pageSize: getValues("pageSize") });
                }}
              />
            </div>
          </div>
          <div className="flex justify-between w-full mt-2 gap-10">
            <div className="mb-6 sm:w-full md:w-full lg:w-1/4">
              <LabelAtom labelMessage="Account" />
              <Controller
                control={control}
                name="readDto.fromAccountId"
                render={({ field: { value, onChange } }) => (
                  <Select
                    className="w-full h-12 px-5 py-1 mt-2 text-lg border-2 rounded-lg font-secondary text-secondary"
                    value={value}
                    onChange={(e) => {
                      onChange(e.target.value);
                    }}
                  >
                    {accounts.map((account) => (
                      <MenuItem key={account.id} value={account.id}>
                        {account.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </div>
            <div className="mb-6 sm:w-full md:w-full lg:w-1/4">
              <LabelAtom labelMessage="Safe name" />
              <Controller
                control={control}
                name="readDto.toAccountId"
                render={({ field: { value, onChange } }) => (
                  <Select
                    className="w-full h-12 px-5 py-1 mt-2 text-lg border-2 rounded-lg font-secondary text-secondary"
                    value={value}
                    onChange={(e) => {
                      onChange(e.target.value);
                    }}
                  >
                    {safes.map((safe) => (
                      <MenuItem key={safe.id} value={safe.id}>
                        {safe.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </div>
            <div className="mb-6 sm:w-full md:w-full lg:w-1/4">
              <LabelAtom labelMessage="Document date" />
              <Controller
                control={control}
                name="readDto.dateFrom"
                render={({ field: { value, onChange } }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker value={dayjs(value)} onChange={(newValue) => onChange(newValue?.toDate() ?? null)} />
                  </LocalizationProvider>
                )}
              />
            </div>

            <div className="mb-6 sm:w-full md:w-full lg:w-1/4 mt-9">
              <Controller
                control={control}
                name="readDto.dateTo"
                render={({ field: { value, onChange } }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker value={dayjs(value)} onChange={(newValue) => onChange(newValue?.toDate() ?? null)} />
                  </LocalizationProvider>
                )}
              />
            </div>
          </div>
        </form>

        <div className="flex items-end justify-between">
          <MainCardTitleAtom title="Receipt voucher" totalCount={pagination?.totalCount} />

          <div className="flex">
            <AddNewButtonAtom href={"/" + tenantId + "/payments/add"} />
          </div>
        </div>

        <div className="p-2 bg-white w-full">
          <TableAtom aria-label="Bank Card data">
            <TableAtom.THead>
              <TableAtom.TRow>
                <TableAtom.TCell component="th">#</TableAtom.TCell>
                <TableAtom.TCell component="th">{t("#")}</TableAtom.TCell>
                <TableAtom.TCell component="th">{t("Document number")}</TableAtom.TCell>
                <TableAtom.TCell component="th">{t("Document date")}</TableAtom.TCell>
                <TableAtom.TCell component="th">{t("Account name")}</TableAtom.TCell>
                <TableAtom.TCell component="th">{t("Safe name")}</TableAtom.TCell>
                <TableAtom.TCell component="th">{t("Value")}</TableAtom.TCell>
                <TableAtom.TCell component="th"></TableAtom.TCell>
              </TableAtom.TRow>
            </TableAtom.THead>
            <TableAtom.TBody>
              {rows.map((item, index) => (
                <TableAtom.TRow key={item?.id}>
                  <TableAtom.TCell>{index + 1}</TableAtom.TCell>
                  <TableAtom.TCell>{item.code}</TableAtom.TCell>
                  <TableAtom.TCell>
                    {item.date ? new Date(item.date).toLocaleDateString("en", { dateStyle: "medium" }) : ""}
                  </TableAtom.TCell>
                  <TableAtom.TCell>{item.fromAccount}</TableAtom.TCell>
                  <TableAtom.TCell>{item.toAccount}</TableAtom.TCell>
                  <TableAtom.TCell>{item.amount}</TableAtom.TCell>

                  <TableAtom.TCellEnd
                    viewLink={"/" + tenantId + "/receipt-voucher/" + item?.id}
                    editLink={"/" + tenantId + "/receipt-voucher" + item?.id + "/edit"}
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
        titleMessage="Delete receipt voucher?"
        descriptionMessage="When you delete the receipt voucher, you will lose all the receipt voucher information and it will be transferred to the deleted list"
      />
    </div>
  );
}
