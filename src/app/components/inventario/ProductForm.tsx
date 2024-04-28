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
        <div className="max-w-lg mx-auto flex justify-center items-center relative">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 form">
                <label htmlFor="name" className="text-xl">Nombre del Producto</label>
                <input
                    type="text"
                    id="name"
                    ref={nameRef}
                    placeholder="Ingrese el nombre del producto"
                    className="border border-gray-300 rounded-md p-2"
                />
                <label htmlFor="quantity" className="text-xl">Cantidad</label>
                <input
                    type="number"
                    id="quantity"
                    ref={quantityRef}
                    placeholder="Ingrese la cantidad"
                    className="border border-gray-300 rounded-md p-2"
                />
                <label htmlFor="price" className="text-xl">Precio</label>
                <input
                    type="number"
                    id="price"
                    ref={priceRef}
                    placeholder="Ingrese el precio"
                    className="border border-gray-300 rounded-md p-2"
                />
                <label htmlFor="scanner" className="text-xl">Código Escaneado</label>
                <input
                    type="text"
                    id="scanner"
                    readOnly
                    defaultValue={scanner || ''}
                    ref={codebarRef}
                    className="border border-gray-300 rounded-md p-2"
                />
                <button type="submit" className="bg-blue-500 text-xl text-white py-2 rounded-md">
                    Agregar Producto
                </button>
            </form>
            <div className={`popup ${saving || saved ? 'show' : ''}`}>
                {saving && <div className="popup-message">Guardando Cambios...</div>}
                {saved && <div className="popup-message">Producto Agregado</div>}
            </div>
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
           .form button:hover{
            background-color:#65a30d;
           }

           /* Estilos del popup */
           .popup {
                position: absolute;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background-color: rgba(255, 255, 255, 0.9);
                padding: 10px 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
                display: flex;
                justify-content: center;
                align-items: center;
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
           }

           .popup-message {
                color: green;
                font-size: 1.5rem;
                text-align: center;
           }

           .popup.show {
                opacity: 1;
                pointer-events: auto;
           }
           `}
            </style>
        </div>
    );
};

export default ProductForm;
