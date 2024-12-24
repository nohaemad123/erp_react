import CashierPage from "@/components/pages/cashier/CashierPage";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <CashierPage tenantId={tenant_id} />;
}
