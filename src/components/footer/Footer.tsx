import React from 'react';
import Link from 'next/link';
import { FaFacebook } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
      <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 Skylark. Bảo lưu mọi quyền.</p>
      <nav className="sm:ml-auto flex gap-4 sm:gap-6">
        <Link href="https://www.facebook.com/khoatruong13" className="text-xl hover:underline underline-offset-4">
          <FaFacebook/>
        </Link>
      </nav>
    </footer>
  );
};

export default Footer;
