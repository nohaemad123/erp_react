import UserFormPage from "@/components/pages/users/UserFormPage";
import React from "react";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <UserFormPage tenantId={tenant_id} />;
}
