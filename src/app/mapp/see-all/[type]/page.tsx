import { kv } from '@vercel/kv';
import SeeAllPage from '@/components/pages/see-all';
import connectMongo from '@/utils/dbConnect';
import Link from '@/models/Link';

async function getData(type: 'TRENDING' | 'NEW' | 'NONE') {
  const cacheKey = `see-all-${type}`;
  const cachedData = await kv.get(cacheKey);
  if (cachedData && typeof cachedData === 'string') {
    return JSON.parse(cachedData);
  }
  await connectMongo();
  const links = await Link.find({ featuredType: type, status: 'APPROVED' })
    .limit(10)
    .lean();
  const result = { links };
  await kv.set(cacheKey, JSON.stringify(result), { ex: 1800 });
  return result;
}

export const revalidate = 120;

export default async function Home({ params }: { params: { type: string } }) {
  const type = params.type.toUpperCase() as 'TRENDING' | 'NEW' | 'NONE';
  const { links } = await getData(type);
  return (
    <SeeAllPage resLinks={JSON.parse(JSON.stringify(links))} type={type} />
  );
}
