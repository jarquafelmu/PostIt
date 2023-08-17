"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MAX_TITLE_LENGTH } from "../../utils/constants";
import axios from "axios";
import toast from "react-hot-toast";
import { handleToastError } from "@/utils/toastErrors";

export default function AddPost() {
  const [title, setTitle] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const queryClient = useQueryClient();
  const toastId: string = "post-toast";

  // Create a new post
  const { mutate } = useMutation(
    async (title: string) => await axios.post("/api/posts/addPost", { title }),
    {
      onError: (err) => handleToastError(err, toastId),
      onSuccess: () => {
        toast.success("Post created. 🔥", { id: toastId });
        setTitle("");
        queryClient.invalidateQueries(["posts"]);
      },
      // finally do this
      onSettled: () => {
        setIsDisabled(false);
      },
    }
  );

  const submitPost = async (e: FormEvent) => {
    e.preventDefault();
    toast.loading("Creating post...", {
      id: toastId,
    });
    setIsDisabled(true);
    mutate(title);
  };

  return (
    <form onSubmit={submitPost} className="bg-white my-8 p-8 rounded-md">
      <div className="flex flex-col my-4">
        <textarea
          name="title"
          value={title}
          placeholder="What's on your mind?"
          onChange={(e) => setTitle(e.target.value)}
          className="p-4 text-lg rounded-md my-2 bg-gray-200"
        ></textarea>
      </div>
      <div className={`flex items-center justify-between gap-2 `}>
        <p
          className={`font-bold text-sm ${
            title.length > MAX_TITLE_LENGTH ? "text-red-700" : "text-gray-700"
          }`}
        >{`${title.length}/${MAX_TITLE_LENGTH}`}</p>
        <button
          type="submit"
          disabled={isDisabled}
          className="text-sm bg-teal-600 text-white py-2 px-6 rounded-xl disabled:opacity-25"
        >
          Create a post
        </button>
      </div>
    </form>
  );
}
