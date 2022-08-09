import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`${isScrolled && "bg-zinc-900/80"}`}>
      <div className="flex items-center justify-between  w-full">
        <div className="flex items-center space-x-10">
          <Link href="/">
            <h1 className="text-4xl text-pink-600 font-extrabold uppercase ml-[-20px]">
              Tikma
            </h1>
          </Link>
          <nav className="space-x-4 justify-start font-light md:flex">
            <Link href="/" className="headerLink">
              Home
            </Link>
            <Link href="/" className="headerLink">
              What to watch
            </Link>
          </nav>
        </div>
        <Link href="/user" className="headerLink ml-auto">
          Account
        </Link>
      </div>
    </header>
  );
}
