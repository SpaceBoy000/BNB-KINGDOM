import Button from "@mui/material/Button";
import { styled } from "@mui/system";

import { useAuthContext } from "../../providers/AuthProvider";

const ConnectButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(94.11deg, #1e3d65 0%, rgb(32 25 92) 100%)",
  width:"180px",
  height:"50px",
  border: "1px solid #2D6D80",
  borderRadius: "8px",
  // padding: "20px",
  fontFamily: "Inter",
  float: "right",
  fontStyle: "normal",
  fontWeight: "500",
  fontSize: "18px",
  lineHeight: "20px",
  /* identical to box height, or 100% */
  // letterSpacing: "0.0703846px",
  color: "#3BD0D8 !important",

  [theme.breakpoints.down("md")]: {
    // display: "none",
    width:"120px",
  },
  // '&:hover' : {

  // }
}));

const SmallScreenConnectButton = styled(Button)(({ theme }) => ({
  display: "none",
  marginTop: "20px",
  marginBottom: 48,
  width: "95%",
  marginLeft: "auto",
  marginRight: "auto",
  background: "linear-gradient(94.11deg, #1E3E65 0%, rgba(30, 62, 101, 0) 100%)",
  [theme.breakpoints.down("md")]: {
    // display: "block",
  },
}));

export function shorten(str) {
  if (str.length < 10) return str;
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}

export default function Connect({ responsive = true }) {
  const { address, loading, connect, disconnect } = useAuthContext();
  
  return true ? (
    <ConnectButton
      color="secondary"
      variant="contained"
      disabled={loading}
      className="mybutton"
      onClick={() => (address ? disconnect() : connect())}
    >
      {address ? shorten(address) : "Connect"}
    </ConnectButton>
  ) : (
    <SmallScreenConnectButton
      color="secondary"
      variant="contained"
      disabled={loading}
      onClick={() => (address ? disconnect() : connect())}
    >
      {address ? shorten(address) : "Connect"}
    </SmallScreenConnectButton>
  );
}
