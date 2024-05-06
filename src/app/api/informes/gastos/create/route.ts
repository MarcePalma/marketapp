import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request,) {
    if (req.method === 'POST') {

        const gastos = await req.json()

        if (Object.values(gastos).includes(undefined)) {
            return new Response(JSON.stringify({ msg: "Error! Faltan datos" }), {
                status: 400
            })
        }
        const productUpload = await prisma.gasto.create({ data: gastos, })
        if (!productUpload)
            return new Response(
                JSON.stringify({ msg: "No se pudo subir el producto!" }),
            );

        return new Response(JSON.stringify({ productUpload }), { status: 201 })

    }
}
