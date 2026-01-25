import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import CheckoutDrawer from "@/components/layout/CheckoutDrawer";

export const metadata: Metadata = {
  metadataBase: new URL("https://mojmotiv.si"),
  title: "Moj Motiv | Unikatne Majice z Vašim Motivom",
  description:
    "Ustvarite svojo unikatno majico. Opišite motiv, izberite barvo in velikost. Naročite.",
  keywords: [
    "majice po meri",
    "personalizirane majice",
    "slovenija",
    "unikatne majice",
    "tisk na majice",
    "majice za rojstni dan",
  ],
  authors: [{ name: "Moj Motiv" }],
  creator: "Moj Motiv",
  // openGraph: {
  //   title: "Moj Motiv | Unikatne Majice z Vašim Motivom",
  //   description:
  //     "Ustvarite svojo unikatno majico. Opišite motiv, izberite barvo in velikost. Naročite.",
  //   url: "https://mojmotiv.si",
  //   siteName: "Moj Motiv",
  //   locale: "sl_SI",
  //   type: "website",
  //   images: [
  //     {
  //       url: "/og-image.jpg",
  //       width: 1200,
  //       height: 630,
  //       alt: "Moj Motiv - Unikatne majice z vašim motivom",
  //     },
  //   ],
  // },
  // twitter: {
  //   card: "summary_large_image",
  //   title: "Moj Motiv | Unikatne Majice",
  //   description:
  //     "Ustvarite svojo unikatno majico. Opišite motiv, izberite barvo in velikost. Naročite.",
  //   images: ["/og-image.jpg"],
  // },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://mojmotiv.si",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Moj Motiv",
  url: "https://mojmotiv.si",
  logo: "https://mojmotiv.si/assets/moj-motiv.png",
  description:
    "Ustvarite svojo unikatno majico. Opišite motiv, izberite barvo in velikost. Naročite.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "SI",
  },
  // offers: {
  //   "@type": "Offer",
  //   priceCurrency: "EUR",
  //   price: "19.90",
  //   availability: "https://schema.org/InStock",
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sl">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        <Providers>
          {children}
          <CheckoutDrawer />
        </Providers>
      </body>
    </html>
  );
}
