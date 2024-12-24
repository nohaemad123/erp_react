import PaymenttFormPage from "@/components/pages/payments/PaymenttFormPage";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <PaymenttFormPage tenantId={tenant_id} />;
}
