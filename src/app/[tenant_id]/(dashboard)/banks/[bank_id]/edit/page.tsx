import BankFormPage from "@/components/pages/banks/BankFormPage";

interface IBankViewProps {
  params: {
    bank_id: string;
    tenant_id: string;
  };
}

export default function page({ params: { bank_id, tenant_id } }: Readonly<IBankViewProps>) {
  return <BankFormPage isEdit bankId={bank_id} tenantId={tenant_id} />;
}
