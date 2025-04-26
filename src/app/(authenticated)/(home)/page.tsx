import { Button } from "@nextui-org/react";
import React from "react";
import { Dashboard } from "./(components)/Dashboard";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";


const page = async () => {
  const session = await getSession();
  if (session?.user.role === "Editor") {
    redirect("/animes");
  } else if (session?.user.role == "Advertiser") {
    redirect("/partner/place_order");
  }
  return (
    <div className="w-full h-full bg-[#F6F6F6] p-12">
      <Dashboard />
    </div>
  );
};

export default page;
