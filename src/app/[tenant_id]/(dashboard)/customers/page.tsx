import CustomersViewPage from "@/components/pages/customers/CustomersViewPage";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <CustomersViewPage tenantId={tenant_id} />;
}
