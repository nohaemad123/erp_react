"use client";

import SupplierFormTemplate from "@/components/template/suppliers/SupplierFormTemplate";

interface ISupplierFormPageProps {
  supplierId?: string;
  isEdit?: boolean;
  isView?: boolean;
  tenantId: string;
}

export default function SupplierFormPage({ tenantId, supplierId, isEdit, isView }: Readonly<ISupplierFormPageProps>) {
  return (
    <section className="w-full p-8">
      <SupplierFormTemplate supplierId={supplierId} isEdit={isEdit} isView={isView} tenantId={tenantId} />
    </section>
  );
}
