import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MenuItem } from "./items";

interface MenuListProps {
  menuItems: MenuItem[];
}

export default function MenuList({ menuItems }: MenuListProps) {
  return (
    <div className="text-center">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:text-left">
        {menuItems.map((menuItem) => (
          <div key={menuItem.id} className="bg-gray-100 p-4">
            <div className="flex items-center">
              <div className="mr-4 overflow-hidden">
                <Image
                  src={menuItem.imageSrc}
                  alt={menuItem.name}
                  layout="fixed"
                  width={100}
                  height={100}
                  objectFit="cover"
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
