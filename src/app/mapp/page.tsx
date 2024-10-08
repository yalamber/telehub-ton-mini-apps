import { kv } from '@vercel/kv';
import HomePage from '@/components/pages/home';
import connectMongo from '@/utils/dbConnect';
import FilterOption from '@/models/FilterOption';
import Link from '@/models/Link';

async function getData() {
  const cacheKey = 'homePageData';
  const cachedData = await kv.get(cacheKey);
  if (cachedData && typeof cachedData === 'string') {
    return JSON.parse(cachedData);
  }

  await connectMongo();

  const filterTypes = ['CATEGORY', 'COUNTRY', 'LANGUAGE'];

  const [categories, countries, languages, trendingLinks, newLinks, links] =
    await Promise.all([
      ...filterTypes.map((type) => FilterOption.find({ type }).lean()),
      // TODO: order both queries by last modified date
      Link.find({ featuredType: 'TRENDING', status: 'APPROVED' })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      Link.find({ featuredType: 'NEW', status: 'APPROVED' })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      Link.find({ featuredType: 'NONE', status: 'APPROVED' })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
    ]);

  const result = {
    categories,
    countries,
    languages,
    trendingLinks,
    newLinks,
    links,
  };
  await kv.set(cacheKey, JSON.stringify(result), { ex: 1800 });
  return result;
}

export const revalidate = 120;

export default async function Home() {
  const { categories, countries, languages, trendingLinks, newLinks, links } =
    await getData();
  return (
    <HomePage
      resTrendingLinks={JSON.parse(JSON.stringify(trendingLinks))}
      resNewLinks={JSON.parse(JSON.stringify(newLinks))}
      resLinks={JSON.parse(JSON.stringify(links))}
      nextCursor={
        links.length > 0
          ? (links as Array<any>)[links.length - 1]._id.toString()
          : null
      }
      categories={JSON.parse(JSON.stringify(categories))}
      countries={JSON.parse(JSON.stringify(countries))}
      languages={JSON.parse(JSON.stringify(languages))}
    />
  );
}
