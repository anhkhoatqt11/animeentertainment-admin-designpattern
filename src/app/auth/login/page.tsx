import React from "react";
import Logo from "@/components/logo";
import Login from "./(components)/Login";
import { alreadyLoggedIn } from "@/lib/auth";

export default async function Component() {
  await alreadyLoggedIn();
  return (
    <div
      className="flex justify-center items-center bg-emerald-400 w-full h-screen"
      style={{
        backgroundImage: "url('/comiclisttransparent.jpg')",
        backgroundRepeat: "repeat",
      }}
    >
      <Login />
    </div>
  );
}
