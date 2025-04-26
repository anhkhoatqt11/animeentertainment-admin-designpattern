import React, { useState } from "react";
import CreateAccount from "./(components)/CreateAccount";
import CredentialsTable from "./(components)/CredentialsTable";

const page = () => {
  return (
    <div className="w-full h-full bg-[#F6F6F6] p-4">
      <div className="flex flex-row justify-between">
        <div className="font-medium text-xl p-3">
          Danh sách người dùng Skylark Portal
        </div>
        <CreateAccount />
      </div>

      <CredentialsTable />
    </div>
  );
};

export default page;
