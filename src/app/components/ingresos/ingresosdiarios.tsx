'use client'
import React, { useEffect, useState } from "react";
import SearchBar from "../searchbar/searchbar";

const IngresosDiarios: React.FC = () => {
    const [ventasDiarias, setVentasDiarias] = useState<any[]>([]);
    const [filteredIngresos, setFilteredIngresos] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVentasDiarias = async () => {
            try {
                const response = await fetch(`/api/ventas`);
                if (response.ok) {
                    const data = await response.json();
                    console.log('Datos de ventas diarias recibidos:', data);
                    setVentasDiarias(data.sales || []);
                } else {
                    throw new Error('Error al obtener las ventas diarias');
                }
            } catch (error) {
                console.error('Error al obtener ventas diarias:', error);
                setError('Error al obtener las ventas diarias. Por favor, inténtelo de nuevo más tarde.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchVentasDiarias();
    }, []);

    useEffect(() => {
        if (ventasDiarias.length > 0) {
            const today = new Date().toISOString().split('T')[0];
            const ventasHoy = ventasDiarias.filter(venta => venta.saleDate.split('T')[0] === today);
            setFilteredIngresos(ventasHoy);
        }
    }, [ventasDiarias]);

    const formatFecha = (fecha: string) => {
        const date = new Date(fecha);
        return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    };

    const totalPrecio = filteredIngresos.reduce((total, venta) => total + venta.price * venta.quantity, 0);

    // Esta función no hace nada por ahora
    const handleSearchChange = () => {
        // No hace nada por ahora
    };

    if (isLoading) {
        return <p>Cargando...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h2>Ingresos Diarios</h2>
            <SearchBar stockData={ventasDiarias} filteredStockData={filteredIngresos} onFilterChange={handleSearchChange} />
            <table className="w-full">
                <thead>
                    <tr className="bg-gray-200">
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
                                <td className="p-3">{venta.productName}</td>
                                <td className="p-3 font-semibold">${venta.price}</td>
                                <td className="p-3">{venta.quantity}</td>
                                <td className="p-3">{formatFecha(venta.saleDate)}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <p className="mt-4">Total: ${totalPrecio}</p>
        </div>
    );
};

export default IngresosDiarios;
