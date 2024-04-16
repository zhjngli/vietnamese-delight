import RestaurantTitle from "@/components/RestaurantTitle";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} mx-auto max-w-5xl px-6 sm:px-8 lg:px-12`}
      >
        <RestaurantTitle name="Vietnamese Delight" />
        <main className="text-center mb-12">
          <div className="flex justify-evenly items-center mb-4">
            <h2 className="text-xl font-bold mb-4 px-2">
              <Link href="/about" className="hover:underline">
                About
              </Link>
            </h2>
            <h2 className="text-xl font-bold mb-4 px-2">
              <Link href="/" className="hover:underline">
                Menu
              </Link>
            </h2>
            <h2 className="text-xl font-bold mb-4 px-2">
              <Link
                target="_blank"
                href="https://www.yelp.com/biz/vietnamese-delight-los-angeles-2"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Yelp
              </Link>
            </h2>
            <h2 className="text-xl font-bold mb-4 px-2">
              <Link
                target="_blank"
                href="https://www.ubereats.com/store/vietnamese-delight-358-w-38th-st/5qOZv-i2RL6G2blPIkGCAw?diningMode=DELIVERY"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Order
              </Link>
            </h2>
          </div>
          {children}
        </main>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
