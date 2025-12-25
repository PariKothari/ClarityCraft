import React from 'react';
import { Button } from '@/components/ui/button';
import Colors from '@/data/colors';
import Link from 'next/link';

function Header({ appName = "ClarityCraft" }) {
  return (
    <div className='px-4 flex justify-between items-center'>
      {/* Top-left branding */}
      <div className='flex items-center gap-5'>
        <h2 className='py-2 text-3xl font-extrabold text-white'>{appName}</h2>
      </div>

      {/* Right-side actions */}
      <div className='flex gap-1 items-center '>
        <Link href="/about">
          <Button variant="ghost" className="text-white hover:text-blue-400">
            About
          </Button>
        </Link>

        <Link href="/faqs">
          <Button variant="ghost" className="text-white hover:text-blue-400">
            FAQs
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Header;