import { NextResponse } from 'next/server';
import { z } from 'zod';

const requestSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { title, description } = parsed.data;

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
  }

  // Call OpenAI API here (mocked response for now)
  const response = {
    summary: `Summary of ${title}`,
    estimatePoints: Math.floor(Math.random() * 5) + 1,
  };

  return NextResponse.json(response);
}
