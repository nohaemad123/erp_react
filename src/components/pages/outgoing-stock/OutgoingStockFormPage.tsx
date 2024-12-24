"use client";

import OutgoingStockFormTemplate from "@/components/template/outgoing-stock/OutgoingStockTemplate";

interface IOutgoingStockFormPageProps {
  tenantId: string;
  outgoingStockId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function OutgoingStockFormPage({ tenantId, outgoingStockId, isEdit, isView }: Readonly<IOutgoingStockFormPageProps>) {
  return (
    <section className="w-full py-4 mt-8">
      <OutgoingStockFormTemplate outgoingStockId={outgoingStockId} isEdit={isEdit} isView={isView} tenantId={tenantId} />
    </section>
  );
}
