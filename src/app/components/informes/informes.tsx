"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../navbar/Navbar";
import SidebarMenu from "./menu";
import IngresosDiarios from "../ingresos/ingresosdiarios";
import IngresosSemanales from "../ingresos/ingresossemanales";
import IngresosMensuales from "../ingresos/ingresosmensuales";

const Informes: React.FC = () => {
    const [selectedComponent, setSelectedComponent] = useState('IngresosDiarios');

    const handleMenuItemClick = (componentName: string) => {
        setSelectedComponent(componentName);
    };

    return (
        <div>
            <Navbar />
            <div className="flex mx-auto w-full px-4 py-40 justify-center">
                <SidebarMenu onMenuItemClick={handleMenuItemClick} />
                <motion.div
                    className="col-span-2 bg-white p-4 rounded-lg shadow-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-lg font-semibold mb-4">Informes de Ventas</h2>
                    <motion.div
                        key={selectedComponent}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {selectedComponent === 'IngresosDiarios' && <div>
                            <IngresosDiarios/>
                        </div> }
                        {selectedComponent === 'IngresosSemanales' && <IngresosSemanales />}
                        {selectedComponent === 'IngresosMensuales' && <div>
                            <IngresosMensuales />
                        </div>}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Informes;