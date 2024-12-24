"use client";

import { MouseEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { getAllProducts } from "@/services/loadData";
import { SearchDto } from "@/@types/dto/SearchDto";
import { searchValidationSchema } from "@/@types/validators/searchValidators";
import { useAppStore } from "@/store";
import { IPagination } from "@/@types/interfaces/IPagination";
import { IProduct } from "@/@types/interfaces/IProduct";
import { ResultHandler } from "@/@types/classes/ResultHandler";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import fetchClient from "@/lib/fetchClient";
import { valibotResolver } from "@hookform/resolvers/valibot";
import LabelAtom from "@/components/atom/LabelAtom";
import { TextFieldAtom } from "@/components/atom/TextFieldAtom";
import ModalDeleteAtom from "@/components/atom/ModalDeleteAtom";
import { SearchButtonAtom } from "@/components/atom/SearchButtonAtom";
import { ResetButtonAtom } from "@/components/atom/ResetButtonAtom";
import AddNewButtonAtom from "@/components/atom/AddNewButtonAtom";
import { PaginationAtom } from "@/components/atom/PaginationAtom";
import TableAtom from "@/components/atom/TableAtom";
import { SortColumnType } from "@/@types/types/sortColumnType";
import { MainCardTitleAtom } from "@/components/atom/MainCardTitleAtom";

const initSearchValues = new SearchDto({
  readDto: { name: "" },
  selectColumns: ["id", "name", "code", "taxNumber", "balanceFirstDuration"],
});

interface IProductsViewPageProps {
  tenantId: string;
}

export default function ProductsViewPage({ tenantId }: Readonly<IProductsViewPageProps>) {
  const { t, i18n } = useTranslation();
  const { isHttpClientLoading } = useAppStore();
  const [deletedPopup, setDeletedPopup] = useState<IProduct | null>(null);
  const handleClose = () => setDeletedPopup(null);
  const [rows, setRows] = useState<IProduct[]>([]);
  const [pagination, setPagination] = useState<IPagination>();
  const { reset, register, handleSubmit, getValues, setValue, watch } = useForm<SearchDto>({
    defaultValues: { ...initSearchValues },
    resolver: valibotResolver(searchValidationSchema),
  });

  useEffect(() => {
    fetchProducts(getValues());
  }, [tenantId]);

  function handleSubmitForm(values: SearchDto) {
    values.page = 1;
    fetchProducts(values);
    setValue("page", 1);
  }

  // Fetch product group on component mount
  function fetchProducts(params: SearchDto) {
    getAllProducts(i18n.language, tenantId, params)
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

  async function handleDelete(id: any) {
    try {
      const response = await fetchClient<ResultHandler<null>>(EndPointsEnums.PRODUCT, {
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
        fetchProducts(getValues());
      } else {
        console.error("Error deleting");
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  }

  function handleSort(_e: MouseEvent, sortBy: string, sortDirection: SortColumnType) {
    const sortColumn = sortDirection ? sortBy : "";
    const sortColumnDirection = sortDirection;
    setValue("sortColumn", sortColumn);
    setValue("sortColumnDirection", sortColumnDirection);
    fetchProducts({ ...getValues(), sortColumn, sortColumnDirection });
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
                  fetchProducts({ ...initSearchValues, page: getValues("page"), pageSize: getValues("pageSize") });
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div>
              <LabelAtom labelMessage="Search For" />
              <TextFieldAtom disabled={isHttpClientLoading} placeholder={t("Search For")} className="w-full" {...register("search")} />
            </div>

            <div>
              <LabelAtom labelMessage="Search product name" />
              <TextFieldAtom
                disabled={isHttpClientLoading}
                placeholder={t("Product name")}
                className="w-full"
                {...register("readDto.name")}
              />
            </div>
          </div>
        </form>

        <div className="flex items-center justify-between mt-8">
          <MainCardTitleAtom title="Products" totalCount={pagination?.totalCount} />

          <div className="flex">
            <AddNewButtonAtom href={"/" + tenantId + "/products/add"} />
          </div>
        </div>

        <TableAtom aria-label="Bank Card data">
          <TableAtom.THead>
            <TableAtom.TRow>
              <TableAtom.TCell component="th">#</TableAtom.TCell>
              <TableAtom.TCell
                sortable
                component="th"
                field="name"
                sortBy={watch("sortColumn")}
                sortDirection={watch("sortColumnDirection")}
                onSort={handleSort}
              >
                {t("Product name")}
              </TableAtom.TCell>
              <TableAtom.TCell component="th">{t("code")}</TableAtom.TCell>
              <TableAtom.TCell component="th">{""}</TableAtom.TCell>
            </TableAtom.TRow>
          </TableAtom.THead>
          <TableAtom.TBody>
            {rows.map((item, index) => (
              <TableAtom.TRow key={item?.id}>
                <TableAtom.TCell>{index + 1}</TableAtom.TCell>
                <TableAtom.TCell>{item.name}</TableAtom.TCell>
                <TableAtom.TCell>{item.code}</TableAtom.TCell>
                <TableAtom.TCellEnd
                  viewLink={"/" + tenantId + "/products/" + item?.id}
                  editLink={"/" + tenantId + "/products" + item?.id + "/edit"}
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
        titleMessage="Delete product?"
        descriptionMessage="When you delete the product, you will lose all the product information and it will be transferred to the deleted list"
      />
    </div>
  );
}
