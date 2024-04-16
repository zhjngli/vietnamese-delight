import RootLayout from "../app/layout";
import MenuList from "../components/MenuList";
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
} from "../components/items";

export default function Home() {
  return (
    <RootLayout>
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
    </RootLayout>
  );
}
