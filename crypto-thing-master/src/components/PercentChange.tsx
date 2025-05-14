import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { Typography } from "@mui/material";

export const PercentChange = ({
  value,
  children,
}: {
  value: number;
  children?: React.ReactNode;
}) => {
  const isPositive = value >= 0;
  return (
    <Typography
      sx={{
        color: value > 0 ? "#16c784" : "#ea3943",
        fontSize: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      {value > 0 ? <ArrowDropUp /> : <ArrowDropDown />}
      {children}
    </Typography>
  );
};
