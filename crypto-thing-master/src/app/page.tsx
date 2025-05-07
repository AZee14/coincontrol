"use client";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import HomePage from "@/sections/Home/page";
import LandingPage from "@/sections/LandingPage/page";
import { useStytchUser } from "@stytch/nextjs";
import { useEffect } from "react";

export default function Home() {
  const { user, isInitialized } = useStytchUser();
  // If the Stytch SDK detects a User then redirect to home; for example if a logged in User navigated directly to this URL.
  // useEffect(() => {
  //   if (isInitialized && user) {
  //     router.replace(DEFAULT_ROUTE);
  //   }
  // }, [user, isInitialized, router]);

  return <>{isInitialized && user ? <HomePage /> : <LandingPage />}</>;
}
