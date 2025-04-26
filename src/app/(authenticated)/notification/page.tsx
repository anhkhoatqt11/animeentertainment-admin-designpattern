import React, { useState } from "react";
import SendNotification from "./(components)/SendNotification";

const page = () => {
  return (
    <div className="w-full h-full bg-[#F6F6F6] p-12">
      <SendNotification />
    </div>
  );
};

export default page;
