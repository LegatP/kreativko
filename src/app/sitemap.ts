import { MetadataRoute } from "next";
import { getAllProducts } from "@/db/products";
import { getAllProductCategories } from "@/db/product-categories";
import ROUTES from "@/utils/routes.utils";

/**
 * Get the base URL for the application
 */
function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const currentDate = new Date();

  // Static routes (excluding admin routes)
  const staticRoutes = [
    {
      url: `${baseUrl}${ROUTES.home}`,
      lastModified: currentDate,
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    // TODO: extend with other static routes as needed - use ROUTES and split out admin routes
  ];

  try {
    // Get dynamic routes from database
    const [products, categories] = await Promise.all([
      getAllProducts(),
      getAllProductCategories(),
    ]);

    // Product category routes
    const categoryRoutes = categories.map((category) => ({
      url: `${baseUrl}/${category.slug}`,
      lastModified: category.updatedAt?.toDate() || category.createdAt.toDate(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    // Individual product routes
    const productRoutes = products.map((product) => ({
      url: `${baseUrl}${ROUTES.productDetails(product.slug)}`,
      lastModified: product.updatedAt?.toDate() || product.createdAt.toDate(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    // Combine all routes
    return [...staticRoutes, ...categoryRoutes, ...productRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Return at least the static routes if database queries fail
    return staticRoutes;
  }
}
