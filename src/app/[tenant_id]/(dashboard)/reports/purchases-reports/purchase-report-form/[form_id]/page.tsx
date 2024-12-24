import PurchasesReportFormPage from "@/components/pages/reports/purchases-reports/PurchasesReportFormPage";
import React from "react";

interface IReportFormProps {
  params: {
    form_id: string;
    tenant_id: string;
  };
}

export default function page({ params: { form_id, tenant_id } }: Readonly<IReportFormProps>) {
  return <PurchasesReportFormPage formId={form_id} tenantId={tenant_id} />;
}
