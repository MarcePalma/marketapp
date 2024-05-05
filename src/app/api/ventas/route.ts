import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    try {
        const queryParams = new URLSearchParams(req.url?.split("?")[1] || "");
        const fecha = queryParams.get("fecha");

        if (!fecha) {
            throw new Error('Parámetro de fecha no proporcionado');
        }

        const date = new Date(fecha);

        const sales = await prisma.sale.findMany({
            where: {
                saleDate: {
                    gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
                    lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
                },
            },
        });

        return new Response(JSON.stringify({ sales }), {
            status: 200
        });
    } catch (error: any) {
        console.error("Error al obtener ventas:", error);
        return new Response("Error al obtener ventas: " + (error instanceof Error ? error.message : "Unknown error"), {
            status: 500
        });
    }
}
