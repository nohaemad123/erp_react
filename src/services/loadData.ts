import { ResultHandler } from "@/@types/classes/ResultHandler";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import { IBank } from "@/@types/interfaces/IBank";
import { IBankCard } from "@/@types/interfaces/IBankCard";
import { IBranch } from "@/@types/interfaces/IBranch";
import { ICommissionType } from "@/@types/interfaces/ICommissionType";
import { ICountry } from "@/@types/interfaces/ICountry";
import { ICustomer } from "@/@types/interfaces/ICustomer";
import { ICustomerGroup } from "@/@types/interfaces/ICustomerGroup";
import { IPaymentMethod } from "@/@types/interfaces/IPaymentMethod";
import { IPrice } from "@/@types/interfaces/IPrice";
import { IExpense } from "@/@types/interfaces/IExpense";
import { INationality } from "@/@types/interfaces/INationality";
import { IPagination } from "@/@types/interfaces/IPagination";
import { IProductGroup } from "@/@types/interfaces/IProductGroup";
import { IRegion } from "@/@types/interfaces/IRegion";
import { IRepresentative } from "@/@types/interfaces/IRepresentative";
import { IRoleUser } from "@/@types/interfaces/IRoleUser";
import { ISafe } from "@/@types/interfaces/ISafe";
import { ISearch } from "@/@types/interfaces/ISearch";
import { IStore } from "@/@types/interfaces/IStore";
import { IStoreKeeper } from "@/@types/interfaces/IStorKeeper";
import { ISupplier } from "@/@types/interfaces/ISupplier";
import { ISupplierGroup } from "@/@types/interfaces/ISupplierGroup";
import { ITax } from "@/@types/interfaces/ITax";
import { IUnit } from "@/@types/interfaces/IUnit";
import { IUser } from "@/@types/interfaces/IUser";
import fetchClient from "@/lib/fetchClient";
import { IProduct, IProductUnit } from "@/@types/interfaces/IProduct";
import { EndPointsReports } from "@/@types/enums/endPiontReports";
import { IAccount } from "@/@types/interfaces/IAccount";
import { IPayment } from "@/@types/interfaces/IPayment";
import { IReceiptVourcher } from "@/@types/interfaces/IReceiptVoucher";
import { IIncomingStoreTransaction } from "@/@types/interfaces/IIncomingStoreTransactions";
import { IInvoice } from "@/@types/interfaces/IInvoice";
import { IOutgoingStockDto } from "@/@types/dto/OutgoingStockDto";
import { IOutgoingStoreTransaction } from "@/@types/interfaces/IOutgoingStoreTransactions";
import { IIncomingStockDto } from "@/@types/dto/IncomingStockDto";
import { IStoreTransferTransaction } from "@/@types/interfaces/IStoreTransferTransaction";
import { IStoreTransactionDto } from "@/@types/dto/StoreTransferDto";
import { IPurchaseInvoiceDto } from "@/@types/dto/PurchaseInvoiceDto";
import { ISalesInvoiceDto } from "@/@types/dto/SalesInvoiceDto";
import { IPurchaseReturnInvoiceDto } from "@/@types/dto/PurchaseReturnInvoiceDto";
import { ISalesReturnInvoiceDto } from "@/@types/dto/SalesReturnInvoiceDto";

export async function getNewSupplierCode(locale: string, tenantId: string) {
  const { data } = await fetchClient<ResultHandler<number>>(EndPointsEnums.VENDOR_CODE, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getAllSupplierGroups(locale: string, tenantId: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: ISupplierGroup[]; paginationData: IPagination }>>(
    EndPointsEnums.ALL_VENDOR_GROUPS,
    {
      method: "POST",
      body: searchObj,
      headers: {
        Tenant: tenantId,
        "Accept-Language": locale,
      },
    },
  );
  return data;
}

export async function getAllSuppliers(locale: string, tenantId: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: ISupplier[]; paginationData: IPagination }>>(
    EndPointsEnums.ALL_VENDORS,
    {
      method: "POST",
      body: searchObj,
      headers: {
        Tenant: tenantId,
        "Accept-Language": locale,
      },
    },
  );
  return data;
}

export async function getSupplierById(locale: string, tenantId: string, id: string) {
  const { data } = await fetchClient<ResultHandler<ISupplier>>(EndPointsEnums.VENDOR + "/" + id, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getAllSupplierPrices(locale: string, tenantId: string) {
  const data = await fetchClient<IPrice[]>(EndPointsEnums.ALL_LIST_VALUE_VENDOR_PRICES, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getAllIncomingStoreTransactions(locale: string, tenantId: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: IIncomingStoreTransaction[]; paginationData: IPagination }>>(
    EndPointsEnums.ALL_INCOMING_STORE_TRANSACTION,
    {
      method: "POST",
      body: searchObj,
      headers: {
        Tenant: tenantId,
        "Accept-Language": locale,
      },
    },
  );
  return data;
}

export async function getIncomingStockTransactionById(locale: string, tenantId: string, id: string) {
  const { data } = await fetchClient<ResultHandler<IIncomingStockDto>>(EndPointsEnums.INCOMING_STORE_TRANSACTION + "/" + id, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getAllIncomingStoreTypes(locale: string, tenantId: string) {
  const data = await fetchClient<IPaymentMethod[]>(EndPointsEnums.LIST_VALUE_INCOMING_STORE_TYPES, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getNewIncomingStoreCode(locale: string, tenantId: string) {
  const { data } = await fetchClient<ResultHandler<number>>(EndPointsEnums.INCOMING_STORE_TRANSACTION_CODE, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getNewProductCode(locale: string, tenantId: string) {
  const { data } = await fetchClient<ResultHandler<number>>(EndPointsEnums.PRODUCT_CODE, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

// OUTGOING
export async function getAllOutgoingStoreTransactions(locale: string, tenantId: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: IOutgoingStoreTransaction[]; paginationData: IPagination }>>(
    EndPointsEnums.ALL_OUTGOING_STORE_TRANSACTION,
    {
      method: "POST",
      body: searchObj,
      headers: {
        Tenant: tenantId,
        "Accept-Language": locale,
      },
    },
  );
  return data;
}

export async function getOutgoingStockTransactionById(locale: string, tenantId: string, id: string) {
  const { data } = await fetchClient<ResultHandler<IOutgoingStockDto>>(EndPointsEnums.OUTGOING_STORE_TRANSACTION + "/" + id, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getAllOutgoingStoreTypes(locale: string, tenantId: string) {
  const data = await fetchClient<IPaymentMethod[]>(EndPointsEnums.LIST_VALUE_OUTGOING_STORE_TYPES + "/getAll", {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getNewOutgoingStoreCode(locale: string, tenantId: string) {
  const { data } = await fetchClient<ResultHandler<number>>(EndPointsEnums.OUTGOING_STORE_TRANSACTION_CODE, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

// STORE TRANSFER
export async function getAllStoreTransferTransactions(locale: string, tenantId: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: IStoreTransferTransaction[]; paginationData: IPagination }>>(
    EndPointsEnums.ALL_STORE_TRANSFER_TRANSACTION,
    {
      method: "POST",
      body: searchObj,
      headers: {
        Tenant: tenantId,
        "Accept-Language": locale,
      },
    },
  );
  return data;
}

export async function getStoreTransferTransactionById(locale: string, tenantId: string, id: string) {
  const { data } = await fetchClient<ResultHandler<IStoreTransactionDto>>(EndPointsEnums.TRANSFER_STORE_TRANSACTION + "/" + id, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getAllStoreTransfersTypes(locale: string, tenantId: string) {
  const data = await fetchClient<IPaymentMethod[]>(EndPointsEnums.LIST_VALUE_OUTGOING_STORE_TYPES + "/getAll", {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getNewStoreTransferCode(locale: string, tenantId: string) {
  const { data } = await fetchClient<ResultHandler<number>>(EndPointsEnums.STORE_TRANSFER_TRANSACTION_CODE, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getNewCustomerCode(locale: string, tenantId: string) {
  const { data } = await fetchClient<ResultHandler<number>>(EndPointsEnums.CUSTOMER_CODE, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getNewPaymentCode(locale: string, tenantId: string) {
  const { data } = await fetchClient<ResultHandler<number>>(EndPointsEnums.PAYMENT_CODE, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getNewReceiptVoucherCode(locale: string, tenantId: string) {
  const { data } = await fetchClient<ResultHandler<number>>(EndPointsEnums.RECEIPT_VOUCHER_CODE, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getAllCustomerGroups(locale: string, tenantId: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: ICustomerGroup[]; paginationData: IPagination }>>(
    EndPointsEnums.ALL_CUSTOMER_GROUPs,
    {
      method: "POST",
      body: searchObj,
      headers: {
        Tenant: tenantId,
        "Accept-Language": locale,
      },
    },
  );
  return data;
}

export async function getAllCustomers(locale: string, tenantId: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: ICustomer[]; paginationData: IPagination }>>(
    EndPointsEnums.ALL_CUSTOMERS,
    {
      method: "POST",
      body: searchObj,
      headers: {
        Tenant: tenantId,
        "Accept-Language": locale,
      },
    },
  );
  return data;
}

export async function getCustomerById(locale: string, tenantId: string, id: string) {
  const { data } = await fetchClient<ResultHandler<ICustomer>>(EndPointsEnums.CUSTOMER + "/" + id, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getAllInvoices(locale: string, tenantId: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: IInvoice[]; paginationData: IPagination }>>(
    EndPointsEnums.ALL_SALES_INVOICES,
    {
      method: "POST",
      body: searchObj,
      headers: {
        Tenant: tenantId,
        "Accept-Language": locale,
      },
    },
  );
  return data;
}

export async function getInvoiceById(locale: string, tenantId: string, id: string) {
  const { data } = await fetchClient<ResultHandler<IInvoice>>(EndPointsEnums.SALES_INVOICE + "/" + id, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getPurchaseInvoiceReport(locale: string, tenantId: string, id: string) {
  const data = await fetchClient<{ id: null; stringBase64: string }>(EndPointsEnums.PURCHASE_INVOICE_REPORT, {
    method: "GET",
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
    params: {
      id: id,
    },
  });
  return data;
}

export async function getPurchaseReturnInvoiceReport(locale: string, tenantId: string, id: string) {
  const data = await fetchClient<{ id: null; stringBase64: string }>(EndPointsEnums.PURCHASE_RETUTN_INVOICE_REPORT, {
    method: "GET",
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
    params: {
      id: id,
    },
  });
  return data;
}

export async function getAllCustomerPrices(locale: string, tenantId: string) {
  const data = await fetchClient<IPrice[]>(EndPointsEnums.ALL_LIST_VALUE_CUSTOMER_PRICES, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getAllBranches(locale: string, tenantId: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: IBranch[]; paginationData: IPagination }>>(EndPointsEnums.AllBranch, {
    method: "POST",
    body: searchObj,
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getAllAccounts(locale: string, tenantId: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: IAccount[]; paginationData: IPagination }>>(EndPointsEnums.AllAccount, {
    method: "POST",
    body: searchObj,
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getAllPayments(locale: string, tenantId: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: IPayment[]; paginationData: IPagination }>>(EndPointsEnums.ALLPAYMENT, {
    method: "POST",
    body: searchObj,
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getAllReceiptVoucher(locale: string, tenantId: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: IReceiptVourcher[]; paginationData: IPagination }>>(
    EndPointsEnums.ALL_RECEIPT_VOUCHER,
    {
      method: "POST",
      body: searchObj,
      headers: {
        Tenant: tenantId,
        "Accept-Language": locale,
      },
    },
  );
  return data;
}

export async function getAllBanks(locale: string, tenantId: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: IBank[]; paginationData: IPagination }>>(EndPointsEnums.AllBank, {
    method: "POST",
    body: searchObj,
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getAllTaxes(locale: string, tenantId: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: ITax[]; paginationData: IPagination }>>(EndPointsEnums.AllTax, {
    method: "POST",
    body: searchObj,
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function GetAllStores(locale: string, tenantId: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: IStore[]; paginationData: IPagination }>>(EndPointsEnums.AllStore, {
    method: "POST",
    body: searchObj,
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getAllUsers(locale: string, tenantId: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: IUser[]; paginationData: IPagination }>>(EndPointsEnums.AllUser, {
    method: "POST",
    body: searchObj,
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getAllBankCards(locale: string, tenantId: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: IBankCard[]; paginationData: IPagination }>>(
    EndPointsEnums.AllBankCards,
    {
      method: "POST",
      body: searchObj,
      headers: {
        Tenant: tenantId,
        "Accept-Language": locale,
      },
    },
  );
  return data;
}

export async function getAllSafes(locale: string, tenantId: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: ISafe[]; paginationData: IPagination }>>(EndPointsEnums.ALLSafe, {
    method: "POST",
    body: searchObj,
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getAllExpenses(locale: string, tenantId: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: IExpense[]; paginationData: IPagination }>>(
    EndPointsEnums.ALL_Expense,
    {
      method: "POST",
      body: searchObj,
      headers: {
        Tenant: tenantId,
        "Accept-Language": locale,
      },
    },
  );
  return data;
}

export async function getAllStoreKeepers(locale: string, tenantId: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: IStoreKeeper[]; paginationData: IPagination }>>(
    EndPointsEnums.ALL_STORE_KEEPERS,
    {
      method: "POST",
      body: searchObj,
      headers: {
        Tenant: tenantId,
        "Accept-Language": locale,
      },
    },
  );
  return data;
}

export async function getUserById(locale: string, tenantId: string, id: string) {
  const { data } = await fetchClient<ResultHandler<IUser>>(EndPointsEnums.User + "/" + id, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getExpenseById(locale: string, tenantId: string, id: string) {
  const { data } = await fetchClient<ResultHandler<IExpense>>(EndPointsEnums.EXPENSE + "/" + id, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getBranchById(locale: string, tenantId: string, id: string) {
  const { data } = await fetchClient<ResultHandler<IBranch>>(EndPointsEnums.BRANCH + "/" + id, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getStoreById(locale: string, tenantId: string, id: string) {
  const { data } = await fetchClient<ResultHandler<IStore>>(EndPointsEnums.Store + "/" + id, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getSafeById(locale: string, tenantId: string, id: string) {
  const { data } = await fetchClient<ResultHandler<ISafe>>(EndPointsEnums.SAFE + "/" + id, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getBranchCardById(locale: string, tenantId: string, id: string) {
  const { data } = await fetchClient<ResultHandler<IBankCard>>(EndPointsEnums.BANK_CARD + "/" + id, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getBankById(locale: string, tenantId: string, id: string) {
  const { data } = await fetchClient<ResultHandler<IBranch>>(EndPointsEnums.BANK + "/" + id, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getAllRoleUser(locale: string, tenantId: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: IRoleUser[]; paginationData: IPagination }>>(
    EndPointsEnums.AllRoleUser,
    {
      method: "POST",
      body: searchObj,
      headers: {
        Tenant: tenantId,
        "Accept-Language": locale,
      },
    },
  );
  return data;
}

export async function getAllUnits(locale: string, tenantId: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: IUnit[]; paginationData: IPagination }>>(EndPointsEnums.ALL_UNIT_TYPE, {
    method: "POST",
    body: searchObj,
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getProductsUnits(locale: string, tenantId: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: IProductUnit[]; paginationData: IPagination }>>(
    EndPointsEnums.PRODUCT_UNIT + "/GetAll",
    {
      method: "POST",
      body: searchObj,
      headers: {
        Tenant: tenantId,
        "Accept-Language": locale,
      },
    },
  );
  return data;
}

export async function getUnitsByProductId(locale: string, productId: string, tenantId: string) {
  const { data } = await fetchClient<ResultHandler<{ listData: IUnit[]; paginationData: IPagination }>>(
    EndPointsEnums.PRODUCT_UNIT + "/GetAll",
    {
      method: "POST",
      body: {
        readDto: {
          productId,
        },
      },
      headers: {
        Tenant: tenantId,
        "Accept-Language": locale,
      },
    },
  );
  return data;
}

export async function getUniyById(locale: string, tenantId: string, id: string) {
  const { data } = await fetchClient<ResultHandler<IUnit>>(EndPointsEnums.UNIT_TYPE + "/" + id, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getAllNationalities(locale: string, tenantId: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: INationality[]; paginationData: IPagination }>>(
    EndPointsEnums.All_COUNTRY,
    {
      method: "POST",
      body: searchObj,
      headers: {
        Tenant: tenantId,
        "Accept-Language": locale,
      },
    },
  );
  return data;
}

export async function getAllStores(locale: string, tenantId: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: IStore[]; paginationData: IPagination }>>(EndPointsEnums.AllStore, {
    method: "POST",
    body: searchObj,
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getAllRepresentatives(locale: string, tenantId: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: IRepresentative[]; paginationData: IPagination }>>(
    EndPointsEnums.ALL_REPRESENTATIVE,
    {
      method: "POST",
      body: searchObj,
      headers: {
        Tenant: tenantId,
        "Accept-Language": locale,
      },
    },
  );
  return data;
}

export async function getRepresentativeById(locale: string, tenantId: string, id: string) {
  const { data } = await fetchClient<ResultHandler<IRepresentative>>(EndPointsEnums.REPRESENTATIVE + "/" + id, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getPaymentById(locale: string, tenantId: string, id: string) {
  const { data } = await fetchClient<ResultHandler<IPayment>>(EndPointsEnums.PAYMENT + "/" + id, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getAllCountries(locale: string, tenantId: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: ICountry[]; paginationData: IPagination }>>(
    EndPointsEnums.All_COUNTRY,
    {
      method: "POST",
      body: searchObj,
      headers: {
        Tenant: tenantId,
        "Accept-Language": locale,
      },
    },
  );
  return data;
}

export async function getAllRegions(locale: string, tenantId: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: IRegion[]; paginationData: IPagination }>>(EndPointsEnums.ALL_REGION, {
    method: "POST",
    body: searchObj,
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getAllPaymentMethods(locale: string, tenantId: string) {
  const data = await fetchClient<IPaymentMethod[]>(EndPointsEnums.ALL_LIST_VALUE_PAYMENT_METHODS, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getAllCashierPaymentMethods(locale: string, tenantId: string) {
  const data = await fetchClient<IPaymentMethod[]>(EndPointsEnums.ALL_PAYMENT_METHODS, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getAllCommissionType(locale: string, tenantId: string) {
  const data = await fetchClient<ICommissionType[]>(EndPointsEnums.ALL_LIST_VALUE_COMMISSION_TYPE, {
    method: "GET",
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getAllProductGroups(locale: string, tenantId: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: IProductGroup[]; paginationData: IPagination }>>(
    EndPointsEnums.ALL_PRODUCT_GROUP,
    {
      method: "POST",
      body: searchObj,
      headers: {
        Tenant: tenantId,
        "Accept-Language": locale,
      },
    },
  );
  return data;
}

export async function getProductGroupById(locale: string, tenantId: string, id: string) {
  const { data } = await fetchClient<ResultHandler<IProductGroup>>(EndPointsEnums.PRODUCT_GROUP + "/" + id, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getAllProducts(locale: string, tenantId: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: IProduct[]; paginationData: IPagination }>>(
    EndPointsEnums.ALL_PRODUCTS,
    {
      method: "POST",
      body: searchObj,
      headers: {
        Tenant: tenantId,
        "Accept-Language": locale,
      },
    },
  );
  return data;
}

export async function getProductById(locale: string, tenantId: string, id: string) {
  const { data } = await fetchClient<ResultHandler<IProduct>>(EndPointsEnums.PRODUCT + "/" + id, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getTaxById(locale: string, tenantId: string, id: string) {
  const { data } = await fetchClient<ResultHandler<ITax>>(EndPointsEnums.TAX_TYPE + "/" + id, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getReceiptVoucherById(locale: string, tenantId: string, id: string) {
  const { data } = await fetchClient<ResultHandler<IReceiptVourcher>>(EndPointsEnums.RECEIPT_VOUCHER + "/" + id, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getAllTaxType(locale: string, tenantId: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: ITax[]; paginationData: IPagination }>>(EndPointsEnums.ALL_TAX_TYPE, {
    method: "POST",
    body: searchObj,
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getAllProduct(locale: string, tenantId: string, searchObj: Partial<ISearch> = {}) {
  const { data } = await fetchClient<ResultHandler<{ listData: IProduct[]; paginationData: IPagination }>>(
    EndPointsEnums.ALL_PRODUCTS,
    {
      method: "POST",
      body: searchObj,
      headers: {
        Tenant: tenantId,
        "Accept-Language": locale,
      },
    },
  );
  return data;
}

export async function GetAllInvoiceTypes(locale: string, tenantId: string) {
  const data = await fetchClient<ICommissionType[]>(EndPointsEnums.ALL_LIST_INVOICE_DEAL_TYPE, {
    method: "GET",
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getDiscountType(locale: string, tenantId: string) {
  const data = await fetchClient<ICommissionType[]>(EndPointsEnums.ALL_LIST_VALUE_TYPES, {
    method: "GET",
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

// ---------------- REPORTS ----------------
export async function PurchaseAnalysisReport(locale: string, tenantId: string, payload: any) {
  const data = await fetchClient<any>(EndPointsReports.MAIN_HOST + EndPointsReports.PurchaseAnalysisReport, {
    method: "POST",
    body: payload,
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function PurchaseTotalReport(locale: string, tenantId: string, payload: any) {
  const data = await fetchClient<any>(EndPointsReports.MAIN_HOST + EndPointsReports.PurchaseTotalReport, {
    method: "POST",
    body: payload,
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function PurchaseReturnAnalysisReport(locale: string, tenantId: string, payload: any) {
  const data = await fetchClient<any>(EndPointsReports.MAIN_HOST + EndPointsReports.PurchaseReturnAnalysisReport, {
    method: "POST",
    body: payload,
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function PurchaseReturnTotalReport(locale: string, tenantId: string, payload: any) {
  const data = await fetchClient<any>(EndPointsReports.MAIN_HOST + EndPointsReports.PurchaseReturnTotalReport, {
    method: "POST",
    body: payload,
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getNewPurchaseOrderCode(locale: string, tenantId: string) {
  const { data } = await fetchClient<ResultHandler<number>>(EndPointsEnums.PURCHASE_ORDER_CODE, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

// Purchase Invoice

export async function getAllPurchasesInvoicesList(
  locale: string,
  tenantId: string,
  searchObj: Partial<ISearch> = { selectColumns: ["id", "code"] },
) {
  const { data } = await fetchClient<ResultHandler<{ listData: IPurchaseInvoiceDto[]; paginationData: IPagination }>>(
    EndPointsEnums.ALL_PURCHASE_INVOICE,
    {
      method: "POST",
      headers: {
        Tenant: tenantId,
        "Accept-Language": locale,
      },
      body: searchObj,
    },
  );
  return data;
}

export async function getPurchaseInvoiceById(locale: string, tenantId: string, id: string) {
  const { data } = await fetchClient<ResultHandler<IPurchaseInvoiceDto>>(EndPointsEnums.PURCHASE_INVOICE + "/" + id, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getNewPurchaseInvoiceCode(locale: string, tenantId: string) {
  const { data } = await fetchClient<ResultHandler<number>>(EndPointsEnums.PURCHASE_INVOICE_CODE, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

// Purchase Return Invoice

export async function getAllPurchasesReturnInvoicesList(
  locale: string,
  tenantId: string,
  searchObj: Partial<ISearch> = { selectColumns: ["id", "code"] },
) {
  const { data } = await fetchClient<ResultHandler<{ listData: IPurchaseReturnInvoiceDto[]; paginationData: IPagination }>>(
    EndPointsEnums.ALL_PURCHASE_RETURN_INVOICE,
    {
      method: "POST",
      headers: {
        Tenant: tenantId,
        "Accept-Language": locale,
      },
      body: searchObj,
    },
  );
  return data;
}

export async function getPurchaseReturnInvoiceById(locale: string, tenantId: string, id: string) {
  const { data } = await fetchClient<ResultHandler<IPurchaseReturnInvoiceDto>>(EndPointsEnums.PURCHASE_RETURN_INVOICE + "/" + id, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getNewPurchaseReturnInvoiceCode(locale: string, tenantId: string) {
  const { data } = await fetchClient<ResultHandler<number>>(EndPointsEnums.PURCHASE_RETURN_INVOICE_CODE, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getNewSalesOrderCode(locale: string, tenantId: string) {
  const { data } = await fetchClient<ResultHandler<number>>(EndPointsEnums.SALES_ORDER_CODE, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

// Sales Invoices

export async function getAllSalesInvoicesList(
  locale: string,
  tenantId: string,
  searchObj: Partial<ISearch> = { selectColumns: ["id", "code"] },
) {
  const { data } = await fetchClient<ResultHandler<{ listData: ISalesInvoiceDto[]; paginationData: IPagination }>>(
    EndPointsEnums.ALL_SALES_INVOICES,
    {
      method: "POST",
      headers: {
        Tenant: tenantId,
        "Accept-Language": locale,
      },
      body: searchObj,
    },
  );
  return data;
}

export async function getSalesInvoiceById(locale: string, tenantId: string, id: string) {
  const { data } = await fetchClient<ResultHandler<ISalesInvoiceDto>>(EndPointsEnums.SALES_INVOICE + "/" + id, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getNewSalesInvoiceCode(locale: string, tenantId: string) {
  const { data } = await fetchClient<ResultHandler<number>>(EndPointsEnums.SALES_INVOICE_CODE, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getAllSalesReturnInvoicesList(
  locale: string,
  tenantId: string,
  searchObj: Partial<ISearch> = { selectColumns: ["id", "code"] },
) {
  const { data } = await fetchClient<ResultHandler<{ listData: ISalesReturnInvoiceDto[]; paginationData: IPagination }>>(
    EndPointsEnums.ALL_SALES_RETURN_INVOICES,
    {
      method: "POST",
      headers: {
        Tenant: tenantId,
        "Accept-Language": locale,
      },
      body: searchObj,
    },
  );
  return data;
}

export async function getSalesReturnInvoiceById(locale: string, tenantId: string, id: string) {
  const { data } = await fetchClient<ResultHandler<ISalesReturnInvoiceDto>>(EndPointsEnums.SALES_RETURN_INVOICE + "/" + id, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}

export async function getNewSalesReturnInvoiceCode(locale: string, tenantId: string) {
  const { data } = await fetchClient<ResultHandler<number>>(EndPointsEnums.SALES_RETURN_INVOICE_CODE, {
    headers: {
      Tenant: tenantId,
      "Accept-Language": locale,
    },
  });
  return data;
}
