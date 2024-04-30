import React, { FormEvent, useRef, useState } from "react";

interface ProductFormProps {
    scanner: string | null;
}

const ProductForm: React.FC<ProductFormProps> = ({ scanner }) => {
    const nameRef = useRef<HTMLInputElement>(null);
    const quantityRef = useRef<HTMLInputElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);
    const codebarRef = useRef<HTMLInputElement>(null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const name = nameRef.current?.value || '';
        const quantity = parseInt(quantityRef.current?.value || '0');
        const price = parseFloat(priceRef.current?.value || '0');
        const codebar = codebarRef.current?.value || '';

        const dataToSend = {
            name,
            quantity,
            price,
            codebar,
            discount: ""
        };

        setSaving(true);

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
                setSaved(true);
                nameRef.current!.value = '';
                quantityRef.current!.value = '';
                priceRef.current!.value = '';
                codebarRef.current!.value = '';
                setTimeout(() => {
                    setSaving(false);
                    setSaved(false);
                }, 2000); // Resetear el estado después de 2 segundos
            } else {
                console.error('Error al agregar el producto:', response.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud fetch:', error);
        }
    };

    return (
        <div className="max-w-lg mx-auto">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
                <label htmlFor="name" className="block text-lg text-gray-700 mb-2">Nombre del Producto</label>
                <input
                    type="text"
                    id="name"
                    ref={nameRef}
                    placeholder="Ingrese el nombre del producto"
                    className="border border-gray-300 rounded-md p-2 w-full mb-4"
                />
                <label htmlFor="quantity" className="block text-lg text-gray-700 mb-2">Cantidad</label>
                <input
                    type="number"
                    id="quantity"
                    ref={quantityRef}
                    placeholder="Ingrese la cantidad"
                    className="border border-gray-300 rounded-md p-2 w-full mb-4"
                />
                <label htmlFor="price" className="block text-lg text-gray-700 mb-2">Precio</label>
                <input
                    type="number"
                    id="price"
                    ref={priceRef}
                    placeholder="Ingrese el precio"
                    className="border border-gray-300 rounded-md p-2 w-full mb-4"
                />
                <label htmlFor="scanner" className="block text-lg text-gray-700 mb-2">Código Escaneado</label>
                <input
                    type="text"
                    id="scanner"
                    readOnly
                    defaultValue={scanner || ''}
                    ref={codebarRef}
                    className="border border-gray-300 rounded-md p-2 w-full mb-4"
                />
                <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm text-red-500 shadow-sm focus:relative hover:bg-red-500 hover:text-white transition duration-300"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                        <path d="M9 12h6" />
                        <path d="M12 9v6" />
                    </svg>
                    Agregar Producto
                </button>
            </form>
            <div className={`bg-white shadow-md rounded-lg p-4 mt-4 ${saving || saved ? 'block' : 'hidden'}`}>
                {saving && <div className="text-green-700">Guardando Cambios...</div>}
                {saved && <div className="text-green-700">Producto Agregado</div>}
            </div>
        </div>
    );
};

export default ProductForm;