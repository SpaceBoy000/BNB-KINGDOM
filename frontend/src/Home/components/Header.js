import { useRef } from "react";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import Connect from "./Connect";

const Wrapper = styled("div")(({ theme }) => ({
  // textAlign:"center",
  padding: "20px 70px",
  display: "flex",
  justifyContent:"space-between",
  alignItems: 'center',
  [theme.breakpoints.down("md")]: {
    padding: "20px 0px",
    h5: {
      fontSize: 20,
      margin: 0,
    },
  },
}));

export default function Header() {
  const vidRef = useRef(null);
  return (
    <Wrapper>
      <img src="./img/header.png" alt="" className="logo"/>
      <Connect/>
    </Wrapper>
  );
}
