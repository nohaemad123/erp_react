"use client";

import { ButtonBase } from "@mui/material";
import { FiTrash2 } from "react-icons/fi";
import { InvoiceProductRow } from "@/@types/dto/InvoiceDto";
import { useAppStore } from "@/store";
import { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import TableAtom from "@/components/atom/TableAtom";
import { TextFieldAtom } from "@/components/atom/TextFieldAtom";

interface ICashierInvoiceItemsTableProps {
  details: InvoiceProductRow[];
  isProductsLocked: boolean;
  handleChangeProductQuantity(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, row: InvoiceProductRow): void;
  handleDeleteProductRow(rowId: string): void;
}

export default function CashierInvoiceItemsTable({
  details,
  isProductsLocked,
  handleChangeProductQuantity,
  handleDeleteProductRow,
}: Readonly<ICashierInvoiceItemsTableProps>) {
  const { t } = useTranslation();
  const { isHttpClientLoading } = useAppStore();

  const disabled = isHttpClientLoading || isProductsLocked;

  return (
    <div className="w-full overflow-x-auto flex-grow" style={{ border: "1px #E6E7EC solid", borderRadius: 8 }}>
      <TableAtom fullWidth aria-label="product prices table" variant={"dynamic"}>
        <TableAtom.THead>
          <TableAtom.TRow>
            <TableAtom.TCell component="th" className="bg-[#F5F5F5] min-w-[160px]">
              {t("Barcode")}
            </TableAtom.TCell>
            <TableAtom.TCell component="th" fullWidth className="bg-[#F5F5F5]">
              {t("Product name")}
            </TableAtom.TCell>
            <TableAtom.TCell component="th" className="bg-[#F5F5F5]">
              {t("Qty")}
            </TableAtom.TCell>
            <TableAtom.TCell component="th" className="bg-[#F5F5F5] whitespace-nowrap">
              {t("Unit")} *
            </TableAtom.TCell>
            <TableAtom.TCell component="th" className="bg-[#F5F5F5]">
              {t("Price")}
            </TableAtom.TCell>
            <TableAtom.TCell component="th" className="bg-[#F5F5F5]">
              {t("Discount")}
            </TableAtom.TCell>
            <TableAtom.TCell component="th" className="bg-[#F5F5F5]">
              {t("Total")}
            </TableAtom.TCell>
            <TableAtom.TCell component="th" className="bg-[#F5F5F5]"></TableAtom.TCell>
          </TableAtom.TRow>
        </TableAtom.THead>
        <TableAtom.TBody>
          {details.map((row) => (
            <TableAtom.TRow key={row.rowId}>
              <TableAtom.TCell>{row.barcode}</TableAtom.TCell>
              <TableAtom.TCell>{row.productName}</TableAtom.TCell>
              <TableAtom.TCell>
                <TextFieldAtom
                  type="number"
                  variant="standard"
                  fullWidth
                  className="min-w-[60px]"
                  value={row.qty}
                  inputMode={"numeric"}
                  disabled={disabled}
                  slotProps={{
                    htmlInput: {
                      min: 1,
                      step: 1,
                    },
                    input: {
                      disableUnderline: true,
                    },
                  }}
                  onChange={(e) => handleChangeProductQuantity(e, row)}
                />
              </TableAtom.TCell>
              <TableAtom.TCell>
                {/* <Select
                  
                  disabled={disabled}
                  value={row.productUnitId}
                  variant="standard"
                  disableUnderline
                  sx={{ maxWidth: 100 }}
                  onChange={(e) => handleChangeProductUnit(e, row)}
                  placeholder={t("Unit")}
                  fullWidth
                >
                  {row.productUnits.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.unitName}
                    </MenuItem>
                  ))}
                </Select> */}
                {(row.productUnits.find((x) => x.id === row.productUnitId) ?? row.productUnits[0])?.unitName}
              </TableAtom.TCell>
              <TableAtom.TCell>{row.price.toFixed(2)}</TableAtom.TCell>
              <TableAtom.TCell>{row.discountValue.toFixed(2)}</TableAtom.TCell>
              <TableAtom.TCell>{row.total.toFixed(2)}</TableAtom.TCell>
              <TableAtom.TCell>
                <ButtonBase
                  disabled={disabled}
                  onClick={() => handleDeleteProductRow(row.rowId)}
                  type="button"
                  className="text-center m-auto border-0 flex bg-transparent text-gray-500 justify-center items-center w-8 h-8 p-2 leading-4 transition-colors duration-200  rounded-md cursor-pointer group disabled:opacity-40"
                >
                  <FiTrash2 width="20" className="w-4 h-4  min-w-4 min-h-4 text-[var(--danger)]" />
                </ButtonBase>
              </TableAtom.TCell>
            </TableAtom.TRow>
          ))}
        </TableAtom.TBody>
      </TableAtom>
    </div>
  );
}
