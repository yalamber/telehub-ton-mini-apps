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

export async function GET(request: NextRequest) {
  await connectMongo();
  // IMPLEMENT single Item get
  return Response.json({ status: 'success' }, { status: 200 });
}

export async function PUT(request: NextRequest) {
  return Response.json({ status: 'success' }, { status: 200 });
}

export async function DELETE(request: NextRequest) {
  return Response.json({ status: 'success' }, { status: 200 });
}
