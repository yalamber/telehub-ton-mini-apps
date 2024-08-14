import connectMongo from '@/utils/dbConnect';
import { NextRequest } from 'next/server';
import FilterOption from '@/models/FilterOption';

export async function GET(request: NextRequest) {
  await connectMongo();
  // TODO: implement single item get
  return Response.json({ status: 'success' }, { status: 200 });
}

export async function PUT(request: NextRequest) {
  await connectMongo();

  // TODO: implement single item update
  return Response.json({ status: 'success' }, { status: 200 });
}

export async function DELETE(request: NextRequest) {
  await connectMongo();

  // TODO: implement single item delete
  return Response.json({ status: 'success' }, { status: 200 });
}
