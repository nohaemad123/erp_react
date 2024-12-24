import BankCardFormPage from "@/components/pages/bank-card/BankCardFormPage";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <BankCardFormPage tenantId={tenant_id} />;
}
