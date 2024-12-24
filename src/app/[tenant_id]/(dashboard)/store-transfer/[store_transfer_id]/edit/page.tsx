import StoreTransferFormPage from "@/components/pages/store-transfer/StoreTransferFormPage";

interface IStoreTransferViewProps {
  params: {
    store_transfer_id: string;
    tenant_id: string;
  };
}

export default function page({ params: { store_transfer_id, tenant_id } }: Readonly<IStoreTransferViewProps>) {
  return <StoreTransferFormPage isEdit storeTransferId={store_transfer_id} tenantId={tenant_id} />;
}
