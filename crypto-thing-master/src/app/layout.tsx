import type { Metadata } from "next";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/app/theme";
import AppBar from "@/components/Appbar";
import StytchProvider from "@/components/StytchProvider";

export const metadata: Metadata = {
  title: "Coin Control",
  description: "Developed by Shehryar & Ali Zain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <StytchProvider>
            <AppBar />
            <main>
              <ThemeProvider theme={theme}>{children}</ThemeProvider>
            </main>
          </StytchProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
