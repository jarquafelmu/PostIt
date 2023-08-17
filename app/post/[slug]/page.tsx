"use client";

import AddComment from "@/app/components/AddComment";
import Post from "@/app/components/Posts";
import { CommentType, PostType } from "@/app/types/posts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type URL = {
  params: {
    slug: string;
  };
};

const fetchDetails = async (slug: string) => {
  const response = await axios.get(`/api/posts/${slug}`);
  return response.data;
};

export default function PostDetail(url: URL) {
  const { data, isLoading, isError } = useQuery<PostType>({
    queryKey: ["detail-post"],
    queryFn: () => fetchDetails(url.params.slug),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error</div>;
  }
  return (
    <div>
      <Post
        id={data.id}
        avatar={data.user!.image!}
        name={data.user!.name!}
        postTitle={data.title}
        numComments={data.comments?.length}
      />
      <AddComment id={data.id} />
      {data?.comments?.map((comment: CommentType) => (
        <div key={comment.id} className="my-8">
          <div className="flex items-center gap-2">
            <img
              className="rounded-full"
              width={32}
              height={32}
              src={comment.user!.image!}
              alt="avatar"
            />
            <h3 className="font-bold text-gray-700">{comment.user!.name}</h3>
          </div>
          <div className="my-8">
            <p className="break-all">{comment.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
