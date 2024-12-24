import StoreFormPage from "@/components/pages/stores/StoreFormPage";

interface IStoreViewProps {
  params: {
    store_id: string;
    tenant_id: string;
  };
}

export default function page({ params: { store_id, tenant_id } }: Readonly<IStoreViewProps>) {
  return <StoreFormPage isEdit storeId={store_id} tenantId={tenant_id} />;
}
