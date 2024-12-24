import SupplierFormPage from "@/components/pages/suppliers/SupplierFormPage";

interface ISupplierViewProps {
  params: {
    supplier_id: string;
    tenant_id: string;
  };
}

export default function page({ params: { supplier_id, tenant_id } }: Readonly<ISupplierViewProps>) {
  return <SupplierFormPage isView supplierId={supplier_id} tenantId={tenant_id} />;
}
