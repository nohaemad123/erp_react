import PaymentViewPage from "@/components/pages/payments/PaymentViewPage";
interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <PaymentViewPage tenantId={tenant_id} />;
}
