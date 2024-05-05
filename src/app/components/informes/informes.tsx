import React from "react";
import Navbar from "../navbar/Navbar";
import SidebarMenu from "./menu";
import IngresosDiarios from "../ingresos/ingresosdiarios";

const Informes: React.FC = () => {
    return (
        <div>
            <Navbar />
            <div className="flex mx-auto w-full px-4 py-40 justify-center">
                <SidebarMenu />
                <div className="col-span-2 bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Informes de Ventas</h2>
                    <IngresosDiarios />
                </div>
            </div>
        </div>
    );
};

export default Informes;
