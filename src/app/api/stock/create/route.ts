import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { name, quantity, price, codebar } = req.body;
            console.log(name, quantity, price, codebar)
            const newProduct = await prisma.product.create({
                data: {
                    name,
                    quantity,
                    price,
                    codebar,
                    discount: ''
                },
            });

            return new Response(JSON.stringify(newProduct), {
                status: 201,
            });
        } catch (error) {
            console.error('Error creating product', error);
            return new Response(JSON.stringify({ error: 'Internal server error' }), {
                status: 500,
            });
        }
    } else {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
            status: 405,
        });
    }
}
