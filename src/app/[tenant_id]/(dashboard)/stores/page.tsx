import ViewStorePage from "@/components/pages/stores/ViewStorePage";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <ViewStorePage tenantId={tenant_id} />;
}
