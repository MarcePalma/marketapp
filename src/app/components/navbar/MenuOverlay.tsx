'use client'
import React from 'react'
import NavLink from './NavLink'
import Link from 'next/link';
import Image from 'next/image';



const links = [
  { path: '/stock', title: 'Stock' },
  { path: '/gastos', title: 'Gastos' },
  { path: '/ingresos', title: 'Ingresos' },
  { path: '/informes', title: 'Informes' },
];

export default function MenuOverlay() {

  return (
    <ul className='flex flex-col py-4 items-center'>
      {links.map((link, index) => (

        <li key={index}>
          <NavLink href={link.path} title={link.title} />
        </li>
      ))}
    </ul>
  )
}
