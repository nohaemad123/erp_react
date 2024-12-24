"use client";

import BankFormTemplate from "@/components/template/banks/BankFormTemplate";

interface IBankFormPageProps {
  tenantId: string;
  bankId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function BankFormPage({ tenantId, bankId, isEdit, isView }: Readonly<IBankFormPageProps>) {
  return (
    <section className="w-full p-8">
      <BankFormTemplate bankId={bankId} isEdit={isEdit} isView={isView} tenantId={tenantId} />
    </section>
  );
}
