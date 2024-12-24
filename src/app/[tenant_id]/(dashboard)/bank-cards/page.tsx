import BankCardViewPage from "@/components/pages/bank-card/BankCardViewPage";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <BankCardViewPage tenantId={tenant_id} />;
}
