import Button from "@mui/material/Button";
import { styled } from "@mui/system";
import CachedIcon from "@mui/icons-material/Cached";

import { useAuthContext } from "../../providers/AuthProvider";

const ConnectButton = styled(Button)(({ theme }) => ({
  width: "200px",
  height: "55px",
  marginTop: "52px",
  textShadow: "3px 2px 3px rgb(0 0 0 / 78%)",
  borderRadius: "5px",
  fontWeight: "400",
  fontSize: "15px",
  padding: "15px 24px",
  lineHeight: 1,
  // backgroundImage: "linear-gradient(90deg, rgba(255,50,20,0.75), rgba(253, 136, 53, 0.75))",
  backgroundImage:
    // "linear-gradient(90deg, hsla(37, 100%, 50%, 0.75) 0%, hsla(48, 97%, 55%, 0.75) 100%)",
    "linear-gradient(90deg, #b68117 0%, #fffa8e 100%)",
  color: theme.palette.text.primary,
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

const SmallScreenConnectButton = styled(Button)(({ theme }) => ({
  display: "none",
  marginTop: "20px",
  marginBottom: 0,
  textShadow: "3px 2px 3px rgb(0 0 0 / 78%)",
  width: "40%",
  height: "40px",
  fontSize: "14px",
  // marginLeft: "auto",
  // marginRight: "auto",
  backgroundImage: // "linear-gradient(90deg, hsla(37, 100%, 50%, 0.75) 0%, hsla(48, 97%, 55%, 0.75) 100%)",
          "linear-gradient(90deg, #b68117 0%, #fffa8e 100%)",
  color: theme.palette.text.primary,
  [theme.breakpoints.down("md")]: {
    display: "block",
  },
}));

export function shorten(str) {
  if (str.length < 10) return str;
  return `${str.slice(0, 6)}...${str.slice(str.length - 3)}`;
}

export default function Connect({responsive = true}) {
  const { address, loading, connect, disconnect } = useAuthContext();

  return responsive ? (
    <ConnectButton
      color="secondary"
      variant="contained"
      disabled={loading}
      onClick={() => (address ? disconnect() : connect())}
    >
      {address ? shorten(address) : "Connect"} <CachedIcon  sx={{marginLeft: '10px'}} />
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
