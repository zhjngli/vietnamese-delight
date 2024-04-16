import Link from "next/link";

import MenuList from "./MenuList";
import RestaurantTitle from "./RestaurantTitle";
import {
  all_day_breakfast__croissant_sandwiches,
  appetizers,
  banh_mi__vietnamese_sandwich,
  dessert,
  drinks,
  flavored_teas_and_coffee,
  fresh_flavored_lemonade,
  pho,
  rice_plate,
  salad,
  vegan,
  vermicelli,
} from "./items";
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
        <MenuList menuSection="Appetizers" menuItems={appetizers} />
        <MenuList menuSection="Pho" menuItems={pho} />
        <MenuList
          menuSection="Banh Mi (Vietnamese Sandwiches)"
          menuItems={banh_mi__vietnamese_sandwich}
        />
        <MenuList menuSection="Rice Plates" menuItems={rice_plate} />
        <MenuList menuSection="Vermicelli" menuItems={vermicelli} />
        <MenuList
          menuSection="Croissant Sandwiches"
          menuItems={all_day_breakfast__croissant_sandwiches}
        />
        <MenuList menuSection="Salad" menuItems={salad} />
        <MenuList menuSection="Vegan" menuItems={vegan} />
        <MenuList
          menuSection="Teas & Coffees"
          menuItems={flavored_teas_and_coffee}
        />
        <MenuList
          menuSection="Fresh Lemonade"
          menuItems={fresh_flavored_lemonade}
        />
        <MenuList menuSection="Drinks" menuItems={drinks} />
        <MenuList menuSection="Dessert" menuItems={dessert} />
      </main>
    </RootLayout>
  );
}
