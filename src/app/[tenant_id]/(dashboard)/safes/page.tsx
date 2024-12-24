import ViewSafePage from "@/components/pages/safe/ViewSafePage";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <ViewSafePage tenantId={tenant_id} />;
}
