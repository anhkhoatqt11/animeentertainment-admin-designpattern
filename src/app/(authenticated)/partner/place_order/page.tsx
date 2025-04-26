import React, { useState } from "react";
import { PlaceAdvertisement } from "./(components)/PlaceAdvertisement";
import { getSession } from "@/lib/auth";

const page = async () => {
  const session = await getSession();
  return (
    <div className="w-full h-full bg-slate-100">
      <PlaceAdvertisement session={session} />
    </div>
  );
};

export default page;
