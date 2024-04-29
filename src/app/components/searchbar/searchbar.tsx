import React, { useState, ChangeEvent, KeyboardEvent } from 'react';

interface Product {
    id: number;
    name: string;
    quantity: number;
    price: number;
    codebar: number;
    discount: string;
    originalQuantity: number;
    originalPrice: number;
    originalDiscount: string;
    changed?: boolean;
}

interface SearchBarProps {
    stockData: Product[];
    filteredStockData: Product[]; // Agrega el estado de datos filtrados
    onFilterChange: (filteredData: Product[]) => void;
}

const SearchBar = ({ stockData, filteredStockData, onFilterChange }: SearchBarProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);
        const filteredStock = stockData.filter(product =>
            product.name.toLowerCase().includes(value)
        );
        onFilterChange(filteredStock);
    };

    const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            const filteredStock = stockData.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            onFilterChange(filteredStock);
        }
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={handleSearch}
                onKeyPress={handleKeyPress}
                className="search-input"
            />
            <style jsx>{`
                .search-bar {
                    margin-bottom: 20px;
                }

                .search-input {
                    padding: 8px;
                    width: 100%;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 16px;
                }
            `}</style>
        </div>
    );
};

export default SearchBar;
