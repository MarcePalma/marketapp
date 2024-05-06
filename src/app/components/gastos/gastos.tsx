'use client'
import React, { useEffect, useState } from 'react';

const GastosMensuales = () => {
    const [gastos, setGastos] = useState<number>(0);
    const [ingresos, setIngresos] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [newExpense, setNewExpense] = useState<number>(0);


    const obtenerMesActual = () => {
        const meses = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];
        const fechaActual = new Date();
        return meses[fechaActual.getMonth()];
    };

    const handleAgregarGasto = async () => {
        try {
            const response = await fetch('/api/informes/gastos/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ concepto: newExpense })
            });

            if (response.ok) {
                setGastos(gastos + newExpense);
            } else {
                throw new Error('Error al agregar el gasto');
            }
        } catch (error) {
            console.error('Error al agregar el gasto:', error);
            setError('Error al agregar el gasto. Por favor, inténtelo de nuevo más tarde.');
        }
    };

    useEffect(() => {
        const fetchGastosMensuales = async () => {
            try {
                const response = await fetch('/api/informes/gastos');
                if (response.ok) {
                    const data = await response.json();
                    // Filtrar los gastos del mes actual
                    const currentMonth = new Date().getMonth();
                    const gastosDelMes = data.filter((gasto: any) => new Date(gasto.fecha).getMonth() === currentMonth);


                    const totalGastos: number = gastosDelMes.reduce((total: number, gasto: any) => total + gasto.concepto, 0);

                    setGastos(totalGastos);
                } else {
                    throw new Error('Error al obtener los gastos mensuales');
                }
            } catch (error) {
                console.error('Error al obtener los gastos mensuales:', error);
                setError('Error al obtener los gastos mensuales. Por favor, inténtelo de nuevo más tarde.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchGastosMensuales();
    }, []);

    useEffect(() => {
        const fetchVentasMensuales = async () => {
            try {
                const response = await fetch(`/api/ventas`);
                if (response.ok) {
                    const data = await response.json();
                    const currentMonth = new Date().getMonth();
                    const ventasDelMes = data.sales.filter((venta: any) => new Date(venta.saleDate).getMonth() === currentMonth);
                    const totalIngresos: number = ventasDelMes.reduce((total: number, venta: any) => total + venta.price, 0);
                    setIngresos(totalIngresos);
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


    
    return (
        <div>
            <h2>Gastos e Ingresos del Mes de {obtenerMesActual()} </h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Gastos</th>
                        <th>Ingresos</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{`-$${gastos}`}</td>
                        <td>{`$${ingresos}`}</td>
                    </tr>
                </tbody>
            </table>
            <div>
                <input type="number" placeholder="Ingrese el gasto" value={newExpense} onChange={(e) => setNewExpense(parseFloat(e.target.value))} />
                <button onClick={handleAgregarGasto}>Agregar Gasto</button>
            </div>
            {error && <p>{error}</p>}
            <style>
                {
                    `
                    .table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                      }
                      
                      .table th,
                      .table td {
                        padding: 8px;
                        text-align: left;
                        border-bottom: 1px solid #ddd;
                      }
                      
                      .table th {
                        background-color: #f2f2f2;
                        font-weight: bold;
                      }
                      `
                }
            </style>
        </div>
    );
};

export default GastosMensuales;
