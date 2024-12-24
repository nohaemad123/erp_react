import { InvoiceProductRow } from "@/@types/dto/InvoiceDto";
import LineBreakAtom from "@/components/atom/LineBreakAtom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface ICashierOrderDetailsProps {
  details: InvoiceProductRow[];
  discountType: number;
  discountValue: number;
  paid: string;
  setRemainingAmount: (val: number) => void;
}

function calcInvoice({ paid, details, discountType, discountValue }: Readonly<Omit<ICashierOrderDetailsProps, "setRemainingAmount">>) {
  const sumPrices = details.reduce((prev, curr) => prev + curr.qty * curr.price, 0);
  const sumDiscount = details.reduce((prev, curr) => prev + curr.qty * curr.discountValue, 0);
  const invoiceDiscount = discountType === 0 ? Math.round((sumPrices - sumDiscount) * discountValue) / 100 : discountValue;
  const sumTax = details.reduce((prev, curr) => prev + curr.qty * curr.totalTax, 0);
  const totalPrice = sumPrices - sumDiscount - invoiceDiscount + sumTax;
  const paidNum = Number(paid.endsWith(".") ? paid + "0" : paid);
  const remaining = totalPrice - paidNum;

  return {
    sumPrices,
    sumDiscount,
    invoiceDiscount,
    sumTax,
    totalPrice,
    paidNum,
    remaining,
  };
}

export default function CashierOrderDetails({
  paid,
  details,
  discountType,
  discountValue,
  setRemainingAmount,
}: Readonly<ICashierOrderDetailsProps>) {
  const { t } = useTranslation();

  const { invoiceDiscount, paidNum, remaining, sumDiscount, sumPrices, sumTax, totalPrice } = calcInvoice({
    details,
    discountType,
    discountValue,
    paid,
  });

  useEffect(() => {
    const { remaining } = calcInvoice({ details, discountType, discountValue, paid });
    setRemainingAmount(remaining);
  }, [paid, discountValue, details, discountType]);

  return (
    <div className="rounded-lg px-4 pt-1.5 pb-4 bg-[#F5F7FB] space-y-1.5">
      <h3>{t("Order details")}</h3>
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
        <span className="text-[#757575]">{t("Invoice Discount")}</span>
        <span className="text-[#404040] flex items-center gap-1">
          <span className="text-lg">- {invoiceDiscount.toFixed(2)}</span>
          <span className="text-sm">{t("SAR")}</span>
        </span>
      </div>
      <LineBreakAtom />
      <div className="flex justify-between">
        <span className="text-[#757575]">{t("Value Added Tax")}</span>
        <span className="text-[#404040] flex items-center gap-1">
          <span className="text-lg">+ {sumTax.toFixed(2)}</span>
          <span className="text-sm">{t("SAR")}</span>
        </span>
      </div>
      <LineBreakAtom />
      <div className="flex justify-between">
        <span className="text-[#404040]">{t("Paid")}</span>
        <span className="flex items-center gap-1">
          <span className="text-xl font-semibold">{paidNum.toFixed(2)}</span>
          <span className="text-sm">{t("SAR")}</span>
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-[#404040]">{t("Residual")}</span>
        <span className="flex items-center gap-1">
          <span className="text-xl font-semibold">{remaining.toFixed(2)}</span>
          <span className="text-sm">{t("SAR")}</span>
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-[#404040]">{t("Total invoice")}</span>
        <span className="flex items-center gap-1">
          <span className="text-xl font-semibold">{totalPrice.toFixed(2)}</span>
          <span className="text-sm">{t("SAR")}</span>
        </span>
      </div>
    </div>
  );
}
