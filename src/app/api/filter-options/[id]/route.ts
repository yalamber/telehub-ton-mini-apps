import connectMongo from '@/utils/dbConnect';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';
import FilterOption from '@/models/FilterOption';
import authOptions from '@/app/api/auth/[...nextauth]/authOptions';

export async function GET(request: NextRequest) {
  await connectMongo();
  // TODO: implement single item get
  return Response.json({ status: 'success' }, { status: 200 });
}

export async function PUT(request: NextRequest) {
  // TODO: update
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ status: 'error' }, { status: 401 });
  }
  return Response.json({ status: 'success' }, { status: 200 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectMongo();
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ status: 'error' }, { status: 401 });
  }
  const id = params.id;
  const document = await FilterOption.findById(id);
  if (!document) {
    return Response.json({ status: 'error' }, { status: 404 });
  }
  await document.deleteOne();
  return Response.json({ status: 'success' }, { status: 200 });
}
