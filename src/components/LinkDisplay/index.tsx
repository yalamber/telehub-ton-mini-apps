import { useUtils, useThemeParams } from '@telegram-apps/sdk-react';
// import { Avatar } from '@telegram-apps/telegram-ui';
import Image from 'next/image';

// Link list display component for featured items
export default function LinkDisplay({ item }: { item: any }) {
  const utils = useUtils();
  const themeParams = useThemeParams();

  return (
    <a
      href={`https://t.me/${item.link}`}
      onClick={(e) => {
        e.preventDefault();
        utils.openTelegramLink(`https://t.me/${item.link}`);
      }}
    >
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <div className="flex-shrink-0">
          <Image
            src={item.photo ?? ''}
            alt={item.title}
            width={40}
            height={40}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={`font-medium text-gray-900 truncate`}
            style={{ color: themeParams.textColor }}
          >
            {item.title}
          </p>
          <p
            className={`text-sm font-medium text-gray-900 truncate`}
            style={{ color: themeParams.textColor }}
          >
            {item.about}
          </p>
          <p
            className={`text-sm truncate`}
            style={{ color: themeParams.textColor }}
          >
            {item.memberCount} members
          </p>
        </div>
        <div className="inline-flex items-center text-base">
          <span
            className={`text-sm px-2.5 py-1 rounded-xl`}
            style={{
              background: themeParams.accentTextColor,
              color: themeParams.bgColor,
            }}
          >
            {item.type === 'CHANNEL' ? 'Channel' : 'Group'}
          </span>
        </div>
      </div>
    </a>
  );
}
