import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { cn } from "@/lib/utils";
import { Header } from "@/app/index";
import Footer from "@/components/componants/Footer";


const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "Medo-Tore | Find Something You Love",
  description:
    "Explore products, manage your favorites, and try the Medo-Tore training checkout.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", playfair.className)}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
        </body>
    </html>
  );
}
