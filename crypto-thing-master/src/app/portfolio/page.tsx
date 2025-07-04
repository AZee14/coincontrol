"use client";
import HomePage from "@/sections/Home/page";
import LandingPage from "@/sections/LandingPage/page";
import { useStytchUser } from "@stytch/nextjs";

export default function Portfolio() {
  const { user, isInitialized } = useStytchUser();
  // If the Stytch SDK detects a User then redirect to home; for example if a logged in User navigated directly to this URL.
  // useEffect(() => {
  //   if (isInitialized && user) {
  //     router.replace(DEFAULT_ROUTE);
  //   }
  // }, [user, isInitialized, router]);

  return <>{isInitialized && user ? <HomePage /> : <LandingPage />}</>;
}
