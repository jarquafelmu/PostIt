"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MAX_TITLE_LENGTH } from "../../utils/constants";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

export default function AddPost() {
  const [title, setTitle] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  let toastPostID: string;

  // Create a new post
  const { mutate } = useMutation(
    async (title: string) => await axios.post("/api/posts/addPost", { title }),
    {
      onError: (err) => {
        if (err instanceof AxiosError)
          toast.error(err?.response?.data?.error || "An error occurred.", {
            id: toastPostID,
          });
      },
      onSuccess: () => {
        toast.success("Post created. 🔥", { id: toastPostID });
        setTitle("");
      },
      onSettled: () => {
        setIsDisabled(false);
      },
    }
  );

  const submitPost = async (e: FormEvent) => {
    e.preventDefault();
    // ? toastPostID is supposed to link toasts together but it doesn't work
    toastPostID = toast.loading("Creating post...", { duration: 1000 });
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
