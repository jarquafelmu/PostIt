import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { MAX_TITLE_LENGTH } from "../../../utils/constants";
import prisma from "../../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return;

  // Process a GET request
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).json({ error: "Please sign in." });

  // Get auth user's post
  try {
    const data = await prisma.user.findUnique({
      where: { email: session.user!.email! },
      include: {
        post: { orderBy: { createdAt: "desc" }, include: { comment: true } },
      },
    });
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Internal server error when getting posts." });
  }
}
