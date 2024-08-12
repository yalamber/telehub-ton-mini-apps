import HomePage from '@/components/pages/home';
import connectMongo from '@/utils/dbConnect';
import FilterOption from '@/models/FilterOption';
import Link from '@/models/Link';

async function getData() {
  await connectMongo();
  const categories = await FilterOption.find({ type: 'CATEGORY' }).lean();
  const countries = await FilterOption.find({ type: 'COUNTRY' }).lean();
  const languages = await FilterOption.find({ type: 'LANGUAGE' }).lean();
  const links = await Link.find().lean();
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
