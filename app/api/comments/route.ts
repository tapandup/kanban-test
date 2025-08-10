import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const commentSchema = z.object({
  taskId: z.number(),
  authorId: z.number(),
  content: z.string(),
});

export async function GET() {
  const comments = await prisma.comment.findMany();
  return NextResponse.json(comments);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = commentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { taskId, authorId, content } = parsed.data;
  const comment = await prisma.comment.create({
    data: { taskId, authorId, content },
  });

  return NextResponse.json(comment);
}
