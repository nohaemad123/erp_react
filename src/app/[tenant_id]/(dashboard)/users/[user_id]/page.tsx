import UserFormPage from "@/components/pages/users/UserFormPage";
import React from "react";

interface IUserViewProps {
  params: {
    user_id: string;
    tenant_id: string;
  };
}

export default function page({ params: { user_id, tenant_id } }: Readonly<IUserViewProps>) {
  return <UserFormPage isView userId={user_id} tenantId={tenant_id} />;
}
