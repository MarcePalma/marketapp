import React, { useState } from 'react';
import BarcodeScanner from '../barcodescanner/barcodescanner';
import ProductForm from './ProductForm';
import Image from 'next/image';

const Inventory: React.FC = () => {
  const [scannedCode, setScannedCode] = useState<string | null>(null);

  const handleScan = (code: string) => {
    setScannedCode(code);
  };

  return (
    <div className='p-40 flex flex-col items-center justify-center'>
      <h1 className="text-5xl font-bold mb-4 outfit text-transparent bg-gradient-to-r from-red-400 via-red-600 to-red-800 bg-clip-text text-center">Inventario</h1>
      <div className="flex gap-4 justify-center">
        <div className="col-span-1 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-center">Escáner de Códigos de Barras</h2>
          <BarcodeScanner onScan={handleScan} />
          {scannedCode && (
            <p>Código de barras escaneado: {scannedCode}</p>
          )}
        </div>

        <div>
          <h2 className="text-3xl font-bold mb-2 px-4 text-red-500 text-center">Agregar Producto</h2>
          <ProductForm scanner={scannedCode} />
        </div>
      </div>
    </div>
  );
};

export default Inventory;
