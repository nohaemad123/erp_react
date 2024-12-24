import BranchFormPage from "@/components/pages/branches/BranchFormPage";
import React from "react";

interface IBranchViewProps {
  params: {
    branch_id: string;
    tenant_id: string;
  };
}

export default function page({ params: { branch_id, tenant_id } }: Readonly<IBranchViewProps>) {
  return <BranchFormPage isEdit branchId={branch_id} tenantId={tenant_id} />;
}
