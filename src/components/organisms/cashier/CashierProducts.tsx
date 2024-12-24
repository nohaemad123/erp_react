"use client";

import { IProduct } from "@/@types/interfaces/IProduct";
import { Modal, Box } from "@mui/material";
import Image from "next/image";
import cashierProduct from "@/assets/images/cashier-product.png";
import { SearchDto } from "@/@types/dto/SearchDto";
import { Dispatch, SetStateAction, useState } from "react";
import { IPagination } from "@/@types/interfaces/IPagination";
import { useTranslation } from "react-i18next";
import ProductFormTemplate from "@/components/template/products/ProductFormTemplate";
import { PaginationAtom } from "@/components/atom/PaginationAtom";

interface ICashierProductsProps {
  tenantId: string;
  products: IProduct[];
  productsSearch: SearchDto;
  productsPagination: IPagination | undefined;
  isProductsLocked: boolean;
  setProductsSearch: Dispatch<SetStateAction<SearchDto>>;
  handleAddProduct(product: IProduct): void;
}

export default function CashierProducts({
  tenantId,
  products,
  productsSearch,
  productsPagination,
  isProductsLocked,
  setProductsSearch,
  handleAddProduct,
}: Readonly<ICashierProductsProps>) {
  const { t } = useTranslation();
  const [productId, setProductId] = useState<string | undefined>();

  return (
    <div className="flex flex-col flex-grow gap-2 h-full">
      <div className="flex-grow">
        <div className="flex flex-wrap justify-center gap-4">
          {products.map((product) => (
            <button
              key={product.id}
              type="button"
              className="w-48 bg-white p-1 flex flex-col"
              onClick={() => {
                if (isProductsLocked) setProductId(product.id);
                else handleAddProduct(product);
              }}
            >
              <div>
                <Image src={cashierProduct} alt={"cashier product"} width={184} priority={false} />
              </div>
              <div className="px-1 pt-1 pb-4 text-start w-full h-full flex flex-col justify-between">
                <p className="text-lg">{product.name}</p>
                {product.productUnits[0] && (
                  <p>
                    <b className="text-2xl">{product.productUnits[0].salePrice}</b> {t("SAR")}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <PaginationAtom
        page={productsSearch.page}
        changeSelectHandler={(val) => {
          setProductsSearch((prev) => ({ ...prev, page: 1, pageSize: +val.target.value }));
        }}
        changePaginationHandler={(_, page) => {
          setProductsSearch((prev) => ({ ...prev, page }));
        }}
        pageSize={productsSearch.pageSize}
        totalPages={productsPagination?.totalPages}
        totalCount={productsPagination?.totalCount}
      />
      <Modal
        open={!!productId}
        onClose={() => {
          setProductId(undefined);
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            minWidth: 400,
            bgcolor: "#F1F5F8",
            boxShadow: 24,
            borderRadius: "16px",
            p: "32px",
            display: "flex",
            gap: "32px",
            width: "max-content",
            maxWidth: "90vw",
            overflowY: "auto",
            maxHeight: "90dvh",
          }}
        >
          <ProductFormTemplate tenantId={tenantId} productId={productId} />
        </Box>
      </Modal>
    </div>
  );
}
