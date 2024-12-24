import StoreTransferFormPage from "@/components/pages/store-transfer/StoreTransferFormPage";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <StoreTransferFormPage tenantId={tenant_id} />;
}
