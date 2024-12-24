import SupplierFormPage from "@/components/pages/suppliers/SupplierFormPage";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <SupplierFormPage tenantId={tenant_id} />;
}
