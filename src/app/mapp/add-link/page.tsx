import connectMongo from '@/utils/dbConnect';
import FilterOption from '@/models/FilterOption';
import { Headline } from '@telegram-apps/telegram-ui';

async function getData() {
  await connectMongo();

  const filterTypes = ['CATEGORY', 'COUNTRY', 'LANGUAGE'];

  const [categories, countries, languages] = await Promise.all(
    filterTypes.map((type) => FilterOption.find({ type }).lean())
  );

  return { categories, countries, languages };
}

import AddForm from './addForm';

export default async function AddLinkPage() {
  const { categories, countries, languages } = await getData();
  return (
    <div className="py-5">
      <div className="px-5 pb-5">
        <Headline weight="1">Submit your link</Headline>
      </div>
      <AddForm
        categories={JSON.parse(JSON.stringify(categories))}
        countries={JSON.parse(JSON.stringify(countries))}
        languages={JSON.parse(JSON.stringify(languages))}
      />
    </div>
  );
}
