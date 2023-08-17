"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { UserWithPosts } from "../types/authPosts";
import EditPost from "./EditPost";
import { PostType } from "../types/posts";

const fetchAuthPosts = async () => {
  const response = await axios.get("/api/posts/authPosts");
  return response.data;
};

export default function MyPosts() {
  const { data, error, isLoading } = useQuery<UserWithPosts>({
    queryFn: fetchAuthPosts,
    queryKey: ["auth-posts"],
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching posts.</div>;

  return (
    <div>
      {data?.post?.map((post: PostType) => (
        <EditPost
          key={post.id}
          id={post.id}
          avatar={data.image!}
          name={data.name!}
          title={post.title!}
          comments={post.comments}
        />
      ))}
      {!data?.post?.length && <div>No posts found.</div>}
    </div>
  );
}
