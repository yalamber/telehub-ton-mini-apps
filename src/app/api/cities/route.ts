import connectMongo from '@/utils/dbConnect';
import { NextRequest } from 'next/server';
import FilterOption from '@/models/FilterOption';

export async function GET(request: NextRequest) {
    await connectMongo();
    const country = request.nextUrl.searchParams.get('country');
    if(!country) {
        return Response.json(
            { status: 'error', msg: 'Invalid SearchParams'},
            { status: 400 }
        );
    }
    const data = await FilterOption.find({parent: country}).lean();

    return Response.json(
        { status: 'success', data: data },
        { status: 200 }
    );
}