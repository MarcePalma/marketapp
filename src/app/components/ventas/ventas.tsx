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
    const [scannedProducts, setScannedProducts] = useState<Set<Product>>(new Set());
    const [isSaleCompleted, setIsSaleCompleted] = useState<boolean>(false);
    const [isCompletingSale, setIsCompletingSale] = useState(false);
    const [soldAmount, setSoldAmount] = useState(0);

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
        const scannedProduct = filteredStockData.find(product => product.codebar.toString() === code);
        if (scannedProduct) {
            const existingProduct = Array.from(scannedProducts).find(product => product.codebar === scannedProduct.codebar);
            if (existingProduct) {
                // Si el producto ya está escaneado, aumentar su cantidad en 1
                const updatedProduct = { ...existingProduct, quantity: existingProduct.quantity + 1 };
                setScannedProducts(prevProducts => new Set([...prevProducts].map(product => product.codebar === updatedProduct.codebar ? updatedProduct : product)));
            } else {
                // Si el producto no está escaneado, agregarlo con cantidad 1
                setScannedProducts(prevProducts => new Set(prevProducts.add({ ...scannedProduct, quantity: 1 })));
            }
        }
    };

    // Calcular el precio total
    const totalPrice = Array.from(scannedProducts).reduce((total, product) => {
        return total + (product.price * product.quantity);
    }, 0);

    //Funcion para manejar la cantidad de productos escaneados
    const handleChangeQuantity = (product: Product, newQuantity: number) => {
        const updatedScannedProducts = new Set(scannedProducts);
        updatedScannedProducts.delete(product); // Elimina el producto actual
        const updatedProduct = { ...product, quantity: newQuantity }; // Actualiza la cantidad del producto
        updatedScannedProducts.add(updatedProduct); // Agrega el producto actualizado
        setScannedProducts(updatedScannedProducts);
    };


    const handleSaleCompleted = () => {
        // Simular una venta completada
        setIsCompletingSale(true);
        setSoldAmount(1000); // Por ejemplo, se vendió $1000

        // Lógica para subir el monto vendido a la base de datos

        // Después de 1 segundo, restablecer el estado
        setTimeout(() => {
            setIsCompletingSale(false);
            setSoldAmount(0);
        }, 1000);
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
                                <th className="p-2 text-left">Precio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStockData.map((product) => (
                                <tr key={product.id} className="border-b border-gray-200">
                                    <td className="py-2">{product.id}</td>
                                    <td className="py-2">{product.name}</td>
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
                            {Array.from(scannedProducts).map((product, index) => (
                                <tr key={index} className="border-b border-gray-200">
                                    <td className="py-2">{product.id}</td>
                                    <td className="py-2">{product.name}</td>
                                    <td className="py-2">
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-full mr-2" onClick={() => handleChangeQuantity(product, product.quantity - 1)}>
                                            -
                                        </button>
                                        <input type="number" value={product.quantity} onChange={(e) => handleChangeQuantity(product, parseInt(e.target.value))} className="border border-gray-300 rounded-md px-2 py-1 text-center" style={{ maxWidth: "60px" }} />
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-full ml-2" onClick={() => handleChangeQuantity(product, product.quantity + 1)}>
                                            +
                                        </button>
                                    </td>
                                    <td className="py-2">${product.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-4">
                        <h2 className="text-lg font-semibold">Total</h2>
                        <p className="text-xl font-bold">${totalPrice.toFixed(2)}</p>
                        {!isSaleCompleted && scannedCode && (
                            <div className="flex justify-right mt-4 relative">
                                <button className="bg-green-500 text-white px-4 py-2 rounded-md" onClick={handleSaleCompleted}>
                                    Venta Completada
                                </button>
                                {isCompletingSale && (
                                    <div className="absolute bottom-0 right-0 bg-green-500 text-white px-2 py-1 rounded-md animate-moveUp">
                                        Completando venta...
                                    </div>
                                )}
                                {soldAmount > 0 && (
                                    <div className="absolute bottom-0 right-0 bg-green-500 text-white px-2 py-1 rounded-md animate-moveUp">
                                        +${soldAmount}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <style>
                {`
               @keyframes moveUp {
                0% {
                    opacity: 1;
                    transform: translateY(0);
                }
                100% {
                    opacity: 0;
                    transform: translateY(-50px);
                }
            }
            
            .animate-moveUp {
                animation: moveUp 1s ease forwards;
            }`}
            </style>
        </div>
    );
};

export default Sales;
