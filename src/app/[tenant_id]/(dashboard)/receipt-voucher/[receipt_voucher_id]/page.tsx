import ReceiptVoucherFormPage from "@/components/pages/receipt-voucher/ReceiptVoucherFormPage";

interface IReceiptVoucherViewProps {
  params: {
    receipt_voucher_id: string;
    tenant_id: string;
  };
}

export default function page({ params: { receipt_voucher_id, tenant_id } }: Readonly<IReceiptVoucherViewProps>) {
  return <ReceiptVoucherFormPage isView receiptVourcherId={receipt_voucher_id} tenantId={tenant_id} />;
}
