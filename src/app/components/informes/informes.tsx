'use client'

import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import SearchBar from "../searchbar/searchbar";
import { Product } from "@prisma/client";

const Informes: React.FC = () => {
    const [ventas, setVentas] = useState<any[]>([]);

    useEffect(() => {
        const fetchVentas = async () => {
            try {
                const response = await fetch('/api/ventas');
                if (response.ok) {
                    const data = await response.json();
                    console.log('Datos de ventas recibidos:', data);
                    setVentas(data);
                } else {
                    throw new Error('Error al obtener las ventas');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchVentas();
    }, []);



    const handleFilterChange = () => {
        // Esta función no hace nada en este momento
    };
    return (
        <div>
            <Navbar />
            <div className="flex mx-auto w-full px-4 py-40 justify-center">
                <div className="col-span-2 bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Informes de Ventas</h2>
                    <SearchBar stockData={ventas} filteredStockData={ventas} onFilterChange={handleFilterChange} />
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Nombre</th>
                                <th className="p-3 text-left">Precio</th>
                                <th className="p-3 text-left">Cantidad</th>
                                <th className="p-3 text-left">Fecha de Venta</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ventas.map((venta, index) => (
                                <tr key={index}>
                                    <td className="p-3">{venta.id}</td>
                                    <td className="p-3">{venta.productName}</td>
                                    <td className="p-3 font-semibold">${venta.price}</td>
                                    <td className="p-3">{venta.quantity}</td>
                                    <td className="p-3">{venta.saleDate}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-gray-200">
                                <td colSpan={2} className="p-3 font-semibold text-right">Total:</td>
                                <td colSpan={3} className="p-3 font-semibold text-green-500">${ventas.reduce((total, venta) => total + (venta.price * venta.quantity), 0)}</td>
                            </tr>
                        </tfoot>
                    </table>

                </div>
            </div>
        </div>
    );
};

export default Informes;
