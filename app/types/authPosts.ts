import { User } from "@prisma/client";
import { PostType } from "./posts";


export type UserWithPosts = User & { post: PostType[]};