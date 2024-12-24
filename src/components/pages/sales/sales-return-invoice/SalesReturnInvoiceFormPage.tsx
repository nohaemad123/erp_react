"use client";

import SalesReturnInvoiceFormTemplate from "@/components/template/sales-return-invoice/SalesReturnInvoiceFormTemplate";

interface ISalesInvoiceFormPageProps {
  tenantId: string;
  invoiceId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function SalesReturnInvoiceFormPage({ tenantId, invoiceId, isEdit, isView }: Readonly<ISalesInvoiceFormPageProps>) {
  return (
    <section className="w-full py-8">
      <SalesReturnInvoiceFormTemplate invoiceId={invoiceId} isEdit={isEdit} tenantId={tenantId} isView={isView} />
    </section>
  );
}
