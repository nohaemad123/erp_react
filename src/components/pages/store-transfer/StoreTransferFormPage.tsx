"use client";

import StoreTransferFormTemplate from "@/components/template/store-transfer/StoreTransferTemplate";

interface IStoreTransferFormPageProps {
  tenantId: string;
  storeTransferId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function StoreTransferFormPage({ tenantId, storeTransferId, isEdit, isView }: Readonly<IStoreTransferFormPageProps>) {
  return (
    <section className="w-full py-4 mt-8">
      <StoreTransferFormTemplate storeTransferId={storeTransferId} isEdit={isEdit} isView={isView} tenantId={tenantId} />
    </section>
  );
}
