import HomePage from '@/components/pages/home';
import connectMongo from '@/utils/dbConnect';
import FilterOption from '@/models/FilterOption';

async function getData() {
  await connectMongo();
  const categories = await FilterOption.find({ type: 'CATEGORY' }).lean();
  const countries = await FilterOption.find({ type: 'COUNTRY' }).lean();
  const languages = await FilterOption.find({ type: 'LANGUAGE' }).lean();
  console.log(categories, countries, languages);
  return [categories, countries, languages];
}

export default async function Home() {
  const [categories, countries, languages] = await getData();
  return (
    <HomePage
      categories={categories}
      countries={countries}
      languages={languages}
    />
  );
}
