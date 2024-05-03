import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request,) {
    if (req.method === 'POST') {

        const sale = await req.json()

        if (Object.values(sale).includes(undefined)) {
            return new Response(JSON.stringify({ msg: "Error! Faltan datos" }), {
                status: 400
            })
        }
        const saleUpload = await prisma.sale.create({ data: sale, })
        if (!saleUpload)
            return new Response(
                JSON.stringify({ msg: "No se pudo subir el producto!" }),
            );

        return new Response(JSON.stringify({ saleUpload }), { status: 201 })

    }
}
