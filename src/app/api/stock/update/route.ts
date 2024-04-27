import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function PUT(req: Request) {
    if (req.method === 'PUT') {
        try {
            const updatedProducts = await req.json();

            for (const updatedProduct of updatedProducts) {
                const existingProduct = await prisma.product.findUnique({
                    where: { id: updatedProduct.id }
                });

                if (!existingProduct) {
                    return new Response(JSON.stringify({ msg: "Producto no encontrado" }), {
                        status: 404
                    });
                }

                // Eliminar el campo `id` del objeto `updatedProduct`
                const { id, originalQuantity, originalPrice, originalDiscount, ...updateData } = updatedProduct;

                await prisma.product.update({
                    where: { id: updatedProduct.id },
                    data: updateData
                });
            }

            return new Response(JSON.stringify({ msg: "Productos actualizados correctamente" }), { status: 200 });
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            return new Response(JSON.stringify({ msg: "Error al actualizar producto" }), {
                status: 500
            });
        }
    }
}