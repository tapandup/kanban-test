import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const taskSchema = z.object({
  title: z.string(),
  description: z.string(),
  columnId: z.number(),
  status: z.string(),
  priority: z.string(),
  estimatePoints: z.number().optional(),
  assigneeId: z.number().optional(),
  dueDate: z.date().optional(),
  tags: z.array(z.string()).optional(),
});

export async function GET() {
  const tasks = await prisma.task.findMany();
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = taskSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { title, description, columnId, status, priority, estimatePoints, assigneeId, dueDate, tags } = parsed.data;
  const task = await prisma.task.create({
    data: { title, description, columnId, status, priority, estimatePoints, assigneeId, dueDate, tags },
  });

  return NextResponse.json(task);
}
