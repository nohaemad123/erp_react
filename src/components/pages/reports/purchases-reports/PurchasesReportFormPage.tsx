"use client";

import { PurchaseReportDto } from "@/@types/dto/PurchaseReportDto";
import { SearchDto } from "@/@types/dto/SearchDto";
import { ICommissionType } from "@/@types/interfaces/ICommissionType";
import { IProduct } from "@/@types/interfaces/IProduct";
import { IProductGroup } from "@/@types/interfaces/IProductGroup";
import { IStore } from "@/@types/interfaces/IStore";
import { ISupplier } from "@/@types/interfaces/ISupplier";
import { IUser } from "@/@types/interfaces/IUser";
import { PurchasesReportsValidationSchema } from "@/@types/validators/PurchasesReportsValidators";
import {
  GetAllInvoiceTypes,
  getAllProduct,
  getAllProductGroups,
  GetAllStores,
  getAllSuppliers,
  getAllUsers,
  PurchaseAnalysisReport,
  PurchaseReturnAnalysisReport,
  PurchaseReturnTotalReport,
  PurchaseTotalReport,
} from "@/services/loadData";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Autocomplete, Button, MenuItem, Select } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import LabelAtom from "@/components/atom/LabelAtom";
import { TextFieldAtom } from "@/components/atom/TextFieldAtom";

interface IReportFormProps {
  formId?: string;
  tenantId: string;
}

const initSearchValues = new SearchDto({
  selectColumns: ["id", "name"],
});

export default function PurchasesReportFormPage({ formId, tenantId }: Readonly<IReportFormProps>) {
  const { t, i18n } = useTranslation();
  const { handleSubmit, control, setValue } = useForm<PurchaseReportDto>({
    defaultValues: new PurchaseReportDto(),
    resolver: valibotResolver(PurchasesReportsValidationSchema),
  });

  const [users, setUsers] = useState<IUser[]>([]);
  const [vendors, setVendors] = useState<ISupplier[]>([]);
  const [productGroup, setProductGroup] = useState<IProductGroup[]>([]);
  const [product, setProduct] = useState<IProduct[]>([]);
  const [stores, setStore] = useState<IStore[]>([]);
  const [invoiceTypes, setInvoiceTypes] = useState<ICommissionType[]>([]);

  // Fetch users
  function fetchUsers() {
    getAllUsers(i18n.language, tenantId, initSearchValues)
      .then((res) => {
        if (res) {
          console.log(res.listData);
          setUsers(res?.listData ?? []);
        }
      })
      .catch(console.log);
  }

  // Fetch vendors
  function fetchVendors() {
    getAllSuppliers(i18n.language, tenantId, initSearchValues)
      .then((res) => {
        if (res) {
          console.log(res.listData);
          setVendors(res?.listData ?? []);
        }
      })
      .catch(console.log);
  }

  // Fetch ProductGroup
  function fetchProductGroups() {
    getAllProductGroups(i18n.language, tenantId, initSearchValues)
      .then((res) => {
        if (res) {
          console.log(res.listData);
          setProductGroup(res?.listData ?? []);
        }
      })
      .catch(console.log);
  }

  // Fetch Products
  function fetchProducts() {
    getAllProduct(i18n.language, tenantId, initSearchValues)
      .then((res) => {
        if (res) {
          console.log(res.listData);
          setProduct(res?.listData ?? []);
        }
      })
      .catch(console.log);
  }

  // Fetch Stores
  function fetchStores() {
    GetAllStores(i18n.language, tenantId, initSearchValues)
      .then((res) => {
        if (res) {
          console.log(res.listData);
          setStore(res?.listData ?? []);
        }
      })
      .catch(console.log);
  }

  // Fetch invoiceTypes
  function fetchInvoiceTypes() {
    GetAllInvoiceTypes(i18n.language, tenantId)
      .then((res) => {
        if (res) {
          console.log(res);
          setInvoiceTypes(res ?? []);
        }
      })
      .catch(console.log);
  }

  // Function to handle form submission
  async function handleSubmitForm(data: PurchaseReportDto) {
    console.log(data);
    console.log(formId);
    switch (formId) {
      case "1":
        PurchaseAnalysisReport(i18n.language, tenantId, data).then((res) => {
          openPdfInNewTab(res?.stringBase64);
        });

        break;
      case "2":
        PurchaseTotalReport(i18n.language, tenantId, data).then((res) => {
          openPdfInNewTab(res?.stringBase64);
        });
        break;

      case "3":
        PurchaseReturnAnalysisReport(i18n.language, tenantId, data).then((res) => {
          openPdfInNewTab(res?.stringBase64);
        });
        break;
      case "4":
        PurchaseReturnTotalReport(i18n.language, tenantId, data).then((res) => {
          openPdfInNewTab(res?.stringBase64);
        });
        break;
      default:
        console.log("No form id");
        break;
    }
  }

  function openPdfInNewTab(base64Data: string) {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    // Open Blob in new tab
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, "_blank");
  }

  useEffect(() => {
    setValue("dateFrom", new Date().toISOString().split("T")[0]);
    setValue("dateTo", new Date().toISOString().split("T")[0]);

    fetchUsers();
    fetchVendors();
    fetchProductGroups();
    fetchProducts();
    fetchStores();
    fetchInvoiceTypes();
  }, [formId]);

  return (
    <div className="w-full py-8">
      <div className="w-full p-8 pt-0 form-wrapper form_container">
        <form className="add_branch_form_container" onSubmit={handleSubmit(handleSubmitForm)}>
          <div className="flex items-center justify-between">
            <div className="px-8 pt-3 bg-white border-t-2 border-l-2 border-r-2 rounded-ss-md rounded-se-md">
              <p className="pb-3 m-0 text-lg font-medium custom-border text-[var(--primary)]">{t("تقارير ")}</p>
            </div>
          </div>

          {/* controls */}
          <div className="flex-wrap justify-between w-full p-10 bg-white border-b-2 border-l-2 border-r-2 sm:block md:block lg:flex xl:flex">
            {/* dateFrom */}
            <div className="mb-6 sm:w-full md:w-full lg:w-1/2 pe-10">
              <LabelAtom labelMessage="From date" />
              <Controller
                control={control}
                name="dateFrom"
                render={({ field: { value, onChange } }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={dayjs(value)}
                      className="w-full text-base"
                      onChange={(newValue) => onChange(newValue?.toDate() ?? null)}
                    />
                  </LocalizationProvider>
                )}
              />
            </div>

            {/* dateTo */}
            <div className="mb-6 sm:w-full md:w-full lg:w-1/2 pe-10">
              <LabelAtom labelMessage="To date" />
              <Controller
                control={control}
                name="dateTo"
                render={({ field: { value, onChange } }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={dayjs(value)}
                      className="w-full text-base"
                      onChange={(newValue) => onChange(newValue?.toDate() ?? null)}
                    />
                  </LocalizationProvider>
                )}
              />
            </div>

            {/* userIds */}
            <div className="mb-6 sm:w-full md:w-full lg:w-1/2 pe-10">
              <LabelAtom labelMessage="user Name" />
              <Controller
                control={control}
                name="userIds"
                render={({ field: { value, onChange } }) => (
                  <Autocomplete
                    multiple
                    value={value}
                    options={users.map((x) => {
                      return x.id;
                    })}
                    filterSelectedOptions
                    getOptionLabel={(option) => {
                      const branch = users.find((item) => item.id === option);
                      return branch ? branch.name : "";
                    }}
                    onChange={(_, value) => {
                      onChange(value);
                    }}
                    renderInput={(params) => <TextFieldAtom {...params} placeholder={t("user Name")} />}
                  />
                )}
              />
            </div>

            {/* vendor Ids */}
            <div className="mb-6 sm:w-full md:w-full lg:w-1/2 pe-10">
              <LabelAtom labelMessage="supplier name" />
              <Controller
                control={control}
                name="vendorIds"
                render={({ field: { value, onChange } }) => (
                  <Autocomplete
                    multiple
                    value={value}
                    options={vendors.map((x) => {
                      return x.id;
                    })}
                    filterSelectedOptions
                    getOptionLabel={(option) => {
                      const vendor = vendors.find((item) => item.id === option);
                      return vendor ? vendor.name : "";
                    }}
                    onChange={(_, value) => {
                      onChange(value);
                    }}
                    renderInput={(params) => <TextFieldAtom {...params} placeholder={t("supplier name")} />}
                  />
                )}
              />
            </div>

            {/* item Groups */}
            <div className="mb-6 sm:w-full md:w-full lg:w-1/2 pe-10">
              <LabelAtom labelMessage="product Groups" />
              <Controller
                control={control}
                name="itemGroups"
                render={({ field: { value, onChange } }) => (
                  <Autocomplete
                    multiple
                    value={value}
                    options={productGroup.map((x) => {
                      return x.id;
                    })}
                    filterSelectedOptions
                    getOptionLabel={(option) => {
                      const prodGroup = productGroup.find((item) => item.id === option);
                      return prodGroup ? prodGroup.name : "";
                    }}
                    onChange={(_, value) => {
                      onChange(value);
                    }}
                    renderInput={(params) => <TextFieldAtom {...params} placeholder={t("product Groups")} />}
                  />
                )}
              />
            </div>

            {/* itemIds */}
            <div className="mb-6 sm:w-full md:w-full lg:w-1/2 pe-10">
              <LabelAtom labelMessage="product name" />
              <Controller
                control={control}
                name="itemIds"
                render={({ field: { value, onChange } }) => (
                  <Autocomplete
                    multiple
                    value={value}
                    options={product.map((x) => {
                      return x.id;
                    })}
                    filterSelectedOptions
                    getOptionLabel={(option) => {
                      const prod = product.find((item) => item.id === option);
                      return prod ? prod.name : "";
                    }}
                    onChange={(_, value) => {
                      onChange(value);
                    }}
                    renderInput={(params) => <TextFieldAtom {...params} placeholder={t("product name")} />}
                  />
                )}
              />
            </div>

            {/* invoiceDealType */}
            <div className="mb-6 sm:w-full md:w-full lg:w-1/2 pe-10">
              <LabelAtom labelMessage="invoice type" />
              <Controller
                control={control}
                name="invoiceDealType"
                render={({ field: { value, onChange } }) => (
                  <Select value={value} onChange={onChange} placeholder={t("invoice type")} className="w-full text-base">
                    {invoiceTypes.map((type) => (
                      <MenuItem key={type.key} value={type.key}>
                        {type.value}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </div>

            {/* storeIds */}
            <div className="mb-6 sm:w-full md:w-full lg:w-1/2 pe-10">
              <LabelAtom labelMessage="store name" />
              <Controller
                control={control}
                name="storeIds"
                render={({ field: { value, onChange } }) => (
                  <Autocomplete
                    multiple
                    value={value}
                    options={stores.map((x) => {
                      return x.id;
                    })}
                    filterSelectedOptions
                    getOptionLabel={(option) => {
                      const store = stores.find((item) => item.id === option);
                      return store ? store.name : "";
                    }}
                    onChange={(_, value) => {
                      onChange(value);
                    }}
                    renderInput={(params) => <TextFieldAtom {...params} placeholder={t("store name")} />}
                  />
                )}
              />
            </div>

            {/* buttons */}
            <div className="flex justify-center w-full my-10 gap-3">
              <Button variant={"outlined"} type="submit" className="print-btn">
                <span>{t("print")}</span>
              </Button>
              <Button variant={"outlined"} type="button" className="cancel-btn">
                <span>{t("cancel")}</span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
