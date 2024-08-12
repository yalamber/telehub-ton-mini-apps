import HomePage from '@/components/pages/home';
import connectMongo from '@/utils/dbConnect';
import FilterOption from '@/models/FilterOption';

async function getData() {
  await connectMongo();
  const categories = await FilterOption.find({ type: 'CATEGORY' }).lean();
  const countries = await FilterOption.find({ type: 'COUNTRY' }).lean();
  const languages = await FilterOption.find({ type: 'LANGUAGE' }).lean();
  // TODO: query default links
  const links: any = [];
  return [categories, countries, languages, links];
}

export default async function Home() {
  const [categories, countries, languages, links] = await getData();
  return (
    <HomePage
      links={links}
      categories={categories}
      countries={countries}
      languages={languages}
    />
  );
}
