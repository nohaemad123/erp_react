import { InvoiceProductRow } from "@/@types/dto/InvoiceDto";
import LineBreakAtom from "@/components/atom/LineBreakAtom";
import { Button, ButtonBase, IconButton, Menu } from "@mui/material";
import { MouseEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiWarningCircle } from "react-icons/pi";
import { TbSquareRoundedPercentage } from "react-icons/tb";
import { LuSquareEqual } from "react-icons/lu";
import { useAppStore } from "@/store";
import { TextFieldAtom } from "@/components/atom/TextFieldAtom";

interface ICashierInvoiceSummaryProps {
  details: InvoiceProductRow[];
  discountType: number;
  discountValue: number;
  handleAddInvoiceDiscount(type: number, val: number): void;
}

export default function CashierInvoiceSummary({
  details,
  discountType,
  discountValue,
  handleAddInvoiceDiscount,
}: Readonly<ICashierInvoiceSummaryProps>) {
  const { t } = useTranslation();
  const { isHttpClientLoading } = useAppStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [discountTypeState, setDiscountTypeState] = useState(discountType ?? 0);
  const [discountValueInput, setDiscountValueInput] = useState(discountValue ?? 0);
  const open = Boolean(anchorEl);

  const sumPrices = details.reduce((prev, curr) => prev + curr.qty * curr.price, 0);
  const sumDiscount = details.reduce((prev, curr) => prev + curr.qty * curr.discountValue, 0);
  const invoiceDiscount = discountType === 0 ? Math.round((sumPrices - sumDiscount) * discountValue) / 100 : discountValue;
  const sumTax = details.reduce((prev, curr) => prev + curr.qty * curr.totalTax, 0);
  const totalPrice = sumPrices - sumDiscount - invoiceDiscount + sumTax;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  function toggleDiscountType() {
    setDiscountTypeState((prev) => {
      const curr = prev === 0 ? 1 : 0;
      setDiscountValueInput(
        curr !== discountType
          ? discountType === 0
            ? Math.round(discountValue * (sumPrices - sumDiscount)) / 100
            : Math.round((discountValue / (sumPrices - sumDiscount)) * 10000) / 100
          : discountValue,
      );
      return curr;
    });
  }

  function cancelDiscountChange() {
    setDiscountTypeState(discountType);
    setDiscountValueInput(discountValue);
  }

  return (
    <div className="rounded-lg px-4 pt-1.5 pb-4 bg-[#F5F7FB] space-y-1.5">
      <h3>
        {t("Order Summary")} ({details.reduce((prev, curr) => prev + curr.qty, 0)} {t("products")})
      </h3>
      <LineBreakAtom />
      <div className="flex justify-between">
        <span className="text-[#757575]">{t("Sum")}</span>
        <span className="text-[#404040] flex items-center gap-1">
          <span className="text-lg">{sumPrices.toFixed(2)}</span>
          <span className="text-sm">{t("SAR")}</span>
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-[#757575]">{t("Discount")}</span>
        <span className="text-[#404040] flex items-center gap-1">
          <span className="text-lg">- {sumDiscount.toFixed(2)}</span>
          <span className="text-sm">{t("SAR")}</span>
        </span>
      </div>
      <LineBreakAtom />
      <div className="flex justify-between">
        <span className="text-[#757575]">{t("Sum After Discount")}</span>
        <span className="text-[#404040] flex items-center gap-1">
          <span className="text-lg">{(sumPrices - sumDiscount).toFixed(2)}</span>
          <span className="text-sm">{t("SAR")}</span>
        </span>
      </div>
      <div className="flex justify-between">
        <span>
          <span className="text-[#757575]">{t("Invoice Discount")}</span>
          <span className="relative">
            <IconButton type="button" size="small" className="inline-flex items-center" onClick={handleClick}>
              <PiWarningCircle className="w-5 h-5 text-[#226AB2]" />
            </IconButton>
            <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
              <div className="px-2 space-y-2">
                <h4 className="text-[#4D4D4D]">{t("Add invoice discount")}</h4>
                <LineBreakAtom />
                <div className="flex items-center gap-2">
                  <TextFieldAtom
                    disabled={isHttpClientLoading}
                    type="number"
                    size="small"
                    sx={{ textAlign: "center", width: 100 }}
                    slotProps={{
                      htmlInput: {
                        min: 0,
                        max: discountTypeState === 0 ? 99 : undefined,
                        step: 1,
                        style: { textAlign: "center" },
                      },
                    }}
                    value={discountValueInput}
                    onChange={(e) => setDiscountValueInput(+e.target.value)}
                  />
                  <ButtonBase
                    type="button"
                    sx={{ backgroundColor: "#F0F5FA", p: "4px", borderRadius: "4px" }}
                    onClick={toggleDiscountType}
                  >
                    {discountTypeState === 0 ? (
                      <TbSquareRoundedPercentage className="w-7 h-7 text-[#404040]" />
                    ) : (
                      <LuSquareEqual className="w-7 h-7 text-[#404040]" />
                    )}
                  </ButtonBase>
                  <span className="bg-[#F0F5FA] p-1 rounded text-[var(--primary)]">{t("SAR")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="contained"
                    fullWidth
                    onClick={() => {
                      if (discountValueInput < 0 || (discountTypeState === 0 && discountValueInput > 99)) return;
                      handleAddInvoiceDiscount(discountTypeState, discountValueInput);
                      handleClose();
                    }}
                  >
                    {t("Save")}
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    fullWidth
                    onClick={() => {
                      cancelDiscountChange();
                      handleClose();
                    }}
                  >
                    {t("Cancel")}
                  </Button>
                </div>
              </div>
            </Menu>
          </span>
        </span>
        <span className="text-[#404040] flex items-center gap-1">
          <span className="text-lg">- {invoiceDiscount.toFixed(2)}</span>
          <span className="text-sm">{t("SAR")}</span>
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-[#757575]">{t("Value Added Tax")}</span>
        <span className="text-[#404040] flex items-center gap-1">
          <span className="text-lg">+ {sumTax.toFixed(2)}</span>
          <span className="text-sm">{t("SAR")}</span>
        </span>
      </div>
      <LineBreakAtom />
      <div className="flex justify-between">
        <span>{t("Total")}</span>
        <span className="flex items-center gap-1">
          <span className="text-lg">{totalPrice.toFixed(2)}</span>
          <span className="text-sm">{t("SAR")}</span>
        </span>
      </div>
    </div>
  );
}
