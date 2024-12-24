import CustomerFormPage from "@/components/pages/customers/CustomerFormPage";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <CustomerFormPage tenantId={tenant_id} />;
}
