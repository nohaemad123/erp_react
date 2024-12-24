import ReceiptVoucherViewPage from "@/components/pages/receipt-voucher/ReceiptVouherViewPage";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <ReceiptVoucherViewPage tenantId={tenant_id} />;
}
