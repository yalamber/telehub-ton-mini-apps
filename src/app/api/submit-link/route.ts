import { headers } from 'next/headers';
import {
  validate,
  parse,
  type InitDataParsed,
} from '@telegram-apps/init-data-node';
import { z } from 'zod';
import TelegramBot from 'node-telegram-bot-api';
import { put } from "@vercel/blob";
import { getChannelDetails } from '@/utils/telegram';
import connectMongo from '@/utils/dbConnect';
import Link from '@/models/Link';

const LinkZod = z.object({
  link: z
    .string()
    .refine(
      (value) =>
        /^(https?:\/\/)?(t\.me|telegram\.me)\/[a-zA-Z0-9_]{5,32}$/.test(
          value
        ) || /^[a-zA-Z0-9_]{5,32}$/.test(value),
      {
        message:
          'Invalid Telegram link or username. It should be a valid URL or a username with 5-32 characters.',
      }
    ),
  country: z.string(),
  city: z.string(),
  language: z.string(),
  category: z.string().optional(),
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
        validate(authData, process.env.TG_TOKEN, {
          // We consider init data sign valid for 1 day from their creation moment.
          expiresIn: 3600 * 24,
        });
        const initData: InitDataParsed = parse(authData);
        const reqBody = await request.json();
        LinkZod.parse(reqBody);
        const bot = new TelegramBot(process.env.TG_TOKEN, { polling: false });
        // Add link to database by querying telegram link data chatId
        console.log("reqBody.link", reqBody.link)
        const channelData = await getChannelDetails(
          reqBody.link,
          process.env.TG_SESSION
        );
        await Link.create({
          title: channelData.title,
          link: reqBody.link,
          category: reqBody.category,
          country: reqBody.country,
          city: reqBody.city,
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
