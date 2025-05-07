"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStytchUser, useStytch } from "@stytch/nextjs";
import { DEFAULT_ROUTE } from "@/app/paths";
import { MAGIC_LINKS_TOKEN, OAUTH_TOKEN } from "./constants";
import { Container, Typography, Box, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { addUser } from "@/utils/user";

/*
During both the Magic link and OAuth flow, Stytch will redirect the user back to your application to a specified redirect URL. 
Stytch will append query parameters to the redirect URL which are then used to complete the authentication flow. 

The AuthenticatePage will detect the presence of a token in the query parameters, and attempt to authenticate it.
On successful authentication, a session will be created and the user will be redirect to DEFAULT_URL
*/
const Authenticate = () => {
  const { user, isInitialized } = useStytchUser();
  const stytch = useStytch();
  const router = useRouter();

  const params = useSearchParams();

  useEffect(() => {
    if (stytch && !user && isInitialized) {
      const stytch_token_type = params.get("stytch_token_type");
      const token = params.get("token");
      if (token && stytch_token_type === OAUTH_TOKEN) {
        stytch.oauth.authenticate(token, {
          session_duration_minutes: 60,
        });
      } else if (token && stytch_token_type === MAGIC_LINKS_TOKEN) {
        stytch.magicLinks.authenticate(token, {
          session_duration_minutes: 60,
        });
      }
    }
  }, [isInitialized, router, stytch, user, params]);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    if (user) {
      addUser({
        userId: user.user_id,
        firstName: user.name.first_name,
        lastName: user.name.last_name,
        email: user.emails[0].email,
      });
      router.replace(DEFAULT_ROUTE);
    }
  }, [router, user, isInitialized]);
  
  const theme = useTheme();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor={theme.palette.background.default}
    >
      <CircularProgress />
      <Typography variant="h6" mt={2}>
        Authenticating, please wait...
      </Typography>
    </Box>
  );
};

export default Authenticate;
