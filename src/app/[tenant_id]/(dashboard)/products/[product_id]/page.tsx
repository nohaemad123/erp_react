import ProductFormPage from "@/components/pages/products/ProductFormPage";

interface IProductViewProps {
  params: {
    product_id: string;
    tenant_id: string;
  };
}

export default function page({ params: { product_id, tenant_id } }: Readonly<IProductViewProps>) {
  return <ProductFormPage productId={product_id} tenantId={tenant_id} />;
}
