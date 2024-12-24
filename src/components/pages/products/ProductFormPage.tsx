"use client";

import ProductFormTemplate from "@/components/template/products/ProductFormTemplate";

interface IProductFormPageProps {
  tenantId: string;
  productId?: string;
  isEdit?: boolean;
}

export default function ProductFormPage({ tenantId, productId, isEdit }: Readonly<IProductFormPageProps>) {
  return (
    <section className="w-full p-8">
      <ProductFormTemplate productId={productId} isEdit={isEdit} tenantId={tenantId} />
    </section>
  );
}
