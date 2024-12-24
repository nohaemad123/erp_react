"use client";

import ExpenseFormTemplate from "@/components/template/expenses/ExpensFormTemplate";

interface IExpenseFormPageProps {
  expenseId?: string;
  isEdit?: boolean;
  isView?: boolean;
  tenantId: string;
}

export default function ExpenseFormPage({ tenantId, expenseId, isEdit, isView }: Readonly<IExpenseFormPageProps>) {
  return (
    <section className="w-full p-8">
      <ExpenseFormTemplate tenantId={tenantId} expenseId={expenseId} isEdit={isEdit} isView={isView} />
    </section>
  );
}
