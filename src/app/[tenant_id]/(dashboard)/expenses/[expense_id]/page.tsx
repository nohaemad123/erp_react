import ExpenseFormPage from "@/components/pages/expenses/ExpensFormPage";
import React from "react";

interface IExpenseViewProps {
  params: {
    expense_id: string;
    tenant_id: string;
  };
}

export default function page({ params: { expense_id, tenant_id } }: Readonly<IExpenseViewProps>) {
  return <ExpenseFormPage isView expenseId={expense_id} tenantId={tenant_id} />;
}
