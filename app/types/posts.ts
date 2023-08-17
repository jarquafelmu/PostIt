import { Post, User, Comment } from "@prisma/client";

export type PostType = Post & { comments?: CommentType[]; user?: User };

export type CommentType = Comment & { user?: User };
