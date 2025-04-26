"use client";

import { useState } from "react";
import ChallengeQuestionList from "./(components)/ChallengeQuestionList";
import { SearchAndActionBar } from "./(components)/SearchAndActionBar";
import React from "react";

export function ChallengeManagement() {
  const [searchWord, setSearchWord] = useState("");
  const [isLoaded, setIsLoaded] = React.useState(false);

  return (
    <>
      <SearchAndActionBar setIsLoaded={setIsLoaded} />
      <ChallengeQuestionList
        props={searchWord}
        isLoaded={isLoaded}
        setIsLoaded={setIsLoaded}
      />
    </>
  );
}
