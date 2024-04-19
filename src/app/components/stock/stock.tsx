"use client"
import React, { useState } from 'react';

const Stock = () => {
    const [stockData, setStockData] = useState([
        { id: 1, name: 'Producto 1', quantity: 10, price: 20, discount: '0' },
        { id: 2, name: 'Producto 2', quantity: 15, price: 30, discount: '0' },
    ]);

    const [changesMade, setChangesMade] = useState(false);

    const handleQuantityChange = (index: number, newQuantity: any) => {
        setChangesMade(true);
        setStockData(prevStockData => {
            const newStockData = [...prevStockData];
            newStockData[index] = {
                ...newStockData[index],
                quantity: newQuantity,
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

    const handleEditQuantity = (index: number) => {
        console.log(index);
    };

    const handleSaveChanges = () => {
        // Aquí podrías agregar la lógica para guardar los cambios en la base de datos
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
                            <td className='py-2' onClick={() => handleEditQuantity(index)}>
                                <span>{product.quantity}</span>
                            </td>
                            <td className='py-2'>{product.price}</td>
                            <td className='py-2'>
                                <input
                                    type='text'
                                    className='w-full p-1 border border-gray-300 rounded'
                                    value={product.discount}
                                    onChange={event => handleDiscountChange(index, event)}
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
