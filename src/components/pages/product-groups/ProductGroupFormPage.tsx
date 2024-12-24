"use client";

import ProductGroupFormTemplate from "@/components/template/product-groups/ProductGroupFormTemplate";

interface IProductGroupFormPageProps {
  tenantId: string;
  productGroupId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function ProductGroupFormPage({ tenantId, productGroupId, isEdit, isView }: Readonly<IProductGroupFormPageProps>) {
  return (
    <section className="w-full p-8">
      <ProductGroupFormTemplate productGroupId={productGroupId} isEdit={isEdit} isView={isView} tenantId={tenantId} />
    </section>
  );
}
