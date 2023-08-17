import { Post, User, Comment } from "@prisma/client";

export type PostType = Post & {comments?: Comment[] };

export type PostTypeWithUser = PostType & { user: User };