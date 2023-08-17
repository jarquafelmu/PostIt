"use client";

import Image from "next/image";
import { useState } from "react";
import Toggle from "./Toggle";
import axios, { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface EditPostProps {
  id: string;
  avatar: string;
  name: string;
  title: string;
  comments?: {
    id: string;
    postId: string;
    userId: string;
  }[];
}

export default function EditPost({
  avatar,
  name,
  title,
  comments,
  id,
}: EditPostProps) {
  // Toggle
  const [toggle, setToggle] = useState(false);
  let deleteToastId: string = `delete-toast-${id}`;
  const queryClient = useQueryClient();

  // Delete post
  const { mutate } = useMutation(
    async (id: string) =>
      await axios.delete(`/api/posts/deletePost`, { data: id }),
    {
      onError: (err) => {
        if (err instanceof AxiosError)
          toast.error(err?.response?.data?.error || "An error occurred.", {
            id: deleteToastId,
          });
      },
      onSuccess: () => {
        toast.error("Post was deleted. 😭", { id: deleteToastId });
        queryClient.invalidateQueries(["auth-posts"]);
      },
    }
  );

  const deletePost = () => {
    toast.loading("Deleting post...", {
      id: deleteToastId,
    });
    mutate(id);
  };

  return (
    <>
      <div className="bg-white my-8 p-8 rounded-lg">
        <div className="flex items-center gap-2">
          <Image
            className="rounded-full"
            width={32}
            height={32}
            src={avatar}
            alt="avatar"
          />
          <h3 className="font-bold text-gray-700">{name}</h3>
        </div>
        <div className="my-8">
          <p className="break-all">{title}</p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm font-bold text-gray-700">
            {comments?.length || 0} Comments
          </p>
          <button
            onClick={() => setToggle(true)}
            className="text-sm font-bold text-red-500"
          >
            Delete
          </button>
        </div>
      </div>
      {toggle && <Toggle deletePost={deletePost} setToggle={setToggle} />}
    </>
  );
}
