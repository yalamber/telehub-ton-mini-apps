import SeeAllPage from '@/components/pages/see-all';
import connectMongo from '@/utils/dbConnect';
import Link from '@/models/Link';

async function getData(type: 'TRENDING' | 'NEW' | 'NONE') {
  await connectMongo();
  const links = await Link.find({ featuredType: type }).limit(10).lean();
  return { links };
}

export const revalidate = 120;

export default async function Home({ params }: { params: { type: string } }) {
  const type = params.type.toUpperCase() as 'TRENDING' | 'NEW' | 'NONE';
  const { links } = await getData(type);
  return (
    <SeeAllPage resLinks={JSON.parse(JSON.stringify(links))} type={type} />
  );
}
