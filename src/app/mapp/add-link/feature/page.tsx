import connectMongo from '@/utils/dbConnect';
import { Headline } from '@telegram-apps/telegram-ui';

export default async function AddLinkPage() {
  return (
    <div className="py-5">
      <div className="px-5 pb-5">
        <Headline weight="1">Feature your link</Headline>
      </div>
    </div>
  );
}
