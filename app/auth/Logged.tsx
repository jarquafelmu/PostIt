"use client";

import Image from "next/image";
import { signOut } from "next-auth/react";
import Link from "next/link";

type User = {
  image: string;
};

export default function Logged({ image }: User) {
  return (
    <li className="flex gap-8 items-center">
      <button
        onClick={() => signOut()}
        className="bg-gray-700 text-white rounded-xl text-sm px-6 py-2"
      >
        Sign out
      </button>
      <Link href={"/dashboard"}>
        <Image
          width={64}
          height={54}
          src={image}
          alt="user image"
          priority
          className="rounded-full"
        />
      </Link>
    </li>
  );
}
