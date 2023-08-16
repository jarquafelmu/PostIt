"use client";
import axios from "axios";
import AddPost from "./components/AddPost";
import { useQuery } from "@tanstack/react-query";
import Posts from "./components/Posts";
import { Post, User } from "@prisma/client";

// fetch all posts
const allPosts = async () => {
  const response = await axios.get("/api/posts/getPosts");
  return response.data;
};

type PostWithUser = Post & { user: User };

export default function Home() {
  const { data, error, isLoading } = useQuery<PostWithUser[]>({
    queryFn: allPosts,
    queryKey: ["posts"],
  });
  if (error) return <div>Error fetching posts.</div>;
  if (isLoading) return <div>Loading...</div>;
  return (
    <main>
      <AddPost />
      {data?.map((post: PostWithUser) => (
        <Posts
          key={post.id}
          name={post.user.name!}
          avatar={post.user.image!}
          postTitle={post.title}
          id={post.id}
        />
      ))}
    </main>
  );
}
