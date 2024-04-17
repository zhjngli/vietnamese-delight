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
          href="https://maps.app.goo.gl/qMepXDGC1gnZMgHD7"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          358 W 38th St Unit 1<br />
          Los Angeles, CA 90037
        </Link>
      </p>
    </>
  );
}
