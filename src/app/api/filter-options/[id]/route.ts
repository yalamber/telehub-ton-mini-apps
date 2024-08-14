import connectMongo from "@/utils/dbConnect";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import FilterOption from "@/models/FilterOption";
import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import Link from "@/models/Link";

export async function GET(request: NextRequest) {
  await connectMongo();
  // TODO: implement single item get
  return Response.json({ status: "success" }, { status: 200 });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectMongo();
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ status: "error" }, { status: 401 });
  }
  const body = await request.json();
  const id = params.id;
  const link = await Link.findById(id);
  link.status = body.status ? body.status : link.status;
  link.featuredType = body.featuredType ? body.featuredType : link.featuredType;

  await link.save();
  return Response.json({ status: "success" }, { status: 200 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectMongo();
  const id = params.id;
  const link = await Link.findById(id);
  if (!link) {
    return Response.json({ status: "error" }, { status: 404 });
  }
  await link.deleteOne();
  return Response.json({ status: "success" }, { status: 200 });
}
