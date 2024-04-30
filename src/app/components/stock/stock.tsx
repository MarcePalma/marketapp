"use client"
import React, { useState, useEffect } from 'react';
import { PrismaClient } from '@prisma/client';
import Navbar from '../navbar/Navbar';
import SearchBar from '../searchbar/searchbar';

export interface Product {
    id: number;
    name: string;
    quantity: number;
    price: number;
    codebar: number;
    discount: string;
    originalQuantity: number;
    originalPrice: number;
    originalDiscount: string;
    changed?: boolean;
}

const Stock: React.FC = () => {
    const [stockData, setStockData] = useState<Product[]>([]);
    const [filteredStockData, setFilteredStockData] = useState<Product[]>([]);
    const [changesMade, setChangesMade] = useState(false);
    const prisma = new PrismaClient();

    useEffect(() => {
        fetch('/api/stock')
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Error al obtener el stock');
            })
            .then((data: Product[]) => {
                const stockDataWithOriginalValues = data.map(product => ({
                    ...product,
                    originalQuantity: product.quantity,
                    originalPrice: product.price,
                    originalDiscount: product.discount,
                }));
                setStockData(stockDataWithOriginalValues);
                setFilteredStockData(stockDataWithOriginalValues); // Inicializa los datos filtrados
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    const handleFilterChange = (filteredData: Product[]) => {
        setFilteredStockData(filteredData); // Actualiza el estado de datos filtrados
    };

    const handleQuantityChange = (index: number, newQuantity: string) => {
        setChangesMade(true);
        const newStockData = stockData.map((product, i) => {
            if (i === index) {
                return {
                    ...product,
                    quantity: parseInt(newQuantity),
                    changed: true,
                };
            }
            return product;
        });
        setStockData(newStockData);
        setFilteredStockData(newStockData); // Actualiza los datos filtrados también
    };

    const handlePriceChange = (index: number, newPrice: string) => {
        setChangesMade(true);
        const newStockData = stockData.map((product, i) => {
            if (i === index) {
                return {
                    ...product,
                    price: parseFloat(newPrice),
                    changed: true,
                };
            }
            return product;
        });
        setStockData(newStockData);
        setFilteredStockData(newStockData); // Actualiza los datos filtrados también
    };

    const handleDiscountChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        setChangesMade(true);
        const newDiscount = Math.floor(parseFloat(event.target.value)).toString();
        const newStockData = stockData.map((product, i) => {
            if (i === index) {
                const updatedProduct = {
                    ...product,
                    discount: newDiscount,
                    changed: true,
                };

                // Si hay descuento, actualiza el precio visualmente
                if (parseFloat(newDiscount) > 0) {
                    const newPrice = product.originalPrice * (1 - parseFloat(newDiscount) / 100);
                    updatedProduct.price = newPrice;
                } else {
                    // Si no hay descuento, restaura el precio original
                    updatedProduct.price = product.originalPrice;
                }

                return updatedProduct;
            }
            return product;
        });
        setStockData(newStockData);
        setFilteredStockData(newStockData); // Actualiza los datos filtrados también
    };

    //Funcion para Eliminar productos de la DB
    const handleDeleteProduct = async (id: number) => {
        try {
            console.log('Eliminando producto...');
            const response = await fetch(`/api/stock/delete/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setStockData(prevStockData => prevStockData.filter(product => product.id !== id));
                console.log('Producto eliminado correctamente.');
            } else {
                throw new Error('Error al eliminar el producto');
            }
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    };

    // Función para guardar los cambios realizados en el stock
    const handleSaveChanges = async () => {
        try {
            console.log('Guardando cambios...');

            const updatedProducts: Product[] = [];

            stockData.forEach(product => {
                if (product.changed) {
                    const updatedProduct: Product = {
                        id: product.id,
                        name: product.name,
                        quantity: product.quantity,
                        price: product.price,
                        discount: product.discount,
                        codebar: product.codebar,
                        originalQuantity: product.originalQuantity,
                        originalPrice: product.originalPrice,
                        originalDiscount: product.originalDiscount
                    };

                    updatedProducts.push(updatedProduct);
                }
            });

            const response = await fetch('/api/stock/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProducts),
            });

            if (response.ok) {
                console.log('Cambios guardados correctamente.');
                setChangesMade(false);
            } else {
                console.error('Error al guardar los cambios:', response.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud fetch:', error);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="grid grid-cols-2 gap-4 mx-auto  px-40 py-40">
                <div className="col-span-2 bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Stock</h2>
                    <SearchBar stockData={stockData} filteredStockData={filteredStockData} onFilterChange={handleFilterChange} />
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="p-2 text-left">ID</th>
                                <th className="p-2 text-left">Nombre</th>
                                <th className="p-2 text-left">Cantidad</th>
                                <th className="p-2 text-left">Precio</th>
                                <th className="p-2 text-left">Descuento (%)</th>
                                <th className="p-2 text-left">Código de Barras</th>
                                <th className="p-2 text-left">Eliminar (X)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStockData
                                .sort((a, b) => a.id - b.id) // Ordenar por ID
                                .map((product, index) => (
                                    <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-100">
                                        <td className="py-2">{product.id}</td>
                                        <td className="py-2">{product.name}</td>
                                        <td className="py-2">
                                            <input
                                                type="number"
                                                value={product.quantity}
                                                onChange={(e) => handleQuantityChange(index, e.target.value)}
                                            />
                                        </td>
                                        <td className="py-2">
                                            ${" "}
                                            <input
                                                type="number"
                                                value={product.price}
                                                onChange={(e) => handlePriceChange(index, e.target.value)}
                                            />
                                        </td>
                                        <td className="py-2">
                                            <input
                                                type="number"
                                                className="w-full p-1 border border-gray-300 rounded"
                                                value={product.discount}
                                                onChange={(e) => handleDiscountChange(index, e)}
                                            />
                                        </td>
                                        <td className="py-2">{product.codebar}</td>
                                        <td>
                                            <button
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm text-red-500 shadow-sm focus:relative hover:bg-red-500 hover:text-white transition duration-300"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="h-4 w-4"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                                    />
                                                </svg>
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    {changesMade && (
                        <button
                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            onClick={handleSaveChanges}
                        >
                            Guardar Cambios
                        </button>
                    )}
                </div>
            </div>
            <style jsx>{`
                tbody tr:hover {
                    background-color: #f3f3f3;
                }
                td {
                    vertical-align: middle;
                    cursor: pointer;
                }

                .delete {
                    border-color: red;
                    border-radius: 10%;
                    text-color: white;
                }

                .delete:hover {
                    background-color: #65a30d;
                }
            `}</style>
        </div>
    );
};

export default Stock;
