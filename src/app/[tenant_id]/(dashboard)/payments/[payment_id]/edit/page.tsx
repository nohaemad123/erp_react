import PaymenttFormPage from "@/components/pages/payments/PaymenttFormPage";

interface IPaymentViewProps {
  params: {
    payment_id: string;
    tenant_id: string;
  };
}

export default function page({ params: { payment_id, tenant_id } }: Readonly<IPaymentViewProps>) {
  return <PaymenttFormPage isEdit paymentId={payment_id} tenantId={tenant_id} />;
}
