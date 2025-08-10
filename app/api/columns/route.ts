import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const columnSchema = z.object({
  name: z.string(),
  boardId: z.number(),
});

export async function GET() {
  const columns = await prisma.column.findMany();
  return NextResponse.json(columns);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = columnSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { name, boardId } = parsed.data;
  const column = await prisma.column.create({
    data: { name, boardId },
  });

  return NextResponse.json(column);
}
