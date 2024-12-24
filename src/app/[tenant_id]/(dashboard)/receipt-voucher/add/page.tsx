import ReceiptVoucherFormPage from "@/components/pages/receipt-voucher/ReceiptVoucherFormPage";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <ReceiptVoucherFormPage tenantId={tenant_id} />;
}
