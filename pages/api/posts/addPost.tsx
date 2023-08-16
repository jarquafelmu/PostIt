import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { MAX_TITLE_LENGTH } from "../../../utils/constants";
import prisma from "../../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // Process a POST request
    const session = await getServerSession(req, res, authOptions);

    if (!session)
      return res
        .status(401)
        .json({ error: "Unauthorized. Must be signed in to make a post." });

    console.log(req.body);
    const { title }: { title: string } = req.body;

    // Get user
    const prismaUser = await prisma.user.findUnique({
      where: { email: session.user?.email },
    });

    // Check title
    if (title.length > MAX_TITLE_LENGTH)
      return res.status(403).json({
        error: `Title must be less than ${MAX_TITLE_LENGTH} characters.`,
      });
    if (!title.length)
      return res.status(403).json({ error: "Title cannot be empty." });

    // Create post
    try {
      const result = await prisma.post.create({
        data: {
          title,
          userId: prismaUser?.id,
        },
      });
      return res.status(200).json({ result });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Internal server error when creating post." });
    }
  }
}
