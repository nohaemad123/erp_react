import CustomerFormPage from "@/components/pages/customers/CustomerFormPage";

interface ICustomerViewProps {
  params: {
    customer_id: string;
    tenant_id: string;
  };
}

export default function page({ params: { customer_id, tenant_id } }: Readonly<ICustomerViewProps>) {
  return <CustomerFormPage isView customerId={customer_id} tenantId={tenant_id} />;
}
