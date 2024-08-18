import { NextRequest } from 'next/server';
import connectMongo from '@/utils/dbConnect';
import Link from '@/models/Link';

export async function GET(request: NextRequest) {
  await connectMongo();
  // TODO: Implement single item get
  return Response.json({ status: 'success' }, { status: 200 });
}

export async function PUT(request: NextRequest) {
  // TODO: update
  return Response.json({ status: 'success' }, { status: 200 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectMongo();
  const id = params.id;
  const document = await Link.findById(id);
  if (!document) {
    return Response.json({ status: 'error' }, { status: 404 });
  }
  await document.deleteOne();
  return Response.json({ status: 'success' }, { status: 200 });
}
