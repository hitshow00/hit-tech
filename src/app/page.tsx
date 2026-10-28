import { getFeaturedProducts, getLatestProducts, getCategories } from "@/lib/catalog";
import { SpatialHomeClient } from "@/components/SpatialHomeClient";

export default async function HomePage() {
  const [featuredProducts, latestProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getLatestProducts(),
    getCategories(),
  ]);

  return (
    <SpatialHomeClient
      featuredProducts={featuredProducts}
      latestProducts={latestProducts}
      categories={categories}
    />
  );
}
