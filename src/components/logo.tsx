import Image from "next/image";
import Link from "next/link";
import React from "react";

function Logo() {
  return (
    <Link className="ml-4 mr-2" href={"/"}>
      <div className="w-full h-full flex items-center flex-row gap-2 overflow-hidden rounded-md">
        <Image alt="Skylark Logo" src="/logo.png" width={20} height={20} />
        <Image
          alt="Skylark Logo"
          src="/textLogoImage.png"
          width={60}
          height={60}
        />
      </div>
    </Link>
  );
}

export default Logo;
