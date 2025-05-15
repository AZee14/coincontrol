import {
  Container,
  Paper,
  Skeleton,
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

function SkeletonAllCurrencies() {
  return (
    <Container maxWidth={false} disableGutters sx={{ px: { xs: 2, sm: 4 } }}>
      <Paper
        elevation={4}
        sx={{
          background: "linear-gradient(135deg, #f8faff 0%, #e9f1ff 100%)",
          borderRadius: { xs: "16px", md: "24px" },
          padding: { xs: "2rem", sm: "3rem", md: "4rem" },
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
          textAlign: "center",
          maxWidth: "1400px",
          mx: "auto",
          my: 6,
        }}
      >

        {/* Cards */}
        <Grid container spacing={2} justifyContent="center" sx={{ mb: 6 }}>
          {[...Array(4)].map((_, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Skeleton
                variant="rectangular"
                height={160}
                sx={{ borderRadius: 2 }}
              />
            </Grid>
          ))}
        </Grid>

        {/* Table */}
        <Table>
          <TableHead>
            <TableRow>
              {[...Array(4)].map((_, i) => (
                <TableCell key={i}>
                  <Skeleton variant="text" width="80%" />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(5)].map((_, row) => (
              <TableRow key={row}>
                {[...Array(4)].map((_, col) => (
                  <TableCell key={col}>
                    <Skeleton variant="text" width="90%" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}

export default SkeletonAllCurrencies;
