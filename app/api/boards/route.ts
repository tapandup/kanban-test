import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const boardSchema = z.object({
  name: z.string(),
  projectId: z.number(),
});

export async function GET() {
  const boards = await prisma.board.findMany();
  return NextResponse.json(boards);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = boardSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { name, projectId } = parsed.data;
  const board = await prisma.board.create({
    data: { name, projectId },
  });

  return NextResponse.json(board);
}
