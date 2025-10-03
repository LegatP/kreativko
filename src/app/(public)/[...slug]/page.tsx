import { notFound } from "next/navigation";

const product = {
  id: "1",
  name: "Stašljiva majica za noč čarovnic",
  price: 19.99,
  description: "Beautiful handcrafted ceramic mug with unique glazing patterns",
  image:
    "https://firebasestorage.googleapis.com/v0/b/kreativko---development.firebasestorage.app/o/0N0hFGlEA6VP6LEg4ulmf8vq5CT2%2F1759351377579_Screenshot%202025-10-01%20at%2022.42.17.png?alt=media&token=ed97daa6-0708-4c95-bcd7-ec14b61106ee",
  category: "Home & Kitchen",
  inStock: true,
  isPopular: true,
};

export default function Page({ params }: { params: { slug: string[] } }) {
  const { slug } = params; // e.g. ["funny", "birthday", "funny-cake-shirt"]

  if (!slug || slug.length < 1) return notFound();

  if (slug.length === 1) {
    // /majice/category
    // return <CategoryPage category={slug[0]} />;
    return <div>Category: {slug[0]}</div>;
  }

  if (slug.length === 2) {
    // /majice/category/product
    // return <ProductPage category={slug[0]} product={slug[1]} />;
    return (
      <div>
        Category: {slug[0]}, Product: {slug[1]}
      </div>
    );
  }

  if (slug.length === 3) {
    // /majice/category/subcategory/product
    return (
      // <ProductPage category={slug[0]} subcategory={slug[1]} product={slug[2]} />
      <div>
        Category: {slug[0]}, Subcategory: {slug[1]}, Product: {slug[2]}
      </div>
    );
  }

  return notFound();
}
