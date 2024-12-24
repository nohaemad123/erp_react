"use client";

import { ICustomer } from "@/@types/interfaces/ICustomer";
import { IPagination } from "@/@types/interfaces/IPagination";
import { ButtonBase, Box, Modal } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import actions_icon from "@/assets/images/actions-icon.svg";
import { FiEdit, FiEye } from "react-icons/fi";
import { SearchDto } from "@/@types/dto/SearchDto";
import { Dispatch, SetStateAction, useState } from "react";
import CustomerFormTemplate from "@/components/template/customers/CustomerFormTemplate";
import { PaginationAtom } from "@/components/atom/PaginationAtom";

interface ICashierCustomersProps {
  tenantId: string;
  customerId: string | null;
  setCustomer: (customer: ICustomer) => void;
  customers: ICustomer[];
  customersSearch: SearchDto;
  customersPagination: IPagination | undefined;
  setCustomersSearch: Dispatch<SetStateAction<SearchDto>>;
  fetchCustomers(params: SearchDto): Promise<void>;
}

export default function CashierCustomers({
  tenantId,
  customerId,
  setCustomer,
  customers,
  customersSearch,
  customersPagination,
  setCustomersSearch,
  fetchCustomers,
}: Readonly<ICashierCustomersProps>) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [customerIdModal, setCustomerIdModal] = useState<string | undefined>(undefined);
  const [modalType, setModalType] = useState<"view" | "add" | "edit">("add");

  const columns: GridColDef<ICustomer>[] = [
    { field: "id", headerName: "#", minWidth: 150 },
    { field: "name", headerName: t("Name"), minWidth: 150, flex: 1, sortable: true },
    { field: "mobile", headerName: t("Mobile"), sortable: true },
    { field: "address", headerName: t("Address"), sortable: true },
    {
      field: "actions",
      minWidth: 130,
      sortable: false,
      renderHeader: () => (
        <Image
          src={actions_icon}
          alt="logo"
          width={32}
          className="text-center justify-center m-auto actions_tr"
          style={{ textAlign: "center", margin: "auto" }}
        />
      ),
      renderCell: (params) => (
        <div className="flex h-full items-center gap-2">
          <ButtonBase
            title="customer view"
            className="action_button flex justify-center items-center w-8 h-8 p-2 leading-4 transition-colors duration-200 border text-gray-500 border-gray rounded-md cursor-pointer group hover:border-[var(--primary)] hover:bg-[var(--primary)]"
            onClick={() => {
              setCustomerIdModal(params.row.id);
              setModalType("view");
              setIsOpen(true);
            }}
          >
            <FiEye width="20" className="w-4 h-4  min-w-4 min-h-4 group-hover:text-white" />
          </ButtonBase>
          <ButtonBase
            className="action_button flex justify-center items-center w-8 h-8 p-2 leading-4 transition-colors duration-200 border text-gray-500 border-gray rounded-md cursor-pointer group hover:border-[var(--primary)] hover:bg-[var(--primary)]"
            onClick={() => {
              setCustomerIdModal(params.row.id);
              setModalType("edit");
              setIsOpen(true);
            }}
          >
            <FiEdit width="20" className="w-4 h-4   min-w-4 min-h-4 group-hover:text-white" />
          </ButtonBase>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-end justify-between">
        <div className="table_title_div px-8 pt-3 mt-10 border-[#e6e7ec] bg-white border-t-2 border-l-2 border-r-2 rounded-ss-md rounded-se-md">
          <p className="pb-3 m-0 text-lg font-medium custom-border text-[var(--primary)]">
            {t("Customers")}

            <span className="rounded-md mx-3 bg-[var(--primary)] font-light text-white text-sm px-2 py-0.5">
              {customersPagination?.totalCount}
            </span>
          </p>
        </div>
        <div className="flex">
          <ButtonBase
            className="py-2 normal-case px-5 mt-10 mb-2 text-lg font-medium text-white border-2 rounded-lg bg-[var(--primary)] no-underline"
            onClick={() => {
              setModalType("add");
              setIsOpen(true);
            }}
          >
            {t("Add new")}
          </ButtonBase>
        </div>
      </div>

      <div className="p-2 table_container bg-white border-b-2 border-l-2 border-r-2 w-full">
        <DataGrid
          rows={customers}
          columns={columns}
          disableRowSelectionOnClick
          hideFooter
          getRowClassName={(params) => (params.row.id === customerId ? "bg-[#E9F0F7]" : "")}
          onRowClick={(params) => setCustomer(params.row)}
        />
        <PaginationAtom
          page={customersSearch.page}
          changeSelectHandler={(val) => {
            setCustomersSearch((prev) => ({ ...prev, page: 1, pageSize: +val.target.value }));
          }}
          changePaginationHandler={(_, page) => {
            setCustomersSearch((prev) => ({ ...prev, page }));
          }}
          pageSize={customersSearch.pageSize}
          totalPages={customersPagination?.totalPages}
          totalCount={customersPagination?.totalCount}
        />
      </div>

      <Modal
        open={isOpen}
        closeAfterTransition
        onClose={() => {
          setCustomerIdModal(undefined);
          setIsOpen(false);
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            minWidth: 400,
            bgcolor: "#F1F5F8",
            boxShadow: 24,
            borderRadius: "16px",
            p: "32px",
            display: "flex",
            gap: "32px",
            width: "max-content",
            maxWidth: "90vw",
            overflowY: "auto",
            maxHeight: "90dvh",
          }}
        >
          <CustomerFormTemplate
            tenantId={tenantId}
            customerId={customerIdModal}
            isEdit={modalType === "edit"}
            isView={modalType === "view"}
            isModal
            onModalClose={() => {
              setCustomerIdModal(undefined);
              fetchCustomers(customersSearch);
              setIsOpen(false);
            }}
          />
        </Box>
      </Modal>
    </div>
  );
}
