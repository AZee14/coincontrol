"use client";
import React, { useEffect } from "react";
import { useStytchUser } from "@stytch/nextjs";
import { useRouter } from "next/navigation";
import StytchLoginPage from "./StytchLoginPage";
import { DEFAULT_ROUTE } from "@/app/paths";

function Login() {
  const { user, isInitialized } = useStytchUser();
  const router = useRouter();
  // If the Stytch SDK detects a User then redirect to home; for example if a logged in User navigated directly to this URL.
  useEffect(() => {
    if (isInitialized && user) {
      router.replace(DEFAULT_ROUTE);
    }
  }, [user, isInitialized, router]);

  return <StytchLoginPage />;
}

export default Login;
