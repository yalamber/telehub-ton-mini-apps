import { Api, TelegramClient } from 'telegram';
import { put } from '@vercel/blob';
import { StringSession } from 'telegram/sessions/index.js';

export async function getChannelDetails(name: string, tgSession: string) {
  const session = new StringSession(tgSession);
  const client = new TelegramClient(
    session,
    parseInt(process.env.TG_API_ID),
    process.env.TG_API_HASH,
    {
      connectionRetries: 1,
    }
  );

  await client.connect();

  if (!(await client.isUserAuthorized())) {
    throw new Error('Not authorized');
  }
  const entity = await client.getEntity(name);
  let fullInfo;
  let memberCount;
  let type;
  if (entity instanceof Api.Channel) {
    // For channels and super groups
    fullInfo = await client.invoke(
      new Api.channels.GetFullChannel({
        channel: entity,
      })
    );
    memberCount = (fullInfo?.fullChat as any)?.participantsCount;
    type = 'CHANNEL';
  } else if (entity instanceof Api.Chat) {
    // For small groups
    fullInfo = await client.invoke(
      new Api.messages.GetFullChat({
        chatId: entity.id,
      })
    );
    memberCount = (fullInfo?.chats?.[0] as any)?.participantsCount;
    type = 'GROUP';
  }
  const details = {
    title: (entity as any).title,
    isChannel: entity instanceof Api.Channel,
    isGroup: entity instanceof Api.Chat,
    isSupergroup: entity instanceof Api.Channel && entity.megagroup,
    memberCount: memberCount || 0,
    photo: '',
    type,
  };
  if ((entity as any)?.photo instanceof Api.ChatPhoto) {
    console.log('Get Photo', (entity as any)?.photo);
    const photo = await client.downloadProfilePhoto(entity);
    // save photo to s3
    console.log((entity as any)?.photo, photo);
    // TODO set s3 link
    if (photo) {
      const { url } = await put(`link-img/${name}.jpg`, photo, {
        access: 'public',
      });
      details.photo = url;
    }
  }
  return details;
}

export function extractUsername(link: string): string | null {
  // Regex to capture the username from different variations of Telegram links
  const match = link.match(
    /(?:https?:\/\/)?(?:t\.me|telegram\.me)\/([a-zA-Z0-9_]{5,32})/
  );

  if (match) {
    return match[1]; // Return the captured username
  }

  // If the input is a plain username or @username format
  if (/^@?[a-zA-Z0-9_]{5,32}$/.test(link)) {
    return link.replace(/^@/, ''); // Remove @ if present
  }

  return null; // Return null if no valid username found
}
