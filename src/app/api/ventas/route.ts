import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    try {
        const sales = await prisma.sale.findMany();
        return new Response(JSON.stringify({ sales }), {
            status: 200
        });

    } catch (error) {
        console.error("Error al obtener ventas:", error);
        return new Response("Error al obtener ventas: " + (error instanceof Error ? error.message : "Unknown error"), {
            status: 500
        });
    }
}