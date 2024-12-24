import StoreFormPage from "@/components/pages/stores/StoreFormPage";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <StoreFormPage tenantId={tenant_id} />;
}
