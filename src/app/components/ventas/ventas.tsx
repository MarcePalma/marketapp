'use client'
import React, { useEffect, useState } from "react";
import BarcodeScanner from "../barcodescanner/barcodescanner";
import Navbar from "../navbar/Navbar";
import SearchBar from "../searchbar/searchbar";
import { Product } from "../stock/stock";

const Sales: React.FC = () => {
    const [scannedCode, setScannedCode] = useState<string | null>(null);
    const [stockData, setStockData] = useState<Product[]>([]);
    const [filteredStockData, setFilteredStockData] = useState<Product[]>([]);
    const [scannedProducts, setScannedProducts] = useState<Product[]>([]);
    const [isSaleCompleted, setIsSaleCompleted] = useState<boolean>(false);

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const response = await fetch('/api/stock');
                if (response.ok) {
                    const data = await response.json();
                    console.log('Datos del stock recibidos:', data);
                    setStockData(data);
                    setFilteredStockData(data);
                } else {
                    throw new Error('Error al obtener el stock');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchStockData();
    }, []);

    // Función para manejar el escaneo de códigos de barras
    const handleScan = (code: string) => {
        setScannedCode(code);
        const scannedProduct = stockData.find(product => product.codebar === parseInt(code));
        if (scannedProduct) {
            setScannedProducts(prevProducts => [...prevProducts, scannedProduct]);
        }
    };

    // Calcular el precio total
    const totalPrice = scannedProducts.reduce((total, product) => {
        return total + (product.price * product.quantity);
    }, 0);

    const handleSaleCompleted = () => {
        setIsSaleCompleted(true);
    };

    const handleFilterChange = (filteredData: Product[]) => {
        setFilteredStockData(filteredData);
    };

    return (
        <div>
            <Navbar />
            <div className="grid grid-cols-3 gap-4 mx-auto max-w-7xl px-4 py-40">
                <div className="col-span-1 bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Escáner de Códigos de Barras</h2>
                    <BarcodeScanner onScan={handleScan} />
                    {scannedCode && (
                        <p>Código de barras escaneado: {scannedCode}</p>
                    )}
                </div>
                <div className="col-span-2 bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Productos Disponibles</h2>
                    <SearchBar stockData={stockData} filteredStockData={filteredStockData} onFilterChange={handleFilterChange} />
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="p-2 text-left">ID</th>
                                <th className="p-2 text-left">Nombre</th>
                                <th className="p-2 text-left">Cantidad</th>
                                <th className="p-2 text-left">Precio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStockData.map((product) => (
                                <tr key={product.id} className="border-b border-gray-200">
                                    <td className="py-2">{product.id}</td>
                                    <td className="py-2">{product.name}</td>
                                    <td className="py-2">{product.quantity}</td>
                                    <td className="py-2">${product.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="p-2 text-left">ID</th>
                                <th className="p-2 text-left">Nombre</th>
                                <th className="p-2 text-left">Cantidad</th>
                                <th className="p-2 text-left">Precio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scannedProducts.map((product, index) => (
                                <tr key={index} className="border-b border-gray-200">
                                    <td className="py-2">{product.id}</td>
                                    <td className="py-2">{product.name}</td>
                                    <td className="py-2">{product.quantity}</td>
                                    <td className="py-2">${product.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-4">
                        <h2 className="text-lg font-semibold">Total</h2>
                        <p className="text-xl font-bold">${totalPrice.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            {!isSaleCompleted && scannedCode && (
                <div className="flex justify-center mt-4">
                    <button className="bg-green-500 text-white px-4 py-2 rounded-md" onClick={handleSaleCompleted}>
                        Venta Completada
                    </button>
                </div>
            )}
        </div>
    );
};

export default Sales;
