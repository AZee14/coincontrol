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
  alpha
} from "@mui/material";
import Link from "next/link";
import logo from "@/./app/icon.jpg";
import Image from "next/image";
import { COIN_POST_REQUEST_TIME } from "@/utils/constants";
import { updateCoins } from "@/utils/coins";
import { updateDexExchanges, updateDexPairs } from "@/utils/dex";
import { Home, User, Info, Bell, ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';

// Navigation links with icons
const navigationLinks = [
  { name: "Home", href: "/", icon: <Home size={18} /> },
  { name: "Portfolio", href: "/portfolio", icon: <User size={18} /> },
  { name: "About", href: "/about", icon: <Info size={18} /> },
];

const settings = [
  { name: "Profile", href: "/profile" },
  { name: "Settings", href: "/settings" },
];

function AppBar() {
  const stytch = useStytch();
  const { user, isInitialized } = useStytchUser();
  const pathname = usePathname();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isLoggedIn = isInitialized && user;

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [anchorElNotif, setAnchorElNotif] = React.useState<null | HTMLElement>(null);

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
  //   updateCoins();
  //   // updateDexExchanges();
  //   // updateDexPairs();

  //   // then schedule
  //   const interval = setInterval(() => {
  //     updateCoins();
  //     // updateDexExchanges();
  //     // updateDexPairs();
  //   }, COIN_POST_REQUEST_TIME);

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <MuiAppBar
      position="sticky"
      elevation={1}
      sx={{
        backgroundColor: "white",
        color: theme.palette.primary.main,
        borderBottom: `1px solid ${alpha('#000', 0.06)}`,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: { xs: '64px', md: '72px' } }}>
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
                color: "#21527b",
                textDecoration: "none",
                ml: 1,
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
              color="inherit"
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
                  borderRadius: '8px',
                }
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
                    borderRadius: '4px',
                    mx: 1,
                    my: 0.5,
                    '&.Mui-selected': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ color: pathname === link.href ? theme.palette.primary.main : 'inherit', mr: 1.5 }}>
                      {link.icon}
                    </Box>
                    <Typography>{link.name}</Typography>
                  </Box>
                </MenuItem>
              ))}
              
              <Divider sx={{ my: 1 }} />
              
              <MenuItem
                onClick={(event) => {
                  handleCloseNavMenu();
                  if (isLoggedIn) {
                    stytch.session.revoke();
                  }
                }}
                component={Link}
                href={isLoggedIn ? "/" : "/login"}
                sx={{ mx: 1, borderRadius: '4px' }}
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
              fontSize: { xs: '1rem', sm: '1.25rem' },
              letterSpacing: ".05rem",
              textDecoration: "none",
              ml: 1.5,
              color: "#21527b",
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
                  color: pathname === link.href ? "white" : theme.palette.primary.main,
                  display: "flex",
                  fontWeight: 500,
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  '&:hover': {
                    backgroundColor: pathname === link.href 
                      ? theme.palette.primary.dark 
                      : alpha(theme.palette.primary.main, 0.08),
                  }
                }}
              >
                {link.name}
              </Button>
            ))}
          </Box>

          {/* Notifications */}
          <Box sx={{ display: 'flex', mr: 2 }}>
            <Tooltip title="Notifications">
              <IconButton 
                onClick={handleOpenNotifMenu}
                size="large"
                sx={{ 
                  color: theme.palette.text.secondary,
                  border: Boolean(anchorElNotif) ? `1px solid ${alpha(theme.palette.primary.main, 0.5)}` : 'none',
                  bgcolor: Boolean(anchorElNotif) ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                }}
              >
                <Badge badgeContent={3} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem' } }}>
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
              <Paper elevation={4} sx={{ width: 320, mt: 1.5, borderRadius: '10px', overflow: 'hidden' }}>
                <ClickAwayListener onClickAway={handleCloseNotifMenu}>
                  <Box>
                    <Box sx={{ p: 2, borderBottom: `1px solid ${alpha('#000', 0.06)}` }}>
                      <Typography variant="subtitle1" fontWeight={600}>Notifications</Typography>
                    </Box>
                    <Box sx={{ maxHeight: 320, overflow: 'auto' }}>
                      <MenuItem sx={{ py: 1.5 }}>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>Bitcoin price alert</Typography>
                          <Typography variant="caption" color="text.secondary">BTC is up 5% in the last hour</Typography>
                        </Box>
                      </MenuItem>
                      <MenuItem sx={{ py: 1.5 }}>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>Portfolio update</Typography>
                          <Typography variant="caption" color="text.secondary">Your assets increased by 3.2% today</Typography>
                        </Box>
                      </MenuItem>
                      <MenuItem sx={{ py: 1.5 }}>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>New feature available</Typography>
                          <Typography variant="caption" color="text.secondary">Try our advanced trading tools</Typography>
                        </Box>
                      </MenuItem>
                    </Box>
                    <Box sx={{ p: 1.5, borderTop: `1px solid ${alpha('#000', 0.06)}`, textAlign: 'center' }}>
                      <Link href="/notifications" style={{ textDecoration: 'none' }}>
                        <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
                          View all notifications
                        </Typography>
                      </Link>
                    </Box>
                  </Box>
                </ClickAwayListener>
              </Paper>
            </Popper>
          </Box>

          {/* User menu */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title={isLoggedIn ? "Account settings" : "Login"}>
              <Button
                onClick={handleOpenUserMenu}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  border: Boolean(anchorElUser) ? `1px solid ${alpha(theme.palette.primary.main, 0.5)}` : 'none',
                  bgcolor: Boolean(anchorElUser) ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                }}
                endIcon={<ChevronDown size={16} />}
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32,
                    bgcolor: isLoggedIn ? theme.palette.primary.main : 'rgba(0,0,0,0.12)',
                    mr: 1
                  }}
                >
                  {user?.name?.first_name?.charAt(0) || ''}
                </Avatar>
                {!isMobile && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 500,
                      display: { xs: 'none', sm: 'block' }
                    }}
                  >
                    {isLoggedIn ? (user?.name?.first_name || 'User') : 'Login'}
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
                  borderRadius: '10px',
                  overflow: 'hidden'
                }}
              >
                <ClickAwayListener onClickAway={handleCloseUserMenu}>
                  <Box>
                    {isLoggedIn && (
                      <Box sx={{ p: 2, borderBottom: `1px solid ${alpha('#000', 0.06)}` }}>
                        <Typography variant="body2" color="text.secondary">Signed in as</Typography>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {user?.name?.first_name || 'User'}
                        </Typography>
                      </Box>
                    )}
                    
                    <MenuList sx={{ py: 0.5 }}>
                      {isLoggedIn ? (
                        <>
                          {settings.map((setting) => (
                            <MenuItem
                              key={setting.name}
                              component={Link}
                              href={setting.href}
                              onClick={handleCloseUserMenu}
                              sx={{
                                py: 1.5,
                                px: 2,
                                borderRadius: '4px',
                                mx: 0.5,
                                my: 0.25
                              }}
                            >
                              <Typography variant="body2">{setting.name}</Typography>
                            </MenuItem>
                          ))}
                          
                          <Divider sx={{ my: 0.75 }} />
                          
                          <MenuItem
                            onClick={(event) => {
                              handleCloseUserMenu();
                              stytch.session.revoke();
                            }}
                            sx={{ 
                              py: 1.5,
                              px: 2,
                              color: theme.palette.error.main,
                              borderRadius: '4px',
                              mx: 0.5,
                              my: 0.25,
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.error.main, 0.08)
                              }
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
                            px: 2
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