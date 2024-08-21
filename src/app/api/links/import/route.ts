import { getServerSession } from 'next-auth';
import connectMongo from '@/utils/dbConnect';
import { TelegramService } from '@/utils/telegram';
import authOptions from '@/app/api/auth/[...nextauth]/authOptions';
import Link from '@/models/Link';

export async function POST(request: Request) {
  await connectMongo();
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ status: 'error' }, { status: 401 });
  }
  try {
    const reqBody = await request.json();
    const tgService = new TelegramService(
      parseInt(process.env.TG_API_ID),
      process.env.TG_API_HASH,
      process.env.TG_SESSION
    );
    // TODO: check if link already exists
    const link = await Link.findOne({
      link: TelegramService.extractUsername(reqBody.link),
    });
    if (link) {
      throw new Error('Link already submitted');
    }
    await tgService.connect();
    // Add link to database by querying telegram link data chatId
    const tgLinkData = await tgService.getLinkDetails(reqBody.link);
    const linkData = {
      link: TelegramService.extractUsername(reqBody.link.trim()),
      title: tgLinkData.title,
      about: tgLinkData.about,
      type: tgLinkData.type,
      category: reqBody.category.trim(),
      country: reqBody.country.trim(),
      city: reqBody.city.trim() ?? '',
      language: reqBody.language.trim(),
      memberCount: tgLinkData?.memberCount,
      submittedBy: 'admin',
      submittedById: '1253120502',
      status: 'APPROVED',
      photo: '',
    };
    if (tgLinkData.entityForPhoto && tgLinkData.photoId) {
      linkData.photo =
        (await tgService.downloadAndSavePhoto(
          tgLinkData.entityForPhoto,
          tgLinkData.photoId
        )) ?? '';
    }
    await Link.create(linkData);
    return Response.json({ status: 'ok', channelData: tgLinkData });
  } catch (err: any) {
    console.log('ERR', err);
    return Response.json(
      { status: 'error', msg: err.message },
      { status: 500 }
    );
  }
}
