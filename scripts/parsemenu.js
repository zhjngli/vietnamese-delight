import fs from "fs";

import data from "./data.json" with { type: "json" };

const menuSectionExport = function (menuSection) {
  const sanitizedName = menuSection.name
    .toLowerCase()
    .replaceAll("&amp;", "and")
    .replaceAll("-", "")
    .replaceAll(" ", "_");
  const exportStatement = `export const ${sanitizedName} = [`;
  const endStatement = `];`;
  const items = menuSection.hasMenuItem
    .map((i) => {
      return `{
                name: "${i.name.replaceAll("＆", "&").replaceAll("’", "'")}",
                price: ${i.offers.price},
                imageSrc: "",
            },`;
    })
    .join("\n");
  return [exportStatement, items, endStatement].join("\n");
};

const constant = `export const sampleMenuItems = [
    {
      name: "Classic Burger",
      price: 9.99,
      imageSrc: "/mini_chicken_wonton.jpeg",
    },
    {
      name: "Margherita Pizza",
      price: 12.99,
      imageSrc: "/mini_chicken_wonton.jpeg",
    },
    {
      name: "Caesar Salad",
      price: 6.99,
      imageSrc: "/mini_chicken_wonton.jpeg",
    },
    {
      name: "Spaghetti Bolognese",
      price: 11.99,
      imageSrc: "/mini_chicken_wonton.jpeg",
    },
    {
      name: "Grilled Chicken Sandwich",
      price: 8.99,
      imageSrc: "/mini_chicken_wonton.jpeg",
    },
];`;

const content = data.hasMenu.hasMenuSection
  .map((section) => {
    return menuSectionExport(section);
  })
  .join("\n");

const out = [constant, content].join("\n");

const menuItems = "src/app/items.tsx";

try {
  fs.writeFileSync(menuItems, out);
} catch (err) {
  console.error(`Error occurred when writing ${menuItems}: ${err}`);
  process.exit(1);
}
