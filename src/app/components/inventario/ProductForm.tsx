"use client"

import { FormEvent, useState } from "react";

interface Product {
    name: string;
    quantity: number;
    price: number;
}

interface ProductFormProps {
    onAddProduct: (product: Product) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onAddProduct }) => {
    const [name, setName] = useState<string>('');
    const [quantity, setQuantity] = useState<string>('');
    const [price, setPrice] = useState<string>('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name || !quantity || !price) {
            alert('Por favor completa todos los campos');
            return;
        }
        const quantityNumber: number = parseInt(quantity);
        const priceNumber: number = parseFloat(price);
        if (isNaN(quantityNumber) || isNaN(priceNumber)) {
            alert('Cantidad y precio deben ser números válidos');
            return;
        }
        onAddProduct({ name, quantity: quantityNumber, price: priceNumber });
        setName('');
        setQuantity('');
        setPrice('');
    };

    return (
        <div className="max-w-lg mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Agregar Producto</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Nombre del producto"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border border-gray-300 rounded-md p-2"
                />
                <input
                    type="number"
                    placeholder="Cantidad"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="border border-gray-300 rounded-md p-2"
                />
                <input
                    type="number"
                    placeholder="Precio"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
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