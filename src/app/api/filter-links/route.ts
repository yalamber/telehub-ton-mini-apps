import connectMongo from '@/utils/dbConnect';
import { NextRequest } from 'next/server';
import Link from '@/models/Link';

export async function GET(request: NextRequest) {
    await connectMongo();
    const { searchParams } = request.nextUrl;
    const query: Record<string, string | { $regex: string; $options: string }> = {};

    const title = searchParams.get('title');
    const category = searchParams.get('category');
    const country = searchParams.get('country');
    const city = searchParams.get('city');
    const language = searchParams.get('language');
  
    if (title) query.title = { $regex: title, $options: 'i' };
    if (category) query.category = category;
    if (country) query.country = country;
    if (city) query.city = city;
    if (language) query.language = language;
  
    const data = await Link.find(query).lean();
  
    return Response.json(
      { status: 'success', data },
      { status: 200 }
    );
  }