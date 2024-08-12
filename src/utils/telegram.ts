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
  if (entity instanceof Api.Channel) {
    // For channels and super groups
    fullInfo = await client.invoke(
      new Api.channels.GetFullChannel({
        channel: entity,
      })
    );
    memberCount = (fullInfo?.fullChat as any)?.participantsCount;
  } else if (entity instanceof Api.Chat) {
    // For small groups
    fullInfo = await client.invoke(
      new Api.messages.GetFullChat({
        chatId: entity.id,
      })
    );
    memberCount = (fullInfo?.chats?.[0] as any)?.participantsCount;
    title = (fullInfo?.chats?.[0] as any)?.title;
  }
  const details = {
    title: (entity as any).title,
    isChannel: entity instanceof Api.Channel,
    isGroup: entity instanceof Api.Chat,
    isSupergroup: entity instanceof Api.Channel && entity.megagroup,
    memberCount: memberCount || 0,
    photo: '',
  };
  if ((entity as any)?.photo instanceof Api.ChatPhoto) {
    console.log('Get Photo', (entity as any)?.photo);
    const photo = await client.downloadProfilePhoto(entity);
    // save photo to s3
    console.log((entity as any)?.photo, photo);
    // TODO set s3 link
    const { url } = await put(`link-img/${name}.jpg`, photo, {
      access: 'public',
    });
    details.photo = url;
  }
  return details;
}
