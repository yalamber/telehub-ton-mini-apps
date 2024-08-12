import { Api, TelegramClient } from 'telegram';
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
    memberCount = fullInfo.fullChat.participantsCount;
  } else if (entity instanceof Api.Chat) {
    // For small groups
    fullInfo = await client.invoke(
      new Api.messages.GetFullChat({
        chatId: entity.id,
      })
    );
    memberCount = fullInfo.chats[0].participantsCount;
  }
  const details = {
    isChannel: entity instanceof Api.Channel,
    isGroup: entity instanceof Api.Chat,
    isSupergroup: entity instanceof Api.Channel && entity.megagroup,
    memberCount: memberCount || 0,
    photo: '',
  };
  if (entity.photo instanceof Api.ChatPhoto) {
    const photo = await client.downloadProfilePhoto(entity);
    // save photo to s3
    // TODO set s3 link
    details.photo = 'S3 link here';
  }
  return details;
}
