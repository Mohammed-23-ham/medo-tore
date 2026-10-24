import { notFound } from "next/navigation";
import ProductDetails from "@/components/componants/ProductDetails";

export default async function ProductPage({
  params,
}: PageProps<"/products/[id]">) {
  const { id } = await params;
  const productId = Number(id);

  if (!Number.isSafeInteger(productId) || productId < 1) {
    notFound();
  }

  return <ProductDetails productId={productId} />;
}
