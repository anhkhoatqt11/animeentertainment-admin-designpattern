"use client";

import React, { useState } from 'react'
import SearchAndCreateBar from './(components)/SearchAndCreateBar';
import DonatePackageList from './(components)/DonatePackageList';

const DonateManagement = () => {

    const [searchWord, setSearchWord] = useState("");
    const [isLoaded, setIsLoaded] = React.useState(false);

    return (
        <>
            <SearchAndCreateBar
                setSearchWord={setSearchWord}
                setIsLoaded={setIsLoaded}
            />
            <DonatePackageList
                props={searchWord}
                isLoaded={isLoaded}
                setIsLoaded={setIsLoaded}
            />

        </>
    )
}

export default DonateManagement