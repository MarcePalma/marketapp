'use client'
import React from 'react';
import Link from 'next/link';

import { NavLinkProps } from '@/app/types/types';

const NavLink: React.FC<NavLinkProps> = ({ href, title }) => {
  return (
    <Link href={href} title={title} className='button' >

      {title}

    </Link>
  );
};

export default NavLink;