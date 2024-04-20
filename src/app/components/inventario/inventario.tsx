"use client"
import React, { useState } from 'react';
import BarcodeScanner from '../barcodescanner/barcodescanner';
import ProductForm from './ProductForm';

const Inventory: React.FC = () => {
  const [scannedCode, setScannedCode] = useState<string | null>(null);

  const handleScan = (code: string) => {
    setScannedCode(code);
  };

  const handleAddProduct = (product: { name: string; quantity: number; price: number }) => {
    console.log('Producto agregado:', product);
    setScannedCode(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Inventario</h1>
      <div className="flex gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Escanear Código de Barras</h2>
          <BarcodeScanner onScan={handleScan} />
          {scannedCode && (
            <p>Código de barras escaneado: {scannedCode}</p>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Agregar Producto</h2>
          <ProductForm onAddProduct={handleAddProduct} />
        </div>
      </div>
    </div>
  );
};

export default Inventory;