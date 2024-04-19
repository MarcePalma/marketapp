'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import NavLink from './NavLink.tsx';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import MenuOverlay from './MenuOverlay.tsx';
import Image from 'next/image.js';


export default function Navbar() {
  const [navbarOpen, setNavbarOpen] = useState(false);

  const navLinks = [
    {
      title: `Stock`,
      path: '/stock',
    },
    {
      title: `Ventas`,
      path: '/ventas',
    },
    {
      title: `Gastos`,
      path: '/gastos',
    },
    {
      title: `Informes`,
      path: '/turnos',
    },
    {
      title: `Ingresos`,
      path: '/ingresos',
    },
  ];

  return (
    <nav className="fixed mx-auto border border-[#ff0000] top-0 left-0 right-0 z-10 bg-[#fff] bg-opacity-100">
      <div className="flex container lg:py-4 flex-wrap items-center justify-between mx-auto px-4 py-2">
        <Link href={'/'} className="text-2xl md:text-5xl text-black font-semibold flex items-center justify-between">
          <Image className="mx-auto" width={200} height={100} src="/images/logo.webp" alt="Logo" />
        </Link>
        <div className="mobile-menu block md:hidden">
          {!navbarOpen ? (
            <button title='boton de menu' name='Boton de Menu'
              onClick={() => setNavbarOpen(true)}
              className="flex items-center px-3 py-2 border rounded border-slate-200 text-black hover:text-pink-500 hover:border-white"
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
          ) : (
            <button title='boton de menu' name='Boton de Menu'
              onClick={() => setNavbarOpen(false)}
              className="flex items-center px-3 py-2 border rounded border-slate-200 text-black hover:text-pink-500 hover:border-white"
            >
              <XMarkIcon className='h-5 w-5' />
            </button>
          )}
        </div>
        <div className="menu hidden md:block md:w-auto" id="navbar">
          <ul className="flex p-4 md:p-0 md:flex-row md:space-x-8 mt-0">
            {navLinks.map((link, index) => (
              <li key={index}>
                <NavLink href={link.path} title={link.title} />
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* @ts-ignore */}
      {navbarOpen ? <MenuOverlay links={navLinks} /> : null}

    </nav>
  );
}
