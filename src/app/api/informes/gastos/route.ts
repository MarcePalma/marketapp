import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const gastos = await prisma.gasto.findMany();

        return new Response(JSON.stringify(gastos), {
            status: 200,
        });
    } catch (error) {
        console.error("Error al obtener productos:", error);

        return new Response("Error al obtener productos", {
            status: 500,
        });
    }
}
