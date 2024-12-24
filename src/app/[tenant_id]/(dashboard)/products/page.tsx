import ProductsViewPage from "@/components/pages/products/ProductsViewPage";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <ProductsViewPage tenantId={tenant_id} />;
}
