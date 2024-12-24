import ProductFormPage from "@/components/pages/products/ProductFormPage";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <ProductFormPage tenantId={tenant_id} />;
}
