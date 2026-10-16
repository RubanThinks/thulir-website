import type { Metadata } from "next";
import { Poppins, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const headingFont = Poppins({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const serifFont = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  display: "swap",
});

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Thulir Special School | Education, Therapy & Developmental Support",
  description:
    "Discover Thulir Special School in Coimbatore, supporting children with special needs through individualized education, therapy, life skills, and family-centered developmental support.",
  keywords: [
    "Thulir Special School",
    "Thulir Therapy Centre",
    "Special Education Coimbatore",
    "Paediatric Occupational Therapy Rathinapuri",
    "Speech Therapy Coimbatore",
    "Autism Centre Coimbatore",
    "Dr S Venkatesan Thulir",
    "Inclusive Education Coimbatore",
  ],
  authors: [{ name: "Thulir Educational Trust for Special Needs" }],
  openGraph: {
    title: "Thulir Special School & Therapy Centre | Coimbatore",
    description:
      "Empowering every child through specialized education, therapies, community exposure, and family support in Coimbatore.",
    url: "https://thulirtherapycentre.com",
    siteName: "Thulir Special School",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${headingFont.variable} ${serifFont.variable} ${bodyFont.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#FBFBFA] text-[#151515] antialiased">
        {children}
      </body>
    </html>
  );
}
