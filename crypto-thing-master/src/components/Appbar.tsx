"use client";
import * as React from "react";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import theme from "../app/theme";
import { useStytch, useStytchUser } from "@stytch/nextjs";
import { ClickAwayListener, MenuList, Paper, Popper } from "@mui/material";
import Link from "next/link";
import logo from "@/./app/icon.jpg";
import Image from "next/image";
import { COIN_POST_REQUEST_TIME } from "@/utils/constants";
import { updateCoins } from "@/utils/coins";
import { updateDexExchanges, updateDexPairs } from "@/utils/dex";

const pages = ["Products", "Pricing", "Blog"];
const settings = [
  { name: "Profile", href: "/profile" },
  // { name: "Dashboard", href: DashboardClick },
];

function AppBar() {
  const stytch = useStytch();
  const { user, isInitialized } = useStytchUser();

  const isLoggedIn = isInitialized && user;

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElLang, setAnchorElLang] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(anchorElNav ? null : event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(anchorElUser ? null : event.currentTarget);
  };
  const handleOpenLangMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElLang(anchorElLang ? null : event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // UNCOMMENT THIS
  // React.useEffect(() => {
  //   // run immediately
  //   // updateCoins();
  //   // updateDexExchanges()
  //   // updateDexPairs()

  //   // then schedule
  //   const interval = setInterval(() => {
  //     // updateCoins();
  //     // updateDexExchanges()
  //   // updateDexPairs()
  //   }, COIN_POST_REQUEST_TIME);

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <MuiAppBar
      position="sticky"
      sx={{
        backgroundColor: "white",
        color: theme.palette.primary.main,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link
            href="/"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <Image
                alt="logo"
                src={logo}
                width={2048}
                height={2048}
                style={{
                  width: "3rem",
                  height: "3rem",
                  display: "flex",
                }}
              />
            </Box>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "#21527b",
                textDecoration: "none",
                ml: 2,
              }}
            >
              Crypto Coin Control
            </Typography>
          </Link>

          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {/* {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))} */}
            </Menu>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <Image
              alt="logo"
              src={logo}
              width={2048}
              height={2048}
              style={{
                width: "3.5rem",
                height: "3.5rem",
                display: "flex",
              }}
            />
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 5,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              textDecoration: "none",
              ml: 2,
              color: "#21527b",
            }}
          >
            Crypto Coin Control
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              mr: 2,
              display: {
                xs: "none",
                md: "flex",
                flexDirection: "row-reverse",
              },
            }}
          ></Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {user ? (
                  <Avatar>{user?.name?.first_name.charAt(0)}</Avatar>
                ) : (
                  <Avatar />
                )}
              </IconButton>
            </Tooltip>
            <Popper
              disablePortal
              open={Boolean(anchorElUser)}
              anchorEl={anchorElUser}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleCloseUserMenu}>
                  <MenuList id="menu-appbar">
                    {settings.map((setting) => (
                      <MenuItem
                        key={setting.name}
                        onClick={handleCloseUserMenu}
                      >
                        <Link href={setting.href}>
                          <Typography textAlign="center">
                            {setting.name}
                          </Typography>
                        </Link>
                      </MenuItem>
                    ))}
                    <MenuItem
                      key={"Log"}
                      onClick={(event: any) => {
                        handleCloseUserMenu();
                        if (isLoggedIn) {
                          stytch.session.revoke();
                          event.preventDefault();
                        }
                      }}
                    >
                      {/* <Link> */}
                      <Link href="/login">
                        <Typography textAlign="center">
                          {isLoggedIn ? "Logout" : "Login"}
                        </Typography>
                      </Link>
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Popper>
          </Box>
        </Toolbar>
      </Container>{" "}
    </MuiAppBar>
  );
}
export default AppBar;
