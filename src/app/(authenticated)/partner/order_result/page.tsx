import React, { useState } from "react";
import OrderResult from "./(components)/OrderResult";

const page = async () => {
    return (
        <div className="w-full h-full bg-slate-100">
            <OrderResult />
        </div>
    );
};

export default page;
