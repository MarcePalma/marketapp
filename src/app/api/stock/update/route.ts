import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface UpdateProductRequest {
    id: number;
    name?: string;
    quantity?: number;
    price?: number;
    discount?: string;
}

export async function PUT(req: Request) {
    if (req.method === 'PUT') {
        try {
            const requestBody = await req.text();

            const requestData = JSON.parse(requestBody) as UpdateProductRequest;

            const { id, ...updatedProduct } = requestData;

            const existingProduct = await prisma.product.findUnique({
                where: { id: Number(id) }
            });

            if (!existingProduct) {
                return new Response(JSON.stringify({ msg: "Producto no encontrado" }), {
                    status: 404
                });
            }

            const updatedProductData = await prisma.product.update({
                where: { id: Number(id) },
                data: updatedProduct
            });

            return new Response(JSON.stringify({ updatedProduct: updatedProductData }), { status: 200 });
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            return new Response(JSON.stringify({ msg: "Error al actualizar producto" }), {
                status: 500
            });
        }
    }
}
