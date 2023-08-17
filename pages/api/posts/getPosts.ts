import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return;
  // Fetch all posts
  try {
    const data = await prisma.post.findMany({
      include: {
        user: true,
        comment: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Internal server error when fetching posts." });
  }
}
