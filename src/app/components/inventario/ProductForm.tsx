import React, { FormEvent, useRef } from "react";

interface ProductFormProps {
    scanner: string | null;
}

const ProductForm: React.FC<ProductFormProps> = ({ scanner }) => {
    const nameRef = useRef<HTMLInputElement>(null);
    const quantityRef = useRef<HTMLInputElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);
    const codebarRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const name = nameRef.current?.value || '';
        const quantity = parseInt(quantityRef.current?.value || '0'); // Convertir a número
        const price = parseFloat(priceRef.current?.value || '0'); // Convertir a número
        const codebar = codebarRef.current?.value || '';

        const dataToSend = {
            name,
            quantity,
            price,
            codebar,
            discount: ""
        };

        try {
            const response = await fetch('/api/stock/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                console.log('Producto agregado correctamente.');
                nameRef.current!.value = '';
                quantityRef.current!.value = '';
                priceRef.current!.value = '';
                codebarRef.current!.value = '';
            } else {
                console.error('Error al agregar el producto:', response.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud fetch:', error);
        }
    };

    return (
        <div className="max-w-lg mx-auto flex justify-center items-center">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 form">
                <label htmlFor="name">Nombre del Producto</label>
                <input
                    type="text"
                    id="name"
                    ref={nameRef}
                    placeholder="Ingrese el nombre del producto"
                    className="border border-gray-300 rounded-md p-2"
                />
                <label htmlFor="quantity">Cantidad</label>
                <input
                    type="number"
                    id="quantity"
                    ref={quantityRef}
                    placeholder="Ingrese la cantidad"
                    className="border border-gray-300 rounded-md p-2"
                />
                <label htmlFor="price">Precio</label>
                <input
                    type="number"
                    id="price"
                    ref={priceRef}
                    placeholder="Ingrese el precio"
                    className="border border-gray-300 rounded-md p-2"
                />
                <label htmlFor="scanner">Código Escaneado</label>
                <input
                    type="text"
                    id="scanner"
                    readOnly
                    defaultValue={scanner || ''}
                    ref={codebarRef}
                    className="border border-gray-300 rounded-md p-2"
                />
                <button type="submit" className="bg-blue-500 text-white py-2 rounded-md">
                    Agregar Producto
                </button>
            </form>
            <style>
           {`
           .form{
            border-color: red;
           }
           .form label {
            color: red;
           }
           .form input {
            border-color: red;
            color: red;
           }
           .form button {
            background-color: red;
            border-color: red;
           }
           `}
            </style>
        </div>
    );
};

export default ProductForm;
