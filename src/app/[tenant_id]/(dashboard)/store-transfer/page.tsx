import StoreTransferViewPage from "@/components/pages/store-transfer/StoreTransferViewPage";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <StoreTransferViewPage tenantId={tenant_id} />;
}
