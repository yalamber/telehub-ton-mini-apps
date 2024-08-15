import { NextRequest } from 'next/server';

import connectMongo from '@/utils/dbConnect';
import { getChannelDetails } from '@/utils/telegram';
import Link from '@/models/Link';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  await connectMongo();
  const data = await Link.findById(id);
  const channelData = await getChannelDetails(
    data.link,
    // TODO get TG_SESSION in round robin fashion
    process.env.TG_SESSION
  );

  return Response.json({ status: 'success' }, { status: 200 });
}
