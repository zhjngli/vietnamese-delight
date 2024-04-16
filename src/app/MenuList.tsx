import Image from "next/image";
import { MenuItem } from "./items";

interface MenuListProps {
  menuSection: string;
  menuItems: MenuItem[];
}

export default function MenuList({ menuSection, menuItems }: MenuListProps) {
  return (
    <div className="text-center">
      <h3 className="text-xl font-bold mb-4">{menuSection}</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:text-left">
        {menuItems.map((menuItem) => (
          <div key={menuItem.id} className="bg-gray-100 p-4">
            <div className="flex items-center">
              <div className="mr-4 overflow-hidden">
                <Image
                  src={menuItem.imageSrc}
                  alt={menuItem.name}
                  width={100}
                  height={100}
                />
              </div>
              <div className="text-left">
                <span className="block text-lg font-bold">{menuItem.name}</span>
                <span className="block">${menuItem.price.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
