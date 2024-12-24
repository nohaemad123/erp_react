"use client";

import { Button, ButtonBase, IconButton, Menu, MenuItem, Select } from "@mui/material";
import { useTranslation } from "react-i18next";
import { GoClock } from "react-icons/go";
import { BsThreeDots } from "react-icons/bs";
import { IoPrintOutline } from "react-icons/io5";
import { HiOutlineUserAdd } from "react-icons/hi";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useAppStore } from "@/store";
import { InvoiceDto, InvoiceProductRow } from "@/@types/dto/InvoiceDto";
import { useForm } from "react-hook-form";
import { IProduct } from "@/@types/interfaces/IProduct";
import { SearchDto } from "@/@types/dto/SearchDto";
import { getAllCustomers, getAllInvoices, getAllProductGroups, getAllProducts, getCustomerById } from "@/services/loadData";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { IPagination } from "@/@types/interfaces/IPagination";
import { ICustomer } from "@/@types/interfaces/ICustomer";
import { InvoiceStatusEnum, SalesTypeEnum } from "@/@types/interfaces/IInvoice";
import { MdLock, MdLockOpen } from "react-icons/md";
import { IProductGroup } from "@/@types/interfaces/IProductGroup";
import { LuBox, LuTrash2 } from "react-icons/lu";
import CashierProducts from "@/components/organisms/cashier/CashierProducts";
import CashierCustomers from "@/components/organisms/cashier/CashierCustomers";
import fetchClient from "@/lib/fetchClient";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import CashierInvoiceItemsTable from "@/components/organisms/cashier/CashierInvoiceItemsTable";
import CashierInvoiceSummary from "@/components/organisms/cashier/CashierInvoiceSummary";
import { cashierButtonStyle, cashierIconButtonStyle } from "@/@types/styles";
import CashierConfirmOrder from "@/components/organisms/cashier/CashierConfirmOrder";
import dayjs from "dayjs";
import { classNameGen } from "@/lib/cn";
import { getTranslatedName } from "@/@types/stables";
import { TextFieldAtom } from "@/components/atom/TextFieldAtom";

interface ICashierPageProps {
  tenantId: string;
}

const TABS = [
  {
    label: "Search for products",
    value: 0,
  },
  {
    label: "Search for a customer",
    value: 1,
  },
  // {
  //   label: "Search for an invoice",
  //   value: 2,
  // },
];

function productPriceCalc(product: IProduct, qty: number = 1) {
  const productUnits = product.productUnits;
  const unit = product.productUnits.find((x) => x.isDefault) ?? product.productUnits[0];
  if (!unit) return;

  const price = unit.salePrice;
  const discountValue = product.discount;
  const priceAfterDiscount = price - discountValue;
  const totalTax = product.taxRatio * priceAfterDiscount;
  const total = (priceAfterDiscount + totalTax) * qty;

  return new InvoiceProductRow({
    productName: product.name,
    productId: product.id,
    barcode: unit.barcode,
    productUnitId: unit.id,
    productUnits,
    qty,
    discountValue,
    price,
    total,
  });
}

function invoiceProductPriceCalc(row: InvoiceProductRow) {
  const productUnits = row.productUnits;
  const unit = productUnits.find((x) => x.id === row.productUnitId);
  if (!unit) return;

  const qty = row.qty;
  const price = unit.salePrice;
  const discountValue = row.discountValue;
  const priceAfterDiscount = price - discountValue;
  const totalTax = row.totalTax;
  const total = (priceAfterDiscount + totalTax) * qty;

  return new InvoiceProductRow({
    ...row,
    productName: row.productName,
    productId: row.productId,
    productUnitId: unit.id,
    productUnits,
    qty,
    discountValue,
    price,
    total,
  });
}

export default function CashierPage({ tenantId }: Readonly<ICashierPageProps>) {
  const { t, i18n } = useTranslation();
  const { isHttpClientLoading, branch, myUser } = useAppStore();
  const [tab, setTab] = useState(TABS[0]);
  const [paidInput, setPaidInput] = useState("");
  const [errMsgs, setErrMsgs] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [productGroups, setProductGroups] = useState<IProductGroup[]>([]);

  const [products, setProducts] = useState<IProduct[]>([]);
  const [productsSearch, setProductsSearch] = useState<SearchDto>(
    new SearchDto({
      pageSize: 30,
      selectColumns: ["id", "code", "name", "names", "productUnits", "discount", "taxRatio"],
    }),
  );
  const [productsPagination, setProductsPagination] = useState<IPagination>();
  const [isProductsLocked, setIsProductsLocked] = useState<boolean>(false);

  const [customer, setCustomer] = useState<ICustomer | undefined>();
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [customersSearch, setCustomersSearch] = useState<SearchDto>(
    new SearchDto({
      selectColumns: ["id", "name", "mobile", "address"],
    }),
  );
  const [customersPagination, setCustomersPagination] = useState<IPagination>();

  const [pendingInvoices, setPendingInvoices] = useState<InvoiceDto[]>([]);

  const { reset, getValues, watch, setValue } = useForm<InvoiceDto>({
    defaultValues: new InvoiceDto(),
  });

  async function fetchProductGroups() {
    try {
      const res = await getAllProductGroups(i18n.language, tenantId);
      setProductGroups(res?.listData ?? []);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchProducts(params: SearchDto) {
    try {
      const res = await getAllProducts(i18n.language, tenantId, params);
      setProducts(res?.listData ?? []);
      setProductsPagination(res?.paginationData);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchCustomers(params: SearchDto) {
    try {
      const res = await getAllCustomers(i18n.language, tenantId, params);
      setCustomers(res?.listData ?? []);
      setCustomersPagination(res?.paginationData);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchPendingInvoices() {
    try {
      const res = await getAllInvoices(i18n.language, tenantId, {
        readDto: {
          invoiceStatusId: InvoiceStatusEnum.Hold,
          salesTypeId: SalesTypeEnum.Cashier,
        },
      });
      const data =
        res?.listData.map((x) => {
          const row = new InvoiceDto(x);
          row.details = row.details.map((x) => new InvoiceProductRow(x));
          return row;
        }) ?? [];
      console.log(data);
      setPendingInvoices(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchCustomerById(id: string) {
    try {
      const res = await getCustomerById(i18n.language, tenantId, id);
      setCustomer(res);
    } catch (error) {
      console.log(error);
    }
  }

  async function onSubmit(invoiceStatusId = InvoiceStatusEnum.Hold) {
    const values = getValues();
    setErrMsgs([]);
    if (!branch?.id) {
      setErrMsgs(["Please select a branch"]);
      return;
    }
    if (!values.customerId) {
      setTab(TABS[1]);
      setErrMsgs(["Please select a customer"]);
      return;
    }
    if (!myUser?.storeUserId) {
      setErrMsgs(["Please add your user to a store"]);
      return;
    }

    values.invoiceStatusId = invoiceStatusId;
    values.salesTypeId = SalesTypeEnum.Cashier;
    values.branchId = branch.id;
    values.storeId = myUser.storeUserId;
    values.invoiceStatus = null;
    values.salesType = null;

    console.log(values);

    try {
      if (values.id) {
        await handleUpdate(values);
      } else {
        await handleCreate(values);
      }
      await fetchPendingInvoices();
      handleNewInvoice();
    } catch (error: any) {
      setErrMsgs(error.message.split(" , "));
      console.log(error);
    }
  }

  async function handleCreate(values: InvoiceDto) {
    await fetchClient(EndPointsEnums.SALES_INVOICE, {
      method: "POST",
      body: values,
      headers: {
        Tenant: tenantId,
      },
    });
  }

  async function handleUpdate(values: InvoiceDto) {
    await fetchClient(EndPointsEnums.SALES_INVOICE, {
      method: "PUT",
      body: values,
      headers: {
        Tenant: tenantId,
      },
      params: {
        id: values.id,
      },
    });
  }

  async function handleSelectPendingInvoice(invoice: InvoiceDto) {
    reset(invoice);
    if (invoice.customerId) fetchCustomerById(invoice.customerId);
  }

  useEffect(() => {
    fetchProductGroups();
    fetchPendingInvoices();
  }, []);

  useEffect(() => {
    fetchProducts(productsSearch);
  }, [productsSearch.search, productsSearch.page, productsSearch.pageSize, productsSearch.readDto?.productGroupId]);

  useEffect(() => {
    fetchCustomers(customersSearch);
  }, [customersSearch.search, customersSearch.page, customersSearch.pageSize]);

  function handleAddProduct(product: IProduct) {
    const details = getValues("details");
    if (product.productUnits.length === 0) return;

    let isFound = false;
    for (let i = 0; i < details.length; i++) {
      const ele = details[i];

      if (ele.productId === product.id) {
        ele.qty += 1;
        details[i] = ele;
        isFound = true;
      }
    }

    if (!isFound) {
      const invoiceProduct = productPriceCalc(product);
      if (!invoiceProduct) return;
      details.push(invoiceProduct);
    }

    setValue("details", details);
  }

  function handleChangeProductQuantity(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, row: InvoiceProductRow) {
    const details = getValues("details");

    const invoiceProduct = invoiceProductPriceCalc(new InvoiceProductRow({ ...row, qty: +e.target.value }));
    if (!invoiceProduct) return;

    setValue(
      "details",
      details.map((x) => (x.rowId === row.rowId ? { ...x, ...invoiceProduct } : x)),
    );
  }

  function handleDeleteProductRow(rowId: string) {
    const productUnits = getValues("details").filter((x) => x.rowId !== rowId);
    setValue("details", productUnits);
  }

  function handleAddInvoiceDiscount(type: number, val: number) {
    setValue("discountType", type);
    setValue("discountValue", val);
  }

  function handleSearchInputChange(e: ChangeEvent<HTMLInputElement>) {
    switch (tab.value) {
      case 0:
        setProductsSearch({ ...productsSearch, search: e.target.value });
        break;
      case 1:
        setCustomersSearch({ ...customersSearch, search: e.target.value });
        break;
    }
  }

  function handleSearchSubmit() {
    switch (tab.value) {
      case 0:
        fetchProducts(productsSearch);
        break;
      case 1:
        fetchCustomers(customersSearch);
        break;
    }
  }

  function handleNewInvoice() {
    setCustomer(undefined);
    reset(new InvoiceDto());
  }

  async function handleDelete(id: string) {
    await fetchClient(EndPointsEnums.SALES_INVOICE, {
      method: "DELETE",
      headers: {
        Tenant: tenantId,
      },
      params: {
        id,
      },
    });
  }

  async function handleCancelOrder() {
    const invoiceId = getValues("id");

    try {
      if (invoiceId) {
        await handleDelete(invoiceId);
        await fetchPendingInvoices();
      }
      handleNewInvoice();
    } catch (error) {
      console.log(error);
    }
  }

  const disabled = isProductsLocked || isHttpClientLoading;

  return (
    <div className="flex h-[calc(100%-64px)] pt-4">
      <div
        className={classNameGen(
          "h-full flex-grow overflow-y-auto bg-white p-4 rounded-2xl gap-y-4 flex flex-col",
          isProductsLocked && "opacity-50",
        )}
      >
        {errMsgs.map((x, i) => (
          <div key={i} className="text-[var(--danger)]">
            {x}
          </div>
        ))}
        <div className="flex gap-1.5 w-full overflow-x-auto h-fit overflow-y-hidden flex-shrink-0">
          {pendingInvoices.map((item, index) => (
            <button
              type="button"
              key={index}
              disabled={disabled}
              onClick={() => handleSelectPendingInvoice(item)}
              className="h-16 min-w-40 border border-solid rounded-xl flex p-1 border-[#EEF2F5]"
            >
              <span
                className="h-14 min-w-14 p-1 flex justify-center items-center shrink-0 rounded-lg"
                style={{ backgroundColor: item.id === watch("id") ? "var(--bg_order_active)" : "var(--bg_order_pending)" }}
              >
                <span>{t("Ord")}.</span>
                <span className="text-lg">{index + 1}</span>
              </span>
              <span className="h-14 w-full flex flex-col justify-center">
                <span className="w-full grid grid-cols-[repeat(2,auto)] items-center">
                  <span className="flex items-center justify-end">
                    <GoClock className="w-5 h-5 text-[#757575]" />
                  </span>
                  <span> {dayjs(item.date).format("HH:mm A")}</span>
                  <span />
                  <span className="text-[#616161] whitespace-nowrap">
                    {item.details.reduce((prev, curr) => prev + curr.qty, 0)} {t("items")}
                  </span>
                </span>
              </span>
            </button>
          ))}
        </div>
        <CashierInvoiceItemsTable
          details={watch("details")}
          isProductsLocked={isProductsLocked}
          handleChangeProductQuantity={handleChangeProductQuantity}
          handleDeleteProductRow={handleDeleteProductRow}
        />
        <CashierInvoiceSummary
          details={watch("details")}
          discountType={watch("discountType")}
          discountValue={watch("discountValue")}
          handleAddInvoiceDiscount={handleAddInvoiceDiscount}
        />
        <CashierConfirmOrder
          isProductsLocked={isProductsLocked}
          paid={paidInput}
          setPaid={setPaidInput}
          customer={customer}
          date={watch("date")}
          details={watch("details")}
          discountType={watch("discountType")}
          discountValue={watch("discountValue")}
          onSubmit={onSubmit}
          setRemainingAmount={(val) => {
            setValue("remainingAmount", val);
          }}
        />
      </div>
      <div className="flex-shrink-0 h-full w-[853px] overflow-y-auto flex flex-col gap-y-4">
        <div className="flex justify-between gap-4 px-4 pb-2 items-center sticky top-0 bg-[var(--bg)]">
          <div className="flex gap-2 flex-grow">
            <Select
              size="small"
              disabled={isHttpClientLoading}
              value={tab.value}
              className="bg-white"
              placeholder={t("Search for")}
              sx={{ minWidth: 210, borderRadius: "8px" }}
              onChange={(e) => {
                const val = TABS.find((x) => x.value === e.target.value);
                if (val) setTab(val);
              }}
            >
              {TABS.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {t(item.label)}
                </MenuItem>
              ))}
            </Select>
            <TextFieldAtom
              disabled={isHttpClientLoading}
              slotProps={{ input: { style: { borderRadius: "8px", backgroundColor: "white" } } }}
              placeholder={t(tab.value === 0 ? "Search for products" : "Search for a customer")}
              value={tab.value === 0 ? productsSearch.search : customersSearch.search}
              onChange={handleSearchInputChange}
              fullWidth
              onKeyDown={(e) => e.key === "Enter" && !e.altKey && !e.ctrlKey && !e.shiftKey && handleSearchSubmit()}
            />
            {tab.value === 0 && (
              <Select
                size="small"
                disabled={isHttpClientLoading}
                displayEmpty
                value={productsSearch.readDto?.productGroupId || ""}
                className="bg-white"
                placeholder={t("Search for")}
                sx={{ minWidth: 210, borderRadius: "8px" }}
                onChange={(e) => {
                  setProductsSearch((prev) => ({ ...prev, page: 1, readDto: { productGroupId: e.target.value || undefined } }));
                }}
              >
                <MenuItem value={""}>{t("All Sections")}</MenuItem>
                {productGroups.map((item) => (
                  <MenuItem key={item?.id} value={item?.id}>
                    {getTranslatedName(item?.names, i18n.language) || item?.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          </div>
          <div className="flex gap-2 items-center">
            {tab.value === 0 ? (
              <div>
                <IconButton
                  type="button"
                  disabled={isHttpClientLoading}
                  onClick={() => setIsProductsLocked((prev) => !prev)}
                  color={isProductsLocked ? "primary" : "default"}
                >
                  {isProductsLocked ? <MdLock /> : <MdLockOpen />}
                </IconButton>
              </div>
            ) : (
              <div>
                <IconButton type="button" disabled={isHttpClientLoading} onClick={() => setTab(TABS[0])}>
                  <LuBox />
                </IconButton>
              </div>
            )}
          </div>
        </div>
        <div className="px-4 flex-grow">
          {tab.value === 0 ? (
            <CashierProducts
              tenantId={tenantId}
              products={products}
              handleAddProduct={handleAddProduct}
              productsSearch={productsSearch}
              setProductsSearch={setProductsSearch}
              productsPagination={productsPagination}
              isProductsLocked={isProductsLocked}
            />
          ) : (
            tab.value === 1 && (
              <CashierCustomers
                tenantId={tenantId}
                customerId={watch("customerId")}
                setCustomer={(val) => {
                  setCustomer(val);
                  if (val.id) setValue("customerId", val.id);
                }}
                fetchCustomers={fetchCustomers}
                customers={customers}
                customersSearch={customersSearch}
                setCustomersSearch={setCustomersSearch}
                customersPagination={customersPagination}
              />
            )
          )}
        </div>
        <div className="flex gap-3 sticky bottom-0 p-4 bg-white">
          <Button
            type="button"
            disabled={disabled}
            variant="contained"
            className="gap-2"
            sx={{ ...cashierButtonStyle }}
            onClick={() => setTab(TABS[1])}
          >
            {customer?.name ?? (
              <>
                <HiOutlineUserAdd className="w-5 h-5" />
                {t("Select customer")}
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outlined"
            className="gap-2"
            disabled={disabled}
            sx={{ ...cashierButtonStyle, color: "var(--main_bg)", borderColor: "var(--main_bg)" }}
            onClick={() => onSubmit()}
          >
            <GoClock className="w-5 h-5" />
            {t("Add to waiting list")}
          </Button>
          <Button
            type="button"
            disabled={disabled}
            variant="outlined"
            color="error"
            className="gap-2"
            sx={{ ...cashierButtonStyle }}
            onClick={handleCancelOrder}
          >
            <IoCloseCircleOutline className="w-6 h-6" />
            {t("Cancel order")}
          </Button>
          <Button
            type="button"
            disabled={disabled}
            variant="outlined"
            className="gap-2"
            sx={{ ...cashierButtonStyle, color: "var(--main_bg)", borderColor: "var(--main_bg)" }}
          >
            <IoPrintOutline className="w-5 h-5" />
            {t("Print last invoice")}
          </Button>
          <ButtonBase
            type="button"
            disabled={disabled}
            className="h-12 w-12 rounded-lg"
            aria-controls={open ? "cashier-options-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            sx={{ ...cashierIconButtonStyle, backgroundColor: "#F1F5F8" }}
          >
            <BsThreeDots className="w-4" />
          </ButtonBase>
          <Menu
            id="cashier-options-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{ "aria-labelledby": "cashier-options-button" }}
          >
            <MenuItem
              onClick={() => {
                handleNewInvoice();
                handleClose();
              }}
              className="flex gap-2"
            >
              <LuTrash2 className="w-4 text-[var(--danger)]" />
              <span className="text-[var(--danger)]">{t("Remove all products")}</span>
            </MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
}
