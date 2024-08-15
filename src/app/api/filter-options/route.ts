import connectMongo from '@/utils/dbConnect';
import { z } from 'zod';
import { NextRequest } from 'next/server';
import FilterOption from '@/models/FilterOption';

const FilterOptionZod = z.object({
  type: z.string(),
  parent: z.string().optional(),
  label: z.string(),
  value: z.string(),
});

export async function GET(request: NextRequest) {
  await connectMongo();
  const type = request.nextUrl.searchParams.get('type');
  const parent = request.nextUrl.searchParams.get('parent');
  if (!type) {
    return Response.json(
      { status: 'error', msg: 'type is required' },
      { status: 400 }
    );
  }
  const findOptions: any = { type };
  if (parent) {
    findOptions.parent = parent;
  }
  const data = await FilterOption.find(findOptions).lean();

  return Response.json({ status: 'success', data: data }, { status: 200 });
}

export async function POST(request: NextRequest) {
  await connectMongo();
  const reqBody = await request.json();
  FilterOptionZod.parse(reqBody);
  console.log("reqBody", reqBody);
  await FilterOption.create(reqBody);
  return Response.json({ status: 'success' }, { status: 200 });
}
