"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { MAX_TITLE_LENGTH } from "@/utils/constants";
import { handleToastError } from "@/utils/toastErrors";

type AddCommentProps = {
  id: string;
};

type Comment = {
  postId: string;
  title: string;
};

export default function AddComment({ id }: AddCommentProps) {
  const [title, setTitle] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const queryClient = useQueryClient();

  const toastId: string = "comment-toast";

  // Create a new post
  const { mutate } = useMutation(
    async (data: Comment) =>
      await axios.post("/api/posts/addComment", { data }),
    {
      onError: (err: unknown) => handleToastError(err, toastId),
      onSuccess: () => {
        toast.success("Comment added. 🔥", { id: toastId });
        setTitle("");
        queryClient.invalidateQueries(["detail-post"]);
      },
      // finally do this
      onSettled: () => {
        setIsDisabled(false);
      },
    }
  );

  const submitComment = async (e: FormEvent) => {
    e.preventDefault();
    toast.loading("Adding comment...", {
      id: toastId,
    });
    setIsDisabled(true);
    mutate({ title, postId: id });
  };

  return (
    <form onSubmit={submitComment} className="my-8">
      <h3>Add a comment</h3>
      <div className="flex flex-col my-2">
        <input
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          name="title"
          className="p-4 text-lg rounded-md my-2"
        />
      </div>
      <div className={`flex items-center gap-2 `}>
        <button
          type="submit"
          disabled={isDisabled}
          className="text-sm bg-teal-600 text-white py-2 px-6 rounded-xl disabled:opacity-25"
        >
          Add Comment 🚀
        </button>
        <p
          className={`font-bold text-sm ${
            title.length > MAX_TITLE_LENGTH ? "text-red-700" : "text-gray-700"
          }`}
        >{`${title.length}/${MAX_TITLE_LENGTH}`}</p>
      </div>
    </form>
  );
}
