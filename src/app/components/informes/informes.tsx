"use client"

import React, { useState } from "react";
import Navbar from "../navbar/Navbar";
import SidebarMenu from "./menu";
import IngresosDiarios from "../ingresos/ingresosdiarios";
import IngresosSemanales from "../ingresos/ingresossemanales";

const Informes: React.FC = () => {
    const [selectedComponent, setSelectedComponent] = useState('IngresosDiarios'); // Por defecto muestra IngresosDiarios

    const handleMenuItemClick = (componentName: string) => {
        setSelectedComponent(componentName);
    };

    return (
        <div>
            <Navbar />
            <div className="flex mx-auto w-full px-4 py-40 justify-center">
                <SidebarMenu onMenuItemClick={handleMenuItemClick} />
                <div className="col-span-2 bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Informes de Ventas</h2>
                    {selectedComponent === 'IngresosDiarios' && <IngresosDiarios />}
                    {selectedComponent === 'IngresosSemanales' && <IngresosSemanales />}
                </div>
            </div>
        </div>
    );
};

export default Informes;
