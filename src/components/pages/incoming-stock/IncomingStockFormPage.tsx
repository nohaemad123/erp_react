"use client";

import IncomingStockFormTemplate from "@/components/template/incoming-stock/IncomingStockTemplate";

interface IIncomingStockFormPageProps {
  tenantId: string;
  incomingStockId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function IncomingStockFormPage({ tenantId, incomingStockId, isEdit, isView }: Readonly<IIncomingStockFormPageProps>) {
  return (
    <section className="w-full py-4 mt-8">
      <IncomingStockFormTemplate incomingStockId={incomingStockId} isEdit={isEdit} isView={isView} tenantId={tenantId} />
    </section>
  );
}
