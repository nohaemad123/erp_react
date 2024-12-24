import SalesInvoiceFormPage from "@/components/pages/sales/sales-invoice/SalesInvoiceFormPage";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <SalesInvoiceFormPage tenantId={tenant_id} />;
}
