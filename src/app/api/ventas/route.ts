import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { fecha } = req.query;

        if (typeof fecha === "string") {
            const date = new Date(fecha);

            const sales = await prisma.sale.findMany({
                where: {
                    saleDate: {
                        gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
                        lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
                    },
                },
            });

            return res.status(200).json(sales);
        } else {
            return res.status(400).json({ error: "Fecha no válida" });
        }
    } catch (error) {
        console.error("Error al obtener ventas:", error);
        return res.status(500).send("Error al obtener ventas");
    }
}
