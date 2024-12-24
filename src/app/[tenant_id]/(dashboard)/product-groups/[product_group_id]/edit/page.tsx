import ProductGroupFormPage from "@/components/pages/product-groups/ProductGroupFormPage";
import React from "react";

interface IProductGroupViewProps {
  params: {
    product_group_id: string;
    tenant_id: string;
  };
}

export default function page({ params: { product_group_id, tenant_id } }: Readonly<IProductGroupViewProps>) {
  return <ProductGroupFormPage isEdit productGroupId={product_group_id} tenantId={tenant_id} />;
}
