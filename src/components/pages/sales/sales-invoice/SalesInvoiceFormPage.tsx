"use client";

import SalesInvoiceFormTemplate from "@/components/template/sales-invoice/SalesInvoiceFormTemplate";

interface ISalesInvoiceFormPageProps {
  tenantId: string;
  invoiceId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function SalesInvoiceFormPage({ tenantId, invoiceId, isEdit, isView }: Readonly<ISalesInvoiceFormPageProps>) {
  return (
    <section className="w-full py-8">
      <SalesInvoiceFormTemplate invoiceId={invoiceId} isEdit={isEdit} tenantId={tenantId} isView={isView} />
    </section>
  );
}
