'use client'
import React, { useEffect, useState } from "react";
import SearchBar from "../searchbar/searchbar";

const IngresosDiarios: React.FC = () => {
    const [ventasDiarias, setVentasDiarias] = useState<any[]>([]);
    const [filteredIngresos, setFilteredIngresos] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);

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
            } finally {
                setIsLoading(false);
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
            {isLoading ? (
                <p>Cargando...</p>
            ) : (
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
                        {filteredIngresos.length === 0 ? (
                            <tr>
                                <td colSpan={5}>Nada que mostrar por ahora</td>
                            </tr>
                        ) : (
                            filteredIngresos.map((venta, index) => (
                                <tr key={index}>
                                    <td className="p-3">{venta.id}</td>
                                    <td className="p-3">{venta.productName}</td>
                                    <td className="p-3 font-semibold">${venta.price}</td>
                                    <td className="p-3">{venta.quantity}</td>
                                    <td className="p-3">{venta.saleDate}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default IngresosDiarios;