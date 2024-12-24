"use client";

import StoreFormTemplate from "@/components/template/stores/StoreFormTemplate";

interface IStoreFormPageProps {
  tenantId: string;
  storeId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function StoreFormPage({ tenantId, storeId, isEdit, isView }: Readonly<IStoreFormPageProps>) {
  return (
    <section className="w-full p-8">
      <StoreFormTemplate storeId={storeId} isEdit={isEdit} isView={isView} tenantId={tenantId} />
    </section>
  );
}
