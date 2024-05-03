"use client"

import React, { useEffect, useState } from "react";

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

    return (
        <div>
            <h2>Informes de Ventas</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre del Producto</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Fecha de Venta</th>
                    </tr>
                </thead>
                <tbody>
                    {ventas.map((venta, index) => (
                        <tr key={index}>
                            <td>{venta.id}</td>
                            <td>{venta.productName}</td>
                            <td>{venta.price}</td>
                            <td>{venta.quantity}</td>
                            <td>{venta.saleDate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Informes;