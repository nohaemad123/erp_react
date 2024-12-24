"use client";

import CustomerFormTemplate from "@/components/template/customers/CustomerFormTemplate";

interface ICustomerFormPageProps {
  customerId?: string;
  isEdit?: boolean;
  isView?: boolean;
  tenantId: string;
}

export default function CustomerFormPage({ tenantId, customerId, isEdit, isView }: Readonly<ICustomerFormPageProps>) {
  return (
    <section className="w-full p-8">
      <CustomerFormTemplate tenantId={tenantId} customerId={customerId} isEdit={isEdit} isView={isView} />
    </section>
  );
}
