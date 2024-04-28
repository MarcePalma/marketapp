"use client"

import React, { useState, useEffect } from 'react';
import { PrismaClient } from '@prisma/client';

interface Product {
    id: number;
    name: string;
    quantity: number;
    price: number;
    codebar: number; // Agregado el campo de código de barras
    discount: string;
    originalQuantity: number;
    originalPrice: number;
    originalDiscount: string;
    changed?: boolean;
}

const Stock: React.FC = () => {
    const [stockData, setStockData] = useState<Product[]>([]);
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
                // Almacenar los datos originales de los productos
                const stockDataWithOriginalValues = data.map(product => ({
                    ...product,
                    originalQuantity: product.quantity,
                    originalPrice: product.price,
                    originalDiscount: product.discount,
                }));
                setStockData(stockDataWithOriginalValues);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    const handleQuantityChange = (index: number, newQuantity: string) => {
        setChangesMade(true);
        setStockData(prevStockData => {
            const newStockData = [...prevStockData];
            newStockData[index] = {
                ...newStockData[index],
                quantity: parseInt(newQuantity),
                changed: true, // Set changed to true when quantity changes
            };
            return newStockData;
        });
    };
    
    const handlePriceChange = (index: number, newPrice: string) => {
        setChangesMade(true);
        setStockData(prevStockData => {
            const newStockData = [...prevStockData];
            newStockData[index] = {
                ...newStockData[index],
                price: parseFloat(newPrice),
                changed: true, // Set changed to true when price changes
            };
            return newStockData;
        });
    };
    
    const handleDiscountChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        setChangesMade(true);
        const newDiscount = event.target.value;
        setStockData(prevStockData => {
            const newStockData = [...prevStockData];
            newStockData[index] = {
                ...newStockData[index],
                discount: newDiscount,
                changed: true, // Set changed to true when discount changes
            };
            return newStockData;
        });
    };

    const handleSaveChanges = async () => {
        try {
            console.log('Guardando cambios...');

            // Crear un array para almacenar los productos actualizados
            const updatedProducts: Product[] = [];

            // Recorrer el array de stockData para encontrar los productos actualizados
            stockData.forEach(product => {
                if (product.changed) {
                    const updatedProduct: Product = {
                        id: product.id, // Asegúrate de incluir el id del producto
                        name: product.name,
                        quantity: product.quantity,
                        price: product.price,
                        discount: product.discount,
                        codebar: product.codebar, // Agregado el código de barras
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
                body: JSON.stringify(updatedProducts), // Enviar solo la información de los productos actualizados
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
            <h1 className='text-2xl font-bold mb-4'>Stock</h1>
            <table className='w-full'>
                <thead>
                    <tr className='bg-gray-200'>
                        <th className='py-2 text-left w-1/6'>ID</th>
                        <th className='py-2 text-left w-1/6'>Nombre</th>
                        <th className='py-2 text-left w-1/6'>Cantidad</th>
                        <th className='py-2 text-left w-1/6'>Precio</th>
                        <th className='py-2 text-left w-1/6'>Descuento (%)</th>
                        <th className='py-2 text-left w-1/6'>Código de Barras</th> {/* Columna para código de barras */}
                    </tr>
                </thead>
                <tbody>
                    {stockData.map((product, index) => (
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
                                    type='text'
                                    className='w-full p-1 border border-gray-300 rounded'
                                    value={product.discount}
                                    onChange={(e) => handleDiscountChange(index, e)}
                                />
                            </td>
                            <td className='py-2'>{product.codebar}</td> {/* Mostrar el código de barras */}
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
      `}</style>
        </div>
    );
};

export default Stock;
