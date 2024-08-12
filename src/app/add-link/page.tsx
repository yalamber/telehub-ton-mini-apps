
import connectMongo from '@/utils/dbConnect';
import FilterOption from '@/models/FilterOption';
import {
  Section
} from '@telegram-apps/telegram-ui';

async function getData() {
  await connectMongo();
  const categories = await FilterOption.find({ type: 'CATEGORY' }).lean();
  const countries = await FilterOption.find({ type: 'COUNTRY' }).lean();
  const languages = await FilterOption.find({ type: 'LANGUAGE' }).lean();
  return [categories, countries, languages];
}

import AddForm from './addForm';

export default async function AddLinkPage() {
  const [categories, countries, languages] = await getData();
  return (
    <Section header="Channel/Group Details">
      <AddForm categories={JSON.parse(JSON.stringify(categories))} countries={JSON.parse(JSON.stringify(countries))} languages={JSON.parse(JSON.stringify(languages))} />
    </Section>
  );
}
