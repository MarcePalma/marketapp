'use client'
import React, { useState, useEffect } from 'react';

interface Product {
    id: number;
    name: string;
    quantity: number;
    price: number;
    discount: string;
}

const Stock: React.FC = () => {
    const [stockData, setStockData] = useState<Product[]>([]);
    const [changesMade, setChangesMade] = useState(false);

    useEffect(() => {
        fetch('/api/stock')
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Error al obtener el stock');
            })
            .then((data: Product[]) => {
                setStockData(data);
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
            };
            return newStockData;
        });
    };

    const handleSaveChanges = () => {
        console.log('Guardando cambios...');
        setChangesMade(false);
    };

    return (
        <div className='p-40'>
            <h1 className='text-2xl font-bold mb-4'>Stock</h1>
            <table className='w-full'>
                <thead>
                    <tr className='bg-gray-200'>
                        <th className='py-2 text-left w-1/5'>ID</th>
                        <th className='py-2 text-left w-1/5'>Nombre</th>
                        <th className='py-2 text-left w-1/5'>Cantidad</th>
                        <th className='py-2 text-left w-1/5'>Precio</th>
                        <th className='py-2 text-left w-1/5'>Descuento (%)</th>
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
