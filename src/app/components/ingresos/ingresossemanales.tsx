'use client'
import React, { useEffect, useState } from 'react';
import SearchBar from '../searchbar/searchbar';

const IngresosSemanales: React.FC = () => {
    const [ventasSemanales, setVentasSemanales] = useState<any[]>([]);
    const [filteredIngresos, setFilteredIngresos] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVentasSemanales = async () => {
            try {
                const response = await fetch(`/api/ventas`);
                if (response.ok) {
                    const data = await response.json();
                    console.log('Datos de ventas semanales recibidos:', data);
                    setVentasSemanales(data.sales || []);
                } else {
                    throw new Error('Error al obtener las ventas semanales');
                }
            } catch (error) {
                console.error('Error al obtener ventas semanales:', error);
                setError('Error al obtener las ventas semanales. Por favor, inténtelo de nuevo más tarde.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchVentasSemanales();
    }, []);

    useEffect(() => {
        if (ventasSemanales.length > 0) {
            const today = new Date();
            const firstDayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1); // Lunes de esta semana
            const lastDayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 7); // Domingo de esta semana
            const ventasSemanaActual = ventasSemanales.filter(venta => {
                const ventaDate = new Date(venta.saleDate);
                return ventaDate >= firstDayOfWeek && ventaDate <= lastDayOfWeek;
            });
            setFilteredIngresos(ventasSemanaActual);
        }
    }, [ventasSemanales]);

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
            <h2>Ingresos Semanales</h2>
            <SearchBar stockData={ventasSemanales} filteredStockData={filteredIngresos} onFilterChange={handleSearchChange} />
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

export default IngresosSemanales;



// Función para obtener la fecha del primer día de la semana actual
const obtenerFechaStringPrimerDiaSemana = () => {
    const hoy = new Date();
    const primerDiaSemana = hoy.getDate() - hoy.getDay() + 1; // Lunes de esta semana
    const fechaPrimerDiaSemana = new Date(hoy.setDate(primerDiaSemana));
    const dia = fechaPrimerDiaSemana.getDate();
    const mes = fechaPrimerDiaSemana.getMonth() + 1;
    return `${dia}/${mes}`;
};

// Función para obtener la fecha del último día de la semana actual
const obtenerFechaStringUltimoDiaSemana = () => {
    const hoy = new Date();
    const ultimoDiaSemana = hoy.getDate() - hoy.getDay() + 7; // Domingo de esta semana
    const fechaUltimoDiaSemana = new Date(hoy.setDate(ultimoDiaSemana));
    const dia = fechaUltimoDiaSemana.getDate();
    const mes = fechaUltimoDiaSemana.getMonth() + 1;
    return `${dia}/${mes}`;
};
