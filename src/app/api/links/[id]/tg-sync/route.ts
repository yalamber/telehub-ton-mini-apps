import { NextRequest } from 'next/server';

import connectMongo from '@/utils/dbConnect';
import { TelegramService } from '@/utils/telegram';
import Link from '@/models/Link';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await connectMongo();
    const linkData = await Link.findById(id);
    if (!linkData) {
      return Response.json({ status: 'not found' }, { status: 404 });
    }
    // TODO: check updateAt and only update if last updated time is one day old
    // TODO: add force update param based on query param
    const forceSync = request.nextUrl.searchParams.get('force-sync') === 'yes';
    if (!linkData.wasUpdatedAtLeastOneDayAgo() && !forceSync) {
      return Response.json({ status: 'Already Synced' }, { status: 401 });
    }
    const tgService = new TelegramService(
      parseInt(process.env.TG_API_ID),
      process.env.TG_API_HASH,
      process.env.TG_SESSION
    );
    await tgService.connect();
    const tgLinkData = await tgService.getLinkDetails(linkData.link);
    linkData.title = tgLinkData.title;
    linkData.about = tgLinkData.about;
    linkData.type = tgLinkData.type;
    linkData.memberCount = tgLinkData?.memberCount;
    if (
      tgLinkData.entityForPhoto &&
      tgLinkData.photoId &&
      tgLinkData.photoId != linkData.photoId
    ) {
      const photoUrl = await tgService.downloadAndSavePhoto(
        tgLinkData.entityForPhoto,
        tgLinkData.photoId
      );
      linkData.photo = photoUrl;
      linkData.photoId = tgLinkData.photoId;
    }
    await linkData.save();
    return Response.json({ status: 'Synced' }, { status: 200 });
  } catch (err: any) {
    console.log(err);
    return Response.json(
      { status: 'error', msg: err.message },
      { status: 500 }
    );
  }
}
