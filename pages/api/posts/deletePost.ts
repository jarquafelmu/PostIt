import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { MAX_TITLE_LENGTH } from "../../../utils/constants";
import prisma from "../../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") return;

  // Process a DELETE request
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).json({ error: "Please sign in." });

  const postId = req.body;

  // Delete post
  try {
    const result = await prisma.post.delete({ where: { id: postId } });
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Internal server error when deleting post." });
  }
}
