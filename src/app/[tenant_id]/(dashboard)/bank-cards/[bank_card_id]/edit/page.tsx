import BankCardFormPage from "@/components/pages/bank-card/BankCardFormPage";

interface IBankCardViewProps {
  params: {
    bank_card_id: string;
    tenant_id: string;
  };
}

export default function page({ params: { bank_card_id, tenant_id } }: Readonly<IBankCardViewProps>) {
  return <BankCardFormPage isEdit bankCardId={bank_card_id} tenantId={tenant_id} />;
}
