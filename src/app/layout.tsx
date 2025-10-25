import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import CheckoutDrawer from "@/components/layout/CheckoutDrawer";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Kreativko",
  // description:"Naj tvoja kreativa zasije. Ustvari nekaj neverjetnega še danes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sl">
      <body>
        <Providers>
          {children}
          <CheckoutDrawer />
        </Providers>
      </body>
    </html>
  );
}
