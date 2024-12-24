import ViewExpensePage from "@/components/pages/expenses/ExpensesViewPage";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <ViewExpensePage tenantId={tenant_id} />;
}
