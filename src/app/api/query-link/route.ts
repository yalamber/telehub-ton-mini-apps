import connectMongo from '@/utils/dbConnect';

export async function POST(request: Request) {
  await connectMongo();
  
  return Response.json(
    { status: 'error', msg: 'Unauthorized' },
    { status: 400 }
  );
}
