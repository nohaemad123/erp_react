import BranchFormPage from "@/components/pages/banks/BankFormPage";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <BranchFormPage tenantId={tenant_id} />;
}
