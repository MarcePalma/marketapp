import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    try {
        const currentDate = new Date();
        const firstDayOfWeek = new Date(currentDate);
        firstDayOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        const lastDayOfWeek = new Date(currentDate);
        lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

        const sales = await prisma.sale.findMany({
            where: {
                saleDate: {
                    gte: firstDayOfWeek,
                    lte: lastDayOfWeek,
                },
            },
        });

            return new Response(JSON.stringify({ sales }), {
            status: 200,
        });
    } catch (error) {
        console.error("Error al obtener ventas semanales:", error);
        return new Response("Error al obtener ventas semanales", {
            status: 500,
        });
    }
}