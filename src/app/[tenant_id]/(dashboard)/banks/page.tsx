import BanksViewPage from "@/components/pages/banks/BanksViewPage";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <BanksViewPage tenantId={tenant_id} />;
}
