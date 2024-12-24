"use client";

import TaxesFormTemplate from "@/components/template/taxes/TaxesFormTemplate";

interface ITaxFormPageProps {
  tenantId: string;
  taxId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function TaxesFormPage({ tenantId, taxId, isEdit, isView }: Readonly<ITaxFormPageProps>) {
  return (
    <section className="w-full p-8">
      <TaxesFormTemplate taxId={taxId} isEdit={isEdit} isView={isView} tenantId={tenantId} />
    </section>
  );
}
