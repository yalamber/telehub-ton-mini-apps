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
          {item.photo && (
            <Image
              className="rounded-full"
              src={item.photo}
              alt={item.title}
              width={40}
              height={40}
              priority={true}
            />
          )}
          {!item.photo && (
            <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                {item.title.slice(0, 2)}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={`font-medium truncate`}
            style={{ color: themeParams.textColor }}
          >
            {item.title}
          </p>
          <p
            className={`text-sm font-medium truncate`}
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
