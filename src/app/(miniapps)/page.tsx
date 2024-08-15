import HomePage from '@/components/pages/home';
import connectMongo from '@/utils/dbConnect';
import FilterOption from '@/models/FilterOption';
import Link from '@/models/Link';

async function getData() {
  await connectMongo();

  const filterTypes = ['CATEGORY', 'COUNTRY', 'LANGUAGE'];

  const [categories, countries, languages, trendingLinks, newLinks] =
    await Promise.all([
      ...filterTypes.map((type) => FilterOption.find({ type }).lean()),
      Link.find({}).lean(),
      Link.find({}).lean(),
    ]);

  return { categories, countries, languages, trendingLinks, newLinks };
}

export const revalidate = 120;

export default async function Home() {
  const { categories, countries, languages, trendingLinks, newLinks } =
    await getData();
  return (
    <HomePage
      resTrendingLinks={JSON.parse(JSON.stringify(trendingLinks))}
      resNewLinks={JSON.parse(JSON.stringify(newLinks))}
      categories={JSON.parse(JSON.stringify(categories))}
      countries={JSON.parse(JSON.stringify(countries))}
      languages={JSON.parse(JSON.stringify(languages))}
    />
  );
}
