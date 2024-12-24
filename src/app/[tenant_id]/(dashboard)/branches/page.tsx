import BranchesViewPage from "@/components/pages/branches/BranchesViewPage";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <BranchesViewPage tenantId={tenant_id} />;
}
