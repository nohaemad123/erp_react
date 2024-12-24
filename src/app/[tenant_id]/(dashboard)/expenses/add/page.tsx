import ExpenseFormPage from "@/components/pages/expenses/ExpensFormPage";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <ExpenseFormPage tenantId={tenant_id} />;
}
