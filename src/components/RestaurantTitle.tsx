import Link from "next/link";

interface RestaurantTitleProps {
  name: string;
}

export default function RestaurantTitle({ name }: RestaurantTitleProps) {
  return (
    <div className="text-center my-8">
      <Link href="/">
        <h1 className="text-3xl font-bold">{name}</h1>
      </Link>
    </div>
  );
}
