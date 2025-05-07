"use client";
import React from "react";
import { StytchLogin } from "@stytch/nextjs";
import { Products } from "@stytch/vanilla-js";
import { REDIRECT_URL } from "@/app/paths";

function StytchLoginPage() {
  const styles = {
    container: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    buttons: {
      primary: {
        backgroundColor: "#4A37BE",
        borderColor: "#4A37BE",
      },
    },
  };

  const config = {
    products: [Products.emailMagicLinks, Products.oauth],
    emailMagicLinksOptions: {
      loginRedirectURL: REDIRECT_URL,
      loginExpirationMinutes: 60,
      signupRedirectURL: REDIRECT_URL,
      signupExpirationMinutes: 60,
    },
    oauthOptions: {
      providers: [{ type: "google" }],
      loginRedirectURL: REDIRECT_URL,
      signupRedirectURL: REDIRECT_URL,
    }, // Configure OAuth flow for this project on the platform too when you add it in oAuth options
  } as Parameters<typeof StytchLogin>[0]["config"];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <StytchLogin config={config} styles={styles} />;
    </div>
  );
}

export default StytchLoginPage;
