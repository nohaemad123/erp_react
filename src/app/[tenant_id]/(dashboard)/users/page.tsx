import ViewUserPage from "@/components/pages/users/ViewUserPage";
import React from "react";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <ViewUserPage tenantId={tenant_id} />;
}
