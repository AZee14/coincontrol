"use client"
import React from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  Fade
} from "@mui/material";
import Link from "next/link";

// Icons (you can replace these with actual icons if you have them)
const InfoIcon = () => (
  <Avatar sx={{ bgcolor: 'rgba(0, 116, 228, 0.1)', color: '#0074e4', width: 56, height: 56 }}>
    <span style={{ fontSize: '24px' }}>ℹ️</span>
  </Avatar>
);

const SecurityIcon = () => (
  <Avatar sx={{ bgcolor: 'rgba(0, 116, 228, 0.1)', color: '#0074e4', width: 56, height: 56 }}>
    <span style={{ fontSize: '24px' }}>🔒</span>
  </Avatar>
);

const TrendsIcon = () => (
  <Avatar sx={{ bgcolor: 'rgba(0, 116, 228, 0.1)', color: '#0074e4', width: 56, height: 56 }}>
    <span style={{ fontSize: '24px' }}>📈</span>
  </Avatar>
);

const EducationIcon = () => (
  <Avatar sx={{ bgcolor: 'rgba(0, 116, 228, 0.1)', color: '#0074e4', width: 56, height: 56 }}>
    <span style={{ fontSize: '24px' }}>🎓</span>
  </Avatar>
);

export default function AboutPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Crypto facts
  const cryptoFacts = [
    {
      title: "Bitcoin's mysterious creator",
      content: "The identity of Bitcoin's creator, known by the pseudonym Satoshi Nakamoto, remains unknown. The mysterious figure disappeared from the internet in 2011 after creating the world's first cryptocurrency."
    },
    {
      title: "Crypto market cap",
      content: "The total cryptocurrency market cap has exceeded $2 trillion at its peak, making it comparable to the GDP of countries like Italy or Brazil."
    },
    {
      title: "Lost Bitcoin",
      content: "It's estimated that around 20% of all Bitcoin (worth billions) is lost forever due to lost private keys, forgotten passwords, or discarded hard drives."
    },
    {
      title: "First real-world purchase",
      content: "The first real-world Bitcoin transaction was for two pizzas in 2010, purchased for 10,000 BTC - worth over $300 million at today's prices."
    }
  ];

  return (
    <Container maxWidth={false} disableGutters sx={{ px: { xs: 2, sm: 4 } }}>
      {/* Hero Section */}
      <Paper
        elevation={4}
        sx={{
          background: 'linear-gradient(135deg, #f8faff 0%, #e9f1ff 100%)',
          borderRadius: { xs: '16px', md: '24px' },
          padding: { xs: '1.5rem', sm: '2rem', md: '3rem' },
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
          position: 'relative',
          maxWidth: '1400px',
          mx: 'auto',
          mb: 6,
          mt: 4,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '50%',
            height: '100%',
            background: 'radial-gradient(circle at top right, rgba(0, 116, 228, 0.08) 0%, rgba(0, 116, 228, 0) 70%)',
            zIndex: 0,
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              alignItems: "center",
              textAlign: "center",
              mb: 6
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', sm: '2.75rem', md: '3.5rem' },
                fontWeight: 800,
                letterSpacing: '-0.5px',
                background: 'linear-gradient(90deg, #1a2c50, #0074e4)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}
            >
              About Crypto Coin Control
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: '#58667e',
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                fontWeight: 400,
                maxWidth: '800px',
                lineHeight: 1.5,
                mb: 2
              }}
            >
              Your trusted platform for cryptocurrency analysis, portfolio management, and market insights in the rapidly evolving digital asset landscape.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button
                variant="contained"
                sx={{
                  borderRadius: "10px",
                  minWidth: { xs: '140px', sm: '180px' },
                  height: { xs: '48px', sm: '56px' },
                  px: { xs: 3, sm: 4 },
                  background: 'linear-gradient(90deg, #0074e4, #005bb7)',
                  boxShadow: '0 4px 14px rgba(0, 116, 228, 0.4)',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #005bb7, #004a94)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0, 116, 228, 0.5)',
                  },
                }}
                component={Link}
                href="/"
              >
                <Typography
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: { xs: '15px', sm: '16px' },
                  }}
                >
                  Back to Home
                </Typography>
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Mission Statement */}
      <Paper
        elevation={2}
        sx={{
          background: 'linear-gradient(145deg, #ffffff, #f5f9ff)',
          borderRadius: '16px',
          padding: { xs: '1.5rem', sm: '2.5rem' },
          maxWidth: '1400px',
          mx: 'auto',
          mb: 6,
          border: '1px solid rgba(210, 225, 245, 0.5)',
        }}
      >
        <Fade in={true} timeout={1000}>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#1a2c50',
                mb: 3,
                textAlign: 'center'
              }}
            >
              Our Mission
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#58667e',
                fontSize: '1.1rem',
                lineHeight: 1.8,
                maxWidth: '900px',
                mx: 'auto',
                textAlign: 'center'
              }}
            >
              At Crypto Coin Control, we believe that staying informed is the key to successful cryptocurrency investing. 
              Our platform is designed to empower investors with real-time data, professional analytics, and educational 
              resources in an accessible format. We are committed to demystifying the crypto space and helping both 
              beginners and experienced traders make informed decisions in this dynamic market.
            </Typography>
          </Box>
        </Fade>
      </Paper>

      {/* Key Features */}
      <Paper
        elevation={2}
        sx={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: { xs: '1.5rem', sm: '2.5rem' },
          maxWidth: '1400px',
          mx: 'auto',
          mb: 6,
          border: '1px solid rgba(210, 225, 245, 0.5)',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#1a2c50',
            mb: 4,
            textAlign: 'center'
          }}
        >
          Why Choose Crypto Coin Control?
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Fade in={true} timeout={1000} style={{ transitionDelay: '200ms' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                <InfoIcon />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a2c50', mb: 1 }}>
                    Real-Time Market Data
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#58667e', lineHeight: 1.7 }}>
                    Access up-to-the-minute pricing information, market trends, and trading volumes for thousands of cryptocurrencies. Our platform refreshes data continuously to ensure you always have the latest market information.
                  </Typography>
                </Box>
              </Box>
            </Fade>
          </Grid>

          <Grid item xs={12} md={6}>
            <Fade in={true} timeout={1000} style={{ transitionDelay: '400ms' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                <SecurityIcon />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a2c50', mb: 1 }}>
                    Advanced Portfolio Tracking
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#58667e', lineHeight: 1.7 }}>
                    Monitor your investments across multiple wallets and exchanges in one secure dashboard. Track performance metrics, analyze gains and losses, and generate reports to optimize your investment strategy.
                  </Typography>
                </Box>
              </Box>
            </Fade>
          </Grid>

          <Grid item xs={12} md={6}>
            <Fade in={true} timeout={1000} style={{ transitionDelay: '600ms' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                <TrendsIcon />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a2c50', mb: 1 }}>
                    Professional Analytics
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#58667e', lineHeight: 1.7 }}>
                    Leverage sophisticated charting tools, technical indicators, and market sentiment analysis to identify trends and make data-driven decisions. Our analytics suite is designed for both novice and professional traders.
                  </Typography>
                </Box>
              </Box>
            </Fade>
          </Grid>

          <Grid item xs={12} md={6}>
            <Fade in={true} timeout={1000} style={{ transitionDelay: '800ms' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                <EducationIcon />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a2c50', mb: 1 }}>
                    Educational Resources
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#58667e', lineHeight: 1.7 }}>
                    Access our comprehensive library of guides, tutorials, and market analyses to enhance your cryptocurrency knowledge. Whether you are just starting or looking to deepen your expertise, we provide resources for all skill levels.
                  </Typography>
                </Box>
              </Box>
            </Fade>
          </Grid>
        </Grid>
      </Paper>

      {/* Crypto Facts */}
      <Paper
        elevation={2}
        sx={{
          background: 'linear-gradient(145deg, #f8faff, #e9f1ff)',
          borderRadius: '16px',
          padding: { xs: '1.5rem', sm: '2.5rem' },
          maxWidth: '1400px',
          mx: 'auto',
          mb: 6,
          border: '1px solid rgba(210, 225, 245, 0.5)',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#1a2c50',
            mb: 4,
            textAlign: 'center'
          }}
        >
          Fascinating Cryptocurrency Facts
        </Typography>

        <Grid container spacing={3}>
          {cryptoFacts.map((fact, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Fade in={true} timeout={1000} style={{ transitionDelay: `${(index + 1) * 200}ms` }}>
                <Card sx={{ 
                  height: '100%', 
                  borderRadius: '12px',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a2c50', mb: 1 }}>
                      {fact.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#58667e' }}>
                      {fact.content}
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Why Stay Informed */}
      <Paper
        elevation={2}
        sx={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: { xs: '1.5rem', sm: '2.5rem' },
          maxWidth: '1400px',
          mx: 'auto',
          mb: 6,
          border: '1px solid rgba(210, 225, 245, 0.5)',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#1a2c50',
            mb: 3,
            textAlign: 'center'
          }}
        >
          Why Staying Informed Matters
        </Typography>
        
        <Typography
          variant="body1"
          sx={{
            color: '#58667e',
            fontSize: '1.05rem',
            lineHeight: 1.8,
            mb: 4
          }}
        >
          The cryptocurrency market operates 24/7 and can experience significant volatility in short periods. 
          Staying informed about market developments, regulatory changes, technological advancements, and 
          broader economic factors is essential for anyone involved in the crypto space. Here is why using a 
          platform like Crypto Coin Control is crucial:
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Fade in={true} timeout={1000} style={{ transitionDelay: '200ms' }}>
              <Box sx={{ 
                p: 3, 
                borderRadius: '12px', 
                backgroundColor: 'rgba(0, 116, 228, 0.05)',
                height: '100%'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a2c50', mb: 2 }}>
                  Market Volatility
                </Typography>
                <Typography variant="body1" sx={{ color: '#58667e' }}>
                  Cryptocurrency prices can change dramatically within minutes. Real-time monitoring tools help you 
                  respond quickly to market movements and protect your investments.
                </Typography>
              </Box>
            </Fade>
          </Grid>

          <Grid item xs={12} md={4}>
            <Fade in={true} timeout={1000} style={{ transitionDelay: '400ms' }}>
              <Box sx={{ 
                p: 3, 
                borderRadius: '12px', 
                backgroundColor: 'rgba(0, 116, 228, 0.05)',
                height: '100%'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a2c50', mb: 2 }}>
                  Regulatory Developments
                </Typography>
                <Typography variant="body1" sx={{ color: '#58667e' }}>
                  Government policies and regulations can significantly impact cryptocurrency valuations. Staying 
                  informed about these changes helps you anticipate market reactions.
                </Typography>
              </Box>
            </Fade>
          </Grid>

          <Grid item xs={12} md={4}>
            <Fade in={true} timeout={1000} style={{ transitionDelay: '600ms' }}>
              <Box sx={{ 
                p: 3, 
                borderRadius: '12px', 
                backgroundColor: 'rgba(0, 116, 228, 0.05)',
                height: '100%'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a2c50', mb: 2 }}>
                  Technological Advancements
                </Typography>
                <Typography variant="body1" sx={{ color: '#58667e' }}>
                  Blockchain technology is continuously evolving. Understanding protocol upgrades, new consensus 
                  mechanisms, and emerging projects can reveal valuable investment opportunities.
                </Typography>
              </Box>
            </Fade>
          </Grid>
        </Grid>
      </Paper>

      {/* CTA Section */}
      <Paper
        elevation={4}
        sx={{
          background: 'linear-gradient(135deg, #0074e4 0%, #004a94 100%)',
          borderRadius: '16px',
          padding: { xs: '2rem', sm: '3rem' },
          maxWidth: '1400px',
          mx: 'auto',
          mb: 6,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at bottom right, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%)',
            zIndex: 0,
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: '#ffffff',
              mb: 2,
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
            }}
          >
            Ready to Take Control of Your Crypto Journey?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.9)',
              mb: 4,
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Join thousands of investors who trust Crypto Coin Control for their cryptocurrency analytics and portfolio management needs.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              sx={{
                borderRadius: "10px",
                minWidth: { xs: '140px', sm: '180px' },
                height: { xs: '48px', sm: '56px' },
                px: { xs: 3, sm: 4 },
                background: '#ffffff',
                color: '#0074e4',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  background: '#f0f7ff',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
                },
              }}
              component={Link}
              href="/login"
            >
              <Typography
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: { xs: '15px', sm: '16px' },
                }}
              >
                Sign Up Now
              </Typography>
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderRadius: "10px",
                minWidth: { xs: '140px', sm: '180px' },
                height: { xs: '48px', sm: '56px' },
                px: { xs: 3, sm: 4 },
                borderColor: '#ffffff',
                color: '#ffffff',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: '#ffffff',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(-2px)',
                },
              }}
              component={Link}
              href="/"
            >
              <Typography
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: { xs: '15px', sm: '16px' },
                }}
              >
                Back to Home
              </Typography>
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Footer */}
      <Box
        sx={{
          textAlign: 'center',
          py: 4,
          maxWidth: '1400px',
          mx: 'auto',
        }}
      >
        <Typography variant="body2" sx={{ color: '#58667e', mb: 1 }}>
          © {new Date().getFullYear()} Crypto Coin Control. All rights reserved.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
          <Link href="/" style={{ color: '#0074e4', textDecoration: 'none' }}>Home</Link>
          <Link href="/about" style={{ color: '#0074e4', textDecoration: 'none' }}>About</Link>
          <Link href="/login" style={{ color: '#0074e4', textDecoration: 'none' }}>Login</Link>
        </Box>
      </Box>
    </Container>
  );
}