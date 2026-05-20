import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <p>
        Classic, delicious, and fast vietnamese kitchen with all the delights
        you are craving!
      </p>
      <br />
      <p>
        Find us at:
        <br />
        <Link
          target="_blank"
          href="https://www.google.com/maps/search/?api=1&query=1842+W+Washington+Blvd%2C+Los+Angeles%2C+CA+90007"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          1842 W Washington Blvd
          <br />
          Los Angeles, CA 90007
        </Link>
      </p>
    </>
  );
}
