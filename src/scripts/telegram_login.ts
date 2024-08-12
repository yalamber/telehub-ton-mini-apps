import { Api, TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';
import { input } from '@inquirer/prompts';

(async function main() {
  const stringSession = new StringSession('');
  const client = new TelegramClient(
    stringSession,
    parseInt(process.env.TG_API_ID),
    process.env.TG_API_HASH,
    {
      connectionRetries: 1,
    }
  );
  await client.connect();
  if (!(await client.isUserAuthorized())) {
    console.log('User is not authenticated');
    await client.start({
      phoneNumber: process.env.TG_PHONE_NUMBER,
      //password: () =>
      //new Promise((resolve) => resolve(process.env.TG_PASSWORD)),
      phoneCode: () => input({ message: 'Enter your code' }),
      onError: (err) => console.log(err),
    });
    console.log('SESSION : ', JSON.stringify(client.session.save()));
  }
  console.log('user is authenticated');

  // console.log('You should now be connected.');
  // const entity = await client.getEntity('yoloanil');
  // console.log(entity);
  // let fullInfo;
  // let memberCount;

  // if (entity instanceof Api.Channel) {
  //   // For channels and supergroups
  //   fullInfo = await client.invoke(
  //     new Api.channels.GetFullChannel({
  //       channel: entity,
  //     })
  //   );
  //   memberCount = fullInfo.fullChat.participantsCount;
  // } else if (entity instanceof Api.Chat) {
  //   // For small groups
  //   fullInfo = await client.invoke(
  //     new Api.messages.GetFullChat({
  //       chatId: entity.id,
  //     })
  //   );
  //   memberCount = fullInfo.chats[0].participantsCount;
  // }
  // const details = {
  //   isChannel: entity instanceof Api.Channel,
  //   isGroup: entity instanceof Api.Chat,
  //   isSupergroup: entity instanceof Api.Channel && entity.megagroup,
  //   memberCount: memberCount || 'Not available',
  //   photo:
  //     entity.photo instanceof Api.ChatPhoto
  //       ? 'Photo available'
  //       : 'No photo available',
  // };
  // if (entity.photo instanceof Api.ChatPhoto) {
  //   const photo = await client.downloadProfilePhoto(entity);
  //   console.log(photo);
  // }
  // console.log(details);
})();
