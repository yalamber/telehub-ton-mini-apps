import { headers } from 'next/headers';
import {
  validate,
  parse,
  type InitDataParsed,
} from '@telegram-apps/init-data-node';
import { z } from 'zod';
import { Bot } from 'grammy';
import connectMongo from '@/utils/dbConnect';
import Link from '@/models/Link';
import { TelegramService } from '@/utils/telegram';

const invoiceZod = z.object({
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
        invoiceZod.parse(reqBody);
        const link = await Link.findOne({
          link: TelegramService.extractUsername(reqBody.link),
        });
        if (!link) {
          throw new Error('Please submit your link first');
        }
        const bot = new Bot(process.env.TG_BOT_TOKEN);
        const title = 'Feature';
        const description = `Feature your link`;
        // TODO: add more data if necessary
        const payload = JSON.stringify({ linkId: link._id });
        const currency = 'XTR';
        const prices = [{ amount: 100, label: 'Feature 1 Link' }];

        const invoiceLink = await bot.api.createInvoiceLink(
          title,
          description,
          payload,
          '', // Provider token must be empty for Telegram Stars
          currency,
          prices
        );

        return Response.json({ status: 'ok', invoiceLink });
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
