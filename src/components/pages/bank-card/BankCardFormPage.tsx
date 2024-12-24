"use client";

import BankCardFormTemplate from "@/components/template/bank-card/BankCardFormTemplate";

interface IBankCardFormPageProps {
  tenantId: string;
  bankCardId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function BankCardFormPage({ bankCardId, tenantId, isEdit, isView }: Readonly<IBankCardFormPageProps>) {
  return (
    <section className="w-full p-8">
      <BankCardFormTemplate bankCardId={bankCardId} isEdit={isEdit} isView={isView} tenantId={tenantId} />
    </section>
  );
}
