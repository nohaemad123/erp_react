"use client";

import BranchFormTemplate from "@/components/template/branches/BranchFormTemplate";

interface IBranchFormPageProps {
  tenantId: string;
  branchId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function BranchFormPage({ branchId, isEdit, isView, tenantId }: Readonly<IBranchFormPageProps>) {
  return (
    <section className="w-full p-8">
      <BranchFormTemplate branchId={branchId} isEdit={isEdit} isView={isView} tenantId={tenantId} />
    </section>
  );
}
