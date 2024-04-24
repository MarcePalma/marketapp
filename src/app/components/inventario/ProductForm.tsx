import React, { FormEvent, useState } from "react";

interface Product {
    name: string;
    quantity: number;
    price: number;
    scanner: string;
}

interface ProductFormProps {
    // Eliminamos onAddProduct
    scanner: string | null;
}

const ProductForm: React.FC<ProductFormProps> = ({ scanner }) => {
    const [name, setName] = useState<string>('');
    const [quantity, setQuantity] = useState<string>('');
    const [price, setPrice] = useState<string>('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/stock/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    quantity,
                    price,
                    codebar: scanner || '',
                }),

            });
            if (response.ok) {
                console.log('Producto agregado correctamente.');
                setName('');
                setQuantity('');
                setPrice('');
            } else {
                console.error('Error al agregar el producto:', response.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud fetch:', error);
        }
    };

    return (
        <div className="max-w-lg mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Agregar Producto</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <label htmlFor="name">Nombre del Producto</label>
                <input
                    type="text"
                    name="name"
                    placeholder="Ingrese el nombre del producto"
                    value={name}
                    className="border border-gray-300 rounded-md p-2"
                />
                <label htmlFor="quantity">Cantidad</label>
                <input
                    type="number"
                    id="quantity"
                    placeholder="Ingrese la cantidad"
                    value={quantity}
                    className="border border-gray-300 rounded-md p-2"
                />
                <label htmlFor="price">Precio</label>
                <input
                    type="number"
                    id="price"
                    placeholder="Ingrese el precio"
                    value={price}
                    className="border border-gray-300 rounded-md p-2"
                />
                <label htmlFor="scanner">Código Escaneado</label>
                <input
                    type="text"
                    id="scanner"
                    placeholder="Código escaneado"
                    value={scanner || ''}
                    readOnly
                    className="border border-gray-300 rounded-md p-2"
                />
                <button type="submit" className="bg-blue-500 text-white py-2 rounded-md">
                    Agregar Producto
                </button>
            </form>
        </div>
    );
};

export default ProductForm;
