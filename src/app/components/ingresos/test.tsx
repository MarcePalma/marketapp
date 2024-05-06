import React, { useEffect, useState } from 'react';

// Define la interfaz para el tipo de dato de una venta
interface Sale {
    id: string;
    amount: number;
    saleDate: string;
}

const VentasComponent = () => {
    const [ventas, setVentas] = useState<Sale[]>([]); // Especifica el tipo de dato como Sale[]
    const [ventasHoy, setVentasHoy] = useState<Sale[]>([]); // También especifica el tipo de dato como Sale[]

    useEffect(() => {
        // Llamada a la API para obtener todas las ventas
        fetch('/api/ventas')
            .then(response => response.json())
            .then((data: { sales?: Sale[] }) => {
                if (data && data.sales) {
                    setVentas(data.sales);
                    const today = new Date().toISOString().split('T')[0];
                    const ventasHoy = data.sales.filter(venta => venta.saleDate.split('T')[0] === today);
                    setVentasHoy(ventasHoy);
                }
            })
            .catch(error => console.error("Error al obtener ventas:", error));
    }, []);

    return (
        <div>
            <h2>Ventas de hoy:</h2>
            <ul>
                {ventasHoy.map(venta => (
                    <li key={venta.id}>
                        {venta.amount} - {venta.saleDate}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default VentasComponent;
