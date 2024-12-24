import BranchFormPage from "@/components/pages/branches/BranchFormPage";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <BranchFormPage tenantId={tenant_id} />;
}
