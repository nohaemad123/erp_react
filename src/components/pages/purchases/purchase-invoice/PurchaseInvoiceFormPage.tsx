"use client";

import PurchaseInvoiceFormTemplate from "@/components/template/purchase-invoice/PurchaseInvoiceFormTemplate";

interface IPurchaseInvoiceFormPageProps {
  tenantId: string;
  invoiceId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function PurchaseInvoiceFormPage({ tenantId, invoiceId, isEdit, isView }: Readonly<IPurchaseInvoiceFormPageProps>) {
  return (
    <section className="w-full py-8">
      <PurchaseInvoiceFormTemplate invoiceId={invoiceId} isEdit={isEdit} tenantId={tenantId} isView={isView} />
    </section>
  );
}
