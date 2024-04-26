import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request,) {
    if (req.method === 'POST') {

        const product = await req.json()

        if (Object.values(product).includes(undefined)) {
            return new Response(JSON.stringify({ msg: "Error! Faltan datos" }), {
                status: 400
            })
        }
        const productUpload = await prisma.product.create({ data: product, })
        if (!productUpload)
            return new Response(
                JSON.stringify({ msg: "No se pudo subir el producto!" }),
            );

        return new Response(JSON.stringify({ productUpload }), { status: 201 })

    }
}
