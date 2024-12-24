import SuppliersViewPage from "@/components/pages/suppliers/SuppliersViewPage";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <SuppliersViewPage tenantId={tenant_id} />;
}
