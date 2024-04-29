"use client"
import React, { useState, useEffect } from 'react';
import { PrismaClient } from '@prisma/client';
import SearchBar from '../searchbar/searchbar';

interface Product {
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
        <div className='p-40'>
           <SearchBar stockData={stockData} filteredStockData={filteredStockData} onFilterChange={handleFilterChange} />
            <h1 className='text-2xl font-bold mb-4'>Stock</h1>
            <table className='w-full'>
                <thead>
                    <tr className='bg-gray-200'>
                        <th className='p-2 text-left w-1/6'>ID</th>
                        <th className='p-2 text-left w-1/6'>Nombre</th>
                        <th className='p-2 text-left w-1/6'>Cantidad</th>
                        <th className='p-2 text-left w-1/6'>Precio</th>
                        <th className='p-2 text-left w-1/6'>Descuento (%)</th>
                        <th className='p-2 text-left w-1/6'>Código de Barras</th>
                        <th className='p-2 text-left w-1/6'>Eliminar (X)</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredStockData.map((product, index) => (
                        <tr key={product.id} className='border-b border-gray-200'>
                            <td className='py-2'>{product.id}</td>
                            <td className='py-2'>{product.name}</td>
                            <td className='py-2'>
                                <input
                                    type='number'
                                    value={product.quantity}
                                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                                />
                            </td>
                            <td className='py-2'>
                                ${' '}
                                <input
                                    type='number'
                                    value={product.price}
                                    onChange={(e) => handlePriceChange(index, e.target.value)}
                                />
                            </td>
                            <td className='py-2'>
                                <input
                                    type='number'
                                    className='w-full p-1 border border-gray-300 rounded'
                                    value={product.discount}
                                    onChange={(e) => handleDiscountChange(index, e)}
                                />
                            </td>
                            <td className='py-2'>{product.codebar}</td>
                            <td>
                                <button className='delete'
                                    onClick={() => handleDeleteProduct(product.id)}>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {changesMade && (
                <button
                    className='mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'
                    onClick={handleSaveChanges}
                >
                    Guardar Cambios
                </button>
            )}
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
                    border-radius:10%;
                    text-color:white;
                }
                .delete:hover{
                    background-color:#65a30d;
                }
            `}</style>
        </div>
    );
};

export default Stock;
