"use client";

import PurchaseReturnInvoiceFormTemplate from "@/components/template/purchase-return-invoice/PurchaseReturnInvoiceFormTemplate";

interface IPurchaseInvoiceFormPageProps {
  tenantId: string;
  invoiceId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function PurchaseReturnInvoiceFormPage({
  tenantId,
  invoiceId,
  isEdit,
  isView,
}: Readonly<IPurchaseInvoiceFormPageProps>) {
  return (
    <section className="w-full py-8">
      <PurchaseReturnInvoiceFormTemplate invoiceId={invoiceId} isEdit={isEdit} tenantId={tenantId} isView={isView} />
    </section>
  );
}
