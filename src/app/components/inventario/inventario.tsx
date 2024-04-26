import React, { useState } from 'react';
import BarcodeScanner from '../barcodescanner/barcodescanner';
import ProductForm from './ProductForm';

const Inventory: React.FC = () => {
  const [scannedCode, setScannedCode] = useState<string | null>(null);

  const handleScan = (code: string) => {
    setScannedCode(code);
  };

  return (
    <div className='p-40 flex flex-col items-center justify-center'>
      <h1 className="text-2xl font-bold mb-4 outfit">Inventario</h1>
      <div className="flex gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Escanear Código de Barras</h2>
          <BarcodeScanner onScan={handleScan} />
          {scannedCode && (
            <p>Código de barras escaneado: {scannedCode}</p>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2 px-4 py-2 bg-gray-200 rounded-md shadow-md">Agregar Producto</h2>
          <ProductForm scanner={scannedCode} />
        </div>
      </div>
      <style>
        {`
          .outfit {
            font-family: "Outfit", sans-serif;
            font-size: 3rem;
            font-weight: bold; 
            text-align: center;
            color: transparent;
            background:#000;
            -webkit-background-clip: text;
            background-clip: text;
          }
        `}
      </style>
    </div>
  );
};

export default Inventory;
