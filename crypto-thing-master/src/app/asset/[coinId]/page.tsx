"use client";
import LandingPage from "@/sections/LandingPage/page";
import { useStytchUser } from "@stytch/nextjs";
import CoinPage from "@/sections/CoinPage/page";
import React from "react";

function Coin({
  params: { coinId },
}: Readonly<{
  params: { coinId: string };
}>) {
  const { user, isInitialized } = useStytchUser();
  return (
    <>
      {isInitialized && user ? <CoinPage coinId={coinId} /> : <LandingPage />}
    </>
  );
}

export default Coin;
