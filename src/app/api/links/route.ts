import { Types } from 'mongoose';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import {
  validate,
  parse,
  type InitDataParsed,
} from '@telegram-apps/init-data-node';
import { z } from 'zod';
import TelegramBot from 'node-telegram-bot-api';
import connectMongo from '@/utils/dbConnect';
import authOptions from '@/app/api/auth/[...nextauth]/authOptions';
import Link from '@/models/Link';
import { TelegramService } from '@/utils/telegram';

const LinkZod = z.object({
  link: z
    .string()
    .refine(
      (value) =>
        /^(https?:\/\/)?(t\.me|telegram\.me)\/[a-zA-Z0-9_]{5,32}$/.test(
          value
        ) ||
        /^[a-zA-Z0-9_]{5,32}$/.test(value) ||
        /^@[a-zA-Z0-9_]{5,32}$/.test(value),
      {
        message:
          'Invalid Telegram link or username. It should be a valid URL or a username with 5-32 characters.',
      }
    ),
  country: z.string(),
  city: z.string().optional(),
  language: z.string(),
  category: z.string(),
});

export async function POST(request: Request) {
  await connectMongo();
  const headersList = headers();
  const [authType, authData = ''] = (
    headersList.get('authorization') || ''
  ).split(' ');
  switch (authType) {
    case 'tma':
      try {
        // validate init data.
        validate(authData, process.env.TG_BOT_TOKEN, {
          // We consider init data sign valid for 1 day from their creation moment.
          expiresIn: 3600 * 24,
        });
        const initData: InitDataParsed = parse(authData);
        const reqBody = await request.json();
        LinkZod.parse(reqBody);
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
          link: TelegramService.extractUsername(reqBody.link),
          title: tgLinkData.title,
          about: tgLinkData.about,
          type: tgLinkData.type,
          category: reqBody.category,
          country: reqBody.country,
          city: reqBody.city ?? '',
          language: reqBody.language,
          memberCount: tgLinkData?.memberCount,
          submittedBy: initData?.user?.username,
          submittedById: initData?.user?.id,
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
        console.log('sending message to ', initData?.user?.username);
        const bot = new TelegramBot(process.env.TG_BOT_TOKEN, {
          polling: false,
        });
        // send bot message to submitter
        await bot.sendMessage(
          initData?.user?.id as number,
          `Thank you for submitting your link ${reqBody.link}.` +
            `\ncountry: ${reqBody.country}` +
            `\ncity: ${reqBody.city}` +
            `\nlanguage: ${reqBody.language}` +
            `\ncategory:${reqBody.category}` +
            `\nstatus: pending`
        );
        return Response.json({ status: 'ok', channelData: tgLinkData });
      } catch (err: any) {
        console.log('ERR', err);
        if (err instanceof z.ZodError) {
          return Response.json(
            { status: 'error', issues: err.issues },
            { status: 500 }
          );
        }
        return Response.json(
          { status: 'error', msg: err.message },
          { status: 500 }
        );
      }
    // ... other authorization methods.
    default:
      return Response.json(
        { status: 'error', msg: 'Unauthorized' },
        { status: 400 }
      );
  }
}

export async function GET(request: NextRequest) {
  await connectMongo();

  const searchParams = request.nextUrl.searchParams;
  const cursor = searchParams.get('cursor');
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const title = searchParams.get('title');
  const category = searchParams.get('category');
  const country = searchParams.get('country');
  const city = searchParams.get('city');
  const language = searchParams.get('language');
  const featuredType = searchParams.get('featuredType');

  const query: any = { status: 'APPROVED' };

  if (title) query.title = { $regex: title, $options: 'i' };
  if (category) query.category = category;
  if (country) query.country = country;
  if (city) query.city = city;
  if (language) query.language = language;
  if (featuredType) query.featuredType = featuredType;

  if (cursor) {
    query._id = { $lt: cursor };
  }

  try {
    const links = await Link.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean() as LinkDocument[];

    const hasNextPage = links.length > limit;
    const data = links.slice(0, limit);

    return NextResponse.json({
      status: 'success',
      data,
      pagination: {
        nextCursor: hasNextPage ? data[data.length - 1]._id.toString() : null,
      },
    });
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch links' },
      { status: 500 }
    );
  }
}

interface LinkDocument {
  _id: Types.ObjectId;
  // Add other fields as needed
}
