'use client'
import React, { useEffect, useState } from "react";
import SearchBar from "../searchbar/searchbar";

const IngresosDiarios: React.FC = () => {
    const [ventasDiarias, setVentasDiarias] = useState<any[]>([]);
    const [filteredIngresos, setFilteredIngresos] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchVentasDiarias = async () => {
            try {
                const today = new Date();
                const formattedDate = today.toISOString().split('T')[0];
                const response = await fetch(`/api/ventas?fecha=${formattedDate}`);
                if (response.ok) {
                    const data = await response.json();
                    console.log('Datos de ventas diarias recibidos:', data);
                    setVentasDiarias(data);
                    setFilteredIngresos(data);
                } else {
                    throw new Error('Error al obtener las ventas diarias');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchVentasDiarias();
    }, []);


    useEffect(() => {
        const filteredResults = ventasDiarias.filter(venta =>
            venta.productName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredIngresos(filteredResults);
    }, [searchTerm, ventasDiarias]);

    const handleSearchChange = () => {
        // Esta función no hace nada en este momento
    };
    return (
        <div>
            <h2>Ingresos Diarios</h2>
            <SearchBar stockData={ventasDiarias} filteredStockData={filteredIngresos} onFilterChange={handleSearchChange} />
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Fecha de Venta</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredIngresos.map((venta, index) => (
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

export default IngresosDiarios;
