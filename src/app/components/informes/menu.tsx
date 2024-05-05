import React from 'react';
import Link from 'next/link';

export default function SidebarMenu() {
    const handleCloseMenu = (e: React.MouseEvent<HTMLDetailsElement, MouseEvent>) => {
        const parentDetails = e.currentTarget.parentElement;
        if (parentDetails) {
            parentDetails.removeAttribute('open');
        }
    };

    return (
        <div className="flex flex-col justify-between border-e bg-white py-40 sidebar-menu">
            <div className="px-4 py-6">
                <ul className="mt-6 space-y-1">
                    <li>
                        <a
                            href="#"
                            className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        >
                            Ingresos Diarios
                        </a>
                    </li>

                    <li>
                        <a
                            href="#"
                            className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        >
                            Ingresos Semanales
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        >
                            Ingresos Mensuales
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        >
                            Gastos
                        </a>
                    </li>
                </ul>
            </div>
            <style>
                {
                    `
                    .sidebar-menu {
                        max-width: 500px; /* Definir un ancho máximo para el menú */
                      }
                      
                      .sidebar-menu summary::-webkit-details-marker {
                        display: none; /* Ocultar el indicador de detalles */
                      }
                      `

                }
            </style>
        </div>
    );
}