import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const projectSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export async function GET() {
  const projects = await prisma.project.findMany();
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = projectSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { name, description } = parsed.data;
  const project = await prisma.project.create({
    data: { name, description, ownerId: 1 }, // Assuming ownerId is 1 for demo
  });

  return NextResponse.json(project);
}
