import { Api, TelegramClient } from 'telegram';
import { put } from '@vercel/blob';
import { StringSession } from 'telegram/sessions/index.js';
import { Entity } from 'telegram/define';

// TODO: add logger
interface DetailReturnData {
  title: string;
  about: string;
  isChannel: boolean;
  isGroup: boolean;
  isSuperGroup: boolean;
  memberCount: number;
  entityForPhoto?: Entity;
  photoId?: string;
  type: 'CHANNEL' | 'GROUP';
}

export class TelegramService {
  private client: TelegramClient;

  constructor(
    private apiId: number,
    private apiHash: string,
    tgSession: string
  ) {
    const session = new StringSession(tgSession);
    this.client = new TelegramClient(session, apiId, apiHash, {
      connectionRetries: 1,
    });
  }

  async connect() {
    await this.client.connect();
    if (!(await this.client.isUserAuthorized())) {
      throw new Error('Not authorized');
    }
  }

  async getLinkDetails(link: string): Promise<DetailReturnData> {
    const entity = await this.client.getEntity(link);
    let fullInfo;
    let memberCount: DetailReturnData['memberCount'];
    let type: DetailReturnData['type'];
    let about: DetailReturnData['about'];

    if (entity instanceof Api.Channel) {
      // For channels and super groups
      fullInfo = await this.client.invoke(
        new Api.channels.GetFullChannel({
          channel: entity,
        })
      );
      memberCount = (fullInfo?.fullChat as any)?.participantsCount;
      type = 'CHANNEL';
      about = fullInfo?.fullChat?.about ?? '';
    } else if (entity instanceof Api.Chat) {
      // For small groups
      fullInfo = await this.client.invoke(
        new Api.messages.GetFullChat({
          chatId: entity.id,
        })
      );
      memberCount = (fullInfo?.chats?.[0] as any)?.participantsCount;
      type = 'GROUP';
      about = fullInfo?.fullChat?.about ?? '';
    } else {
      throw new Error(
        'We do not handle other type of telegram links apart from Channel and Groups'
      );
    }
    const details: DetailReturnData = {
      title: (entity as any).title,
      about: about ?? '',
      memberCount: memberCount || 0,
      type,
      isChannel: entity instanceof Api.Channel,
      isGroup: entity instanceof Api.Chat,
      isSuperGroup:
        (entity instanceof Api.Channel && entity.megagroup) ?? false,
    };
    const photo = (entity as any)?.photo;
    if (photo instanceof Api.ChatPhoto) {
      details.entityForPhoto = entity;
      details.photoId = photo.photoId.toString();
    }
    return details;
  }

  static extractUsername(link: string): string | null {
    const match = link.match(
      /(?:https?:\/\/)?(?:t\.me|telegram\.me)\/([a-zA-Z0-9_]{5,32})/
    );

    if (match) {
      return match[1];
    }

    if (/^@?[a-zA-Z0-9_]{5,32}$/.test(link)) {
      return link.replace(/^@/, '');
    }

    return null;
  }

  async downloadAndSavePhoto(
    entity: Entity,
    photoId: string
  ): Promise<string | null> {
    const photoBuf = await this.client.downloadProfilePhoto(entity);
    if (photoBuf) {
      // TODO: upload to secondary location as backup as well
      const { url } = await put(`link-img/${photoId}.jpg`, photoBuf, {
        access: 'public',
      });
      return url;
    }
    return null;
  }
}
