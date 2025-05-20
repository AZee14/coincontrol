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
import {
  Badge,
  Button,
  ClickAwayListener,
  Divider,
  MenuList,
  Paper,
  Popper,
  useMediaQuery,
  alpha,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";
import logo from "@/./app/icon.jpg";
import Image from "next/image";
import {
  COIN_POST_REQUEST_TIME,
  NOTIFICATION_CHECK_TIME,
} from "@/utils/constants";
import { updateCoins } from "@/utils/coins";
import { updateDexExchanges, updateDexPairs } from "@/utils/dex";
import { Home, User, Info, Bell, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { startAssetNotificationChecker } from "@/utils/assetNotifications";

// Navigation links with icons
const navigationLinks = [
  { name: "Home", href: "/", icon: <Home size={18} /> },
  { name: "Portfolio", href: "/portfolio", icon: <User size={18} /> },
  { name: "About", href: "/about", icon: <Info size={18} /> },
];

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { db: { schema: "cryptothing" } }
);

function AppBar() {
  const stytch = useStytch();
  const { user, isInitialized } = useStytchUser();
  const [notifs, setNotifs] = React.useState<Array<any>>([]);
  const [notificationLoading, setNotificationLoading] = React.useState(false);
  const router = useRouter();

  const pathname = usePathname();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const isLoggedIn = isInitialized && user;

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElNotif, setAnchorElNotif] = React.useState<null | HTMLElement>(
    null
  );

  // 4. Enhanced handler for notification click
  const handleNotificationClick = (notification: any) => {
    // Handle navigation based on notification type and related entity
    // if (
    //   notification.related_entity_type === "coin" &&
    //   notification.related_entity_id
    // ) {
    //   router.push(`/coins/${notification.related_entity_id}`);
    // } else if (
    //   notification.related_entity_type === "portfolio" &&
    //   notification.related_entity_id
    // ) {
    //   router.push(`/portfolio/${notification.related_entity_id}`);
    // } else if (
    //   notification.related_entity_type === "transaction" &&
    //   notification.related_entity_id
    // ) {
    //   router.push(`/transactions/${notification.related_entity_id}`);
    // }

    // Mark as read if not already
    if (!notification.is_read) {
      supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notification.id)
        .then(() => {
          setNotifs((prev) => prev.filter((n) => n.id !== notification.id));
        });
    }

    handleCloseNotifMenu();
  };

  // 5. Add function to clear all notifications
  const handleClearAllNotifications = () => {
    if (notifs.length === 0) return;

    supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user?.user_id)
      .eq("is_read", false)
      .then(() => {
        setNotifs([]);
        handleCloseNotifMenu();
      });
  };

  const fetchNotis = React.useCallback(() => {
    if (!user?.user_id) return;

    setNotificationLoading(true);
    supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.user_id)
      .eq("is_read", false)
      .order("created_at", { ascending: false })
      .limit(10) // Limit to avoid loading too many
      .then(({ data, error }) => {
        if (error) console.error("Error fetching notifications:", error);
        setNotifs(data || []);
        setNotificationLoading(false);
      });
  }, [user?.user_id]);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(anchorElNav ? null : event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(anchorElUser ? null : event.currentTarget);
  };

  const handleOpenNotifMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNotif(anchorElNotif ? null : event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleCloseNotifMenu = () => {
    setAnchorElNotif(null);
  };

  // UNCOMMENT THIS
  // React.useEffect(() => {
  //   // run immediately
  //   // updateCoins();
  //   // updateDexExchanges();
  //   // updateDexPairs();

  //   // then schedule
  //   const interval = setInterval(() => {
  //     updateCoins();
  //     updateDexExchanges();
  //     updateDexPairs();
  //   }, COIN_POST_REQUEST_TIME);

  //   return () => clearInterval(interval);
  // }, []);
  React.useEffect(() => {
    fetchNotis();

    const interval = setInterval(() => {
      fetchNotis();
    }, NOTIFICATION_CHECK_TIME);

    return () => clearInterval(interval);
  }, [fetchNotis]);

  React.useEffect(() => {
    startAssetNotificationChecker(supabase);
  }, []);

  return (
    <MuiAppBar
      position="sticky"
      elevation={4}
      sx={{
        backgroundColor: "#1a0033",
        color: "#ff00ff",
        borderBottom: `1px solid ${alpha("#ff00ff", 0.15)}`,
        boxShadow: "0 4px 20px rgba(255, 0, 255, 0.15)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: { xs: "64px", md: "72px" } }}>
          {/* Logo for desktop */}
          <Link
            href="/"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <Box sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}>
              <Image
                alt="logo"
                src={logo}
                width={2048}
                height={2048}
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  borderRadius: "8px",
                  boxShadow: "0 0 10px rgba(255, 0, 255, 0.5)",
                }}
                priority
              />
            </Box>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                mr: 3,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".1rem",
                background: "linear-gradient(90deg, #ff00ff, #00ffff)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textDecoration: "none",
                ml: 1,
                textShadow: "0 0 10px rgba(255, 0, 255, 0.5)",
              }}
            >
              Crypto Coin Control
            </Typography>
          </Link>

          {/* Mobile menu icon */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="navigation menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ color: "#ff00ff" }}
              edge="start"
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
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1.5,
                  width: 200,
                  borderRadius: "8px",
                  backgroundColor: "#2d0a4f",
                  border: "1px solid rgba(255, 0, 255, 0.2)",
                  boxShadow: "0 4px 20px rgba(255, 0, 255, 0.25)",
                },
              }}
            >
              {navigationLinks.map((link) => (
                <MenuItem
                  key={link.name}
                  onClick={handleCloseNavMenu}
                  component={Link}
                  href={link.href}
                  selected={pathname === link.href}
                  sx={{
                    borderRadius: "4px",
                    mx: 1,
                    my: 0.5,
                    color: "#c4a8ff",
                    "&.Mui-selected": {
                      backgroundColor: alpha("#ff00ff", 0.15),
                      color: "#ff00ff",
                    },
                    "&:hover": {
                      backgroundColor: alpha("#ff00ff", 0.1),
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      sx={{
                        color:
                          pathname === link.href
                            ? "#ff00ff"
                            : "#c4a8ff",
                        mr: 1.5,
                      }}
                    >
                      {link.icon}
                    </Box>
                    <Typography>{link.name}</Typography>
                  </Box>
                </MenuItem>
              ))}

              <Divider sx={{ my: 1, borderColor: "rgba(255, 0, 255, 0.15)" }} />

              <MenuItem
                onClick={(event) => {
                  handleCloseNavMenu();
                  if (isLoggedIn) {
                    stytch.session.revoke();
                  }
                }}
                component={Link}
                href={isLoggedIn ? "/" : "/login"}
                sx={{ 
                  mx: 1, 
                  borderRadius: "4px",
                  color: "#c4a8ff",
                  "&:hover": {
                    backgroundColor: alpha("#ff00ff", 0.1),
                  },
                }}
              >
                <Typography>{isLoggedIn ? "Logout" : "Login"}</Typography>
              </MenuItem>
            </Menu>
          </Box>

          {/* Logo for mobile */}
          <Box sx={{ display: { xs: "flex", md: "none" }, flexGrow: 0 }}>
            <Image
              alt="logo"
              src={logo}
              width={2048}
              height={2048}
              style={{
                width: "2.25rem",
                height: "2.25rem",
                borderRadius: "6px",
                boxShadow: "0 0 8px rgba(255, 0, 255, 0.5)",
              }}
              priority
            />
          </Box>

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              fontSize: { xs: "1rem", sm: "1.25rem" },
              letterSpacing: ".05rem",
              textDecoration: "none",
              ml: 1.5,
              background: "linear-gradient(90deg, #ff00ff, #00ffff)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Crypto Coin Control
          </Typography>

          {/* Desktop navigation links */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
              gap: 1,
            }}
          >
            {navigationLinks.map((link) => (
              <Button
                key={link.name}
                component={Link}
                href={link.href}
                onClick={handleCloseNavMenu}
                variant={pathname === link.href ? "contained" : "text"}
                startIcon={link.icon}
                sx={{
                  my: 2,
                  px: 2.5,
                  color:
                    pathname === link.href
                      ? "#1a0033"
                      : "#c4a8ff",
                  display: "flex",
                  fontWeight: 500,
                  borderRadius: "8px",
                  textTransform: "none",
                  fontSize: "0.95rem",
                  backgroundColor: pathname === link.href ? "#ff00ff" : "transparent",
                  "&:hover": {
                    backgroundColor:
                      pathname === link.href
                        ? "#ff33ff"
                        : alpha("#ff00ff", 0.1),
                    boxShadow: pathname === link.href ? "0 0 15px rgba(255, 0, 255, 0.5)" : "none",
                  },
                }}
              >
                {link.name}
              </Button>
            ))}
          </Box>

          {/* Notifications */}
          <Box sx={{ display: "flex", mr: 2 }}>
            <Tooltip title="Notifications">
              <IconButton
                onClick={handleOpenNotifMenu}
                size="large"
                sx={{
                  color: "#c4a8ff",
                  border: Boolean(anchorElNotif)
                    ? `1px solid ${alpha("#ff00ff", 0.5)}`
                    : "none",
                  bgcolor: Boolean(anchorElNotif)
                    ? alpha("#ff00ff", 0.1)
                    : "transparent",
                  "&:hover": {
                    bgcolor: alpha("#ff00ff", 0.08),
                  },
                }}
              >
                <Badge badgeContent={notifs.length} color="error">
                  <Bell size={20} />
                </Badge>
              </IconButton>
            </Tooltip>
            <Popper
              open={Boolean(anchorElNotif)}
              anchorEl={anchorElNotif}
              placement="bottom-end"
              disablePortal
              sx={{ zIndex: 1300 }}
            >
              <Paper
                elevation={4}
                sx={{
                  width: 320,
                  mt: 1.5,
                  borderRadius: "10px",
                  overflow: "hidden",
                  backgroundColor: "#2d0a4f",
                  border: "1px solid rgba(255, 0, 255, 0.2)",
                  boxShadow: "0 4px 20px rgba(255, 0, 255, 0.25)",
                }}
              >
                <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      px: 2,
                      py: 1,
                      borderBottom: `1px solid ${alpha("#ff00ff", 0.15)}`,
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight={600} sx={{ color: "#f2e6ff" }}>
                      Notifications
                    </Typography>
                    {notifs.length > 0 && (
                      <Button
                        size="small"
                        onClick={handleClearAllNotifications}
                        sx={{ 
                          fontSize: "0.75rem",
                          color: "#00ffff",
                          "&:hover": {
                            backgroundColor: alpha("#00ffff", 0.1),
                          }
                        }}
                      >
                        Clear all
                      </Button>
                    )}
                  </Box>

                  {notificationLoading ? (
                    <Box sx={{ p: 2, textAlign: "center" }}>
                      <CircularProgress size={24} sx={{ color: "#ff00ff" }} />
                    </Box>
                  ) : (
                    <MenuList sx={{ py: 0.5 }}>
                      {notifs.map((notification) => (
                        <MenuItem
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          sx={{
                            py: 1.5,
                            px: 2,
                            borderRadius: "4px",
                            mx: 0.5,
                            my: 0.25,
                            whiteSpace: "normal",
                            color: "#c4a8ff",
                            "&:hover": {
                              backgroundColor: alpha("#ff00ff", 0.1),
                            },
                          }}
                        >
                          <Box>
                            <Typography variant="body2" fontWeight={500} sx={{ color: "#f2e6ff" }}>
                              {notification.message}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mt: 0.5,
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{ color: "#c4a8ff" }}
                              >
                                {formatDistanceToNow(
                                  new Date(notification.created_at),
                                  { addSuffix: true }
                                )}
                              </Typography>
                              {notification.type && (
                                <Typography
                                  component="span"
                                  variant="caption"
                                  sx={{
                                    px: 1,
                                    py: 0.25,
                                    borderRadius: "4px",
                                    backgroundColor: (() => {
                                      switch (notification.type) {
                                        case "profit":
                                          return alpha(
                                            "#33ff33",
                                            0.15
                                          );
                                        case "loss":
                                          return alpha(
                                            "#ff3333",
                                            0.15
                                          );
                                        case "Buy":
                                          return alpha(
                                            "#00ffff",
                                            0.15
                                          );
                                        case "Sell":
                                          return alpha(
                                            "#ffcc00",
                                            0.15
                                          );
                                        case "transaction":
                                          return alpha(
                                            "#00ffff",
                                            0.15
                                          );
                                        case "price_alert":
                                          return alpha(
                                            "#33ff33",
                                            0.15
                                          );
                                        case "portfolio":
                                          return alpha(
                                            "#ffcc00",
                                            0.15
                                          );
                                        default:
                                          return alpha(
                                            "#ff00ff",
                                            0.15
                                          );
                                      }
                                    })(),
                                    color: (() => {
                                      switch (notification.type) {
                                        case "profit":
                                          return "#33ff33";
                                        case "loss":
                                          return "#ff3333";
                                        case "Buy":
                                          return "#00ffff";
                                        case "Sell":
                                          return "#ffcc00";
                                        case "transaction":
                                          return "#00ffff";
                                        case "price_alert":
                                          return "#33ff33";
                                        case "portfolio":
                                          return "#ffcc00";
                                        default:
                                          return "#ff00ff";
                                      }
                                    })(),
                                  }}
                                >
                                  {/* Capitalize the first letter */}
                                  {notification.type.charAt(0).toUpperCase() +
                                    notification.type.slice(1)}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </MenuItem>
                      ))}
                      {notifs.length === 0 && (
                        <MenuItem disabled sx={{ py: 2 }}>
                          <Box sx={{ textAlign: "center", width: "100%" }}>
                            <Typography variant="body2" sx={{ color: "#c4a8ff" }}>
                              No new notifications
                            </Typography>
                          </Box>
                        </MenuItem>
                      )}
                    </MenuList>
                  )}
                </Box>
              </Paper>
            </Popper>
          </Box>

          {/* User menu */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title={isLoggedIn ? "Account settings" : "Login"}>
              <Button
                onClick={handleOpenUserMenu}
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  border: Boolean(anchorElUser)
                    ? `1px solid ${alpha("#ff00ff", 0.5)}`
                    : "none",
                  bgcolor: Boolean(anchorElUser)
                    ? alpha("#ff00ff", 0.1)
                    : "transparent",
                  color: "#c4a8ff",
                  "&:hover": {
                    bgcolor: alpha("#ff00ff", 0.08),
                  },
                }}
                endIcon={<ChevronDown size={16} />}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: isLoggedIn
                      ? "#ff00ff"
                      : "rgba(255, 0, 255, 0.3)",
                    mr: 1,
                    boxShadow: isLoggedIn ? "0 0 8px rgba(255, 0, 255, 0.5)" : "none",
                  }}
                >
                  {user?.name?.first_name?.charAt(0) || ""}
                </Avatar>
                {!isMobile && (
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      display: { xs: "none", sm: "block" },
                      color: "#f2e6ff",
                    }}
                  >
                    {isLoggedIn ? user?.name?.first_name || "User" : "Login"}
                  </Typography>
                )}
              </Button>
            </Tooltip>
            <Popper
              open={Boolean(anchorElUser)}
              anchorEl={anchorElUser}
              placement="bottom-end"
              disablePortal
              sx={{ zIndex: 1300 }}
            >
              <Paper
                elevation={4}
                sx={{
                  mt: 1.5,
                  minWidth: 200,
                  borderRadius: "10px",
                  overflow: "hidden",
                  backgroundColor: "#2d0a4f",
                  border: "1px solid rgba(255, 0, 255, 0.2)",
                  boxShadow: "0 4px 20px rgba(255, 0, 255, 0.25)",
                }}
              >
                <ClickAwayListener onClickAway={handleCloseUserMenu}>
                  <Box>
                    {isLoggedIn && (
                      <Box
                        sx={{
                          p: 2,
                          borderBottom: `1px solid ${alpha("#ff00ff", 0.15)}`,
                        }}
                      >
                        <Typography variant="body2" sx={{ color: "#c4a8ff" }}>
                          Signed in as
                        </Typography>
                        <Typography variant="subtitle2" fontWeight={600} sx={{ color: "#f2e6ff" }}>
                          {user?.name?.first_name || "User"}
                        </Typography>
                      </Box>
                    )}

                    <MenuList sx={{ py: 0.5 }}>
                      {isLoggedIn ? (
                        <>
                          <MenuItem
                            onClick={(event) => {
                              handleCloseUserMenu();
                              stytch.session.revoke();
                            }}
                            sx={{
                              py: 1.5,
                              px: 2,
                              color: "#ff3333",
                              borderRadius: "4px",
                              mx: 0.5,
                              my: 0.25,
                              "&:hover": {
                                backgroundColor: alpha(
                                  "#ff3333",
                                  0.1
                                ),
                              },
                            }}
                          >
                            <Typography variant="body2">Logout</Typography>
                          </MenuItem>
                        </>
                      ) : (
                        <MenuItem
                          component={Link}
                          href="/login"
                          onClick={handleCloseUserMenu}
                          sx={{
                            py: 1.5,
                            px: 2,
                            color: "#00ffff",
                            "&:hover": {
                              backgroundColor: alpha("#00ffff", 0.1),
                            },
                          }}
                        >
                          <Typography variant="body2">Login</Typography>
                        </MenuItem>
                      )}
                    </MenuList>
                  </Box>
                </ClickAwayListener>
              </Paper>
            </Popper>
          </Box>
        </Toolbar>
      </Container>
    </MuiAppBar>
  );
}

export default AppBar;