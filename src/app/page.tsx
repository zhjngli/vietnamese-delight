import Link from "next/link";

import MenuList from "./MenuList";
import RestaurantTitle from "./RestaurantTitle";
import { appetizers, sampleMenuItems } from "./items";
import RootLayout from "./layout";

export default function Home() {
  return (
    <RootLayout>
      <RestaurantTitle name="Vietnamese Delight" />
      <main className="text-center mb-12">
        <div className="flex justify-evenly items-center mb-4 px-8">
          <h2 className="text-xl font-bold mb-4 underline">Menu</h2>
          <h2 className="text-xl font-bold mb-4">
            <Link
              target="_blank"
              href="https://www.ubereats.com/store/vietnamese-delight-358-w-38th-st/5qOZv-i2RL6G2blPIkGCAw?diningMode=DELIVERY"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Order Now
            </Link>
          </h2>
        </div>
        <MenuList menuSection="sample" menuItems={sampleMenuItems} />
        <MenuList menuSection="Appetizers" menuItems={appetizers} />
      </main>
    </RootLayout>
  );
}
