import { headers } from 'next/headers';
import { NextRequest } from 'next/server';
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
import { getChannelDetails, extractUsername } from '@/utils/telegram';

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
        // Validate init data.
        validate(authData, process.env.TG_BOT_TOKEN, {
          // We consider init data sign valid for 1 day from their creation moment.
          expiresIn: 3600 * 24,
        });
        const initData: InitDataParsed = parse(authData);
        const reqBody = await request.json();
        LinkZod.parse(reqBody);
        const bot = new TelegramBot(process.env.TG_BOT_TOKEN, { polling: false });
        // Add link to database by querying telegram link data chatId
        const channelData = await getChannelDetails(
          reqBody.link,
          process.env.TG_SESSION
        );
        await Link.create({
          title: channelData.title,
          // about: channelData.about,
          type: channelData.type,
          link: extractUsername(reqBody.link),
          category: reqBody.category,
          country: reqBody.country,
          city: reqBody.city ?? '',
          language: reqBody.language,
          memberCount: channelData?.memberCount,
          photo: channelData.photo,
          submittedBy: initData?.user?.username,
          submittedById: initData?.user?.id,
        });
        console.log('sending message to ', initData?.user?.username);
        await bot.sendMessage(
          initData?.user?.id as number,
          `Thank you for submitting your link ${reqBody.link}.` +
            `\ncountry: ${reqBody.country}` +
            `\ncity: ${reqBody.city}` +
            `\nlanguage: ${reqBody.language}` +
            `\ncategory:${reqBody.category}` +
            `\nstatus: pending`
        );
        return Response.json({ status: 'ok', channelData });
      } catch (err: any) {
        console.log(err);
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
  const session = await getServerSession(authOptions);
  const { searchParams } = request.nextUrl;
  const query: Record<string, string | { $regex: string; $options: string }> =
    {};

  const title = searchParams.get('title');
  const category = searchParams.get('category');
  const country = searchParams.get('country');
  const city = searchParams.get('city');
  const language = searchParams.get('language');
  const status = searchParams.get('status');
  const featuredType = searchParams.get('featuredType');
  // TODO: add full text searching using mongoose
  if (title) query.title = { $regex: title, $options: 'i' };
  if (category) query.category = category;
  if (country) query.country = country;
  if (city) query.city = city;
  if (language) query.language = language;
  if (featuredType) query.featuredType = featuredType;
  // allow filter by status to only logged in users
  if (session && status) {
    // TODO: allow filter by status
    // TODO add index to status
    query.status = status;
  }


  const data = await Link.find(query).lean();

  return Response.json({ status: 'success', data }, { status: 200 });
}

