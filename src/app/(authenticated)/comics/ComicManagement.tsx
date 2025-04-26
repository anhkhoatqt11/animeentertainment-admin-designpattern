"use client";

import React, { useState } from "react";
import SearchAndCreateBar from "./(components)/SearchCreateBar";
import ComicList from "./(components)/ComicList";

export function ComicManagement() {
  const [searchWord, setSearchWord] = useState("");
  const [sort, setSort] = useState(-1);
  const [isLoaded, setIsLoaded] = React.useState(false);

  return (
    <>
      <SearchAndCreateBar
        setSearchWord={setSearchWord}
        setSort={setSort}
        setIsLoaded={setIsLoaded}
      />
      <ComicList
        props={searchWord}
        sort={sort}
        isLoaded={isLoaded}
        setIsLoaded={setIsLoaded}
      />
    </>
  );
}
