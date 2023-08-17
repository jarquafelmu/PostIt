import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return;

  // Get auth user's post
  try {
    const data = await prisma.post.findUnique({
      where: { id: req.query.details as string },
      include: {
        comments: { orderBy: { createdAt: "desc" }, include: { user: true } },
        user: true,
      },
    });

    return res.status(200).json(data);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal server error when getting posts." });
  }
}
