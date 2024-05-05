import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

export async function DELETE(req: Request, res: NextApiResponse) {
    const prisma = new PrismaClient();
    if (req.method === 'DELETE') {
        try {
            const { id } = await req.json(); // Accediendo al ID del producto desde el cuerpo de la solicitud
            if (!id) {
                throw new Error('ID del producto no proporcionado');
            }
            const productId = parseInt(id as string); // Convirtiendo el ID a tipo numérico

            await prisma.product.delete({
                where: { id: productId } // Usando el ID para eliminar el producto
            });
            return new Response(null, { status: 204 });
        } catch (error) {
            console.error('Error deleting product:', error);
            return new Response(JSON.stringify({ message: 'Error deleting Product' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }
    } else {
        return new Response(JSON.stringify({ message: 'Method Not Allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
    }
}