'use client'
import React, { useEffect, useState } from "react";
import SearchBar from "../searchbar/searchbar";

const IngresosMensuales: React.FC = () => {
    const [ventasMensuales, setVentasMensuales] = useState<any[]>([]);
    const [filteredIngresos, setFilteredIngresos] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const obtenerMesActual = () => {
        const meses = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];
        const fechaActual = new Date();
        return meses[fechaActual.getMonth()];
    };

    useEffect(() => {
        const fetchVentasMensuales = async () => {
            try {
                const response = await fetch(`/api/ventas`);
                if (response.ok) {
                    const data = await response.json();
                    console.log('Datos de ventas mensuales recibidos:', data);
                    setVentasMensuales(data.sales || []);
                } else {
                    throw new Error('Error al obtener las ventas mensuales');
                }
            } catch (error) {
                console.error('Error al obtener ventas mensuales:', error);
                setError('Error al obtener las ventas mensuales. Por favor, inténtelo de nuevo más tarde.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchVentasMensuales();
    }, []);

    useEffect(() => {
        if (ventasMensuales.length > 0) {
            const currentMonth = new Date().getMonth();
            const ventasDelMes = ventasMensuales.filter(venta => new Date(venta.saleDate).getMonth() === currentMonth);
            setFilteredIngresos(ventasDelMes);
        }
    }, [ventasMensuales]);

    const formatFecha = (fecha: string) => {
        const date = new Date(fecha);
        return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    };

    const totalPrecio = filteredIngresos.reduce((total, venta) => total + venta.price, 0);

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
            <h2>Ingresos Mensuales</h2>
            <h3>Mes de {obtenerMesActual()}</h3>
            <SearchBar stockData={ventasMensuales} filteredStockData={filteredIngresos} onFilterChange={handleSearchChange} />
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
            <p className="mt-4 font-bold text-xl">Total: <span className="text-green-600">${totalPrecio}</span></p>
        </div>
    );
};

export default IngresosMensuales;
