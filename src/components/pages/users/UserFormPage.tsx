"use client";

import UserFormTemplate from "@/components/template/users/UserFormTemplate";

interface IUserFormPageProps {
  tenantId: string;
  userId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function UserFormPage({ tenantId, userId, isEdit, isView }: Readonly<IUserFormPageProps>) {
  return (
    <section className="w-full p-8">
      <UserFormTemplate userId={userId} isEdit={isEdit} isView={isView} tenantId={tenantId} />
    </section>
  );
}
