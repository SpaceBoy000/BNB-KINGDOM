import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";
import logo from "../../assets/bnbking-logo.png";
import Connect from "./Connect";
import LanguageSelect from "./LanguageSelect";


const Wrapper = styled("div")(({ theme }) => ({
  textAlign: "center",
  paddingBottom: 24,
  [theme.breakpoints.down("md")]: {
    h5: {
      fontSize: 20,
      margin: 0,
    },
  },
}));

const LaunchTitle = styled("h3")(({ theme }) => ({
  // color: ${props => props.theme.textPrimary};
  marginTop: "10px",
  width: "100%",
  textAlign: "center",
  fontWeight: "bolder",
  color: "white",
}));

const Countdown = styled("h3")(({ theme }) => ({
  // color: ${props => props.theme.textPrimary};
  width: "100%",
  textAlign: "center",
  fontWeight: "bolder",
  color: "white",
  [theme.breakpoints.down("md")]: {
    fontSize: 15,
  },
}));

export default function Header() {

  const [countdown, setCountdown] = useState({
    alive: true,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  const getCountdown = (deadline) => {
    const now = Date.now() / 1000;
    const total = deadline - now;
    const seconds = Math.floor((total) % 60);
    const minutes = Math.floor((total / 60) % 60);
    const hours = Math.floor((total / (60 * 60)) % 24);
    const days = Math.floor(total / (60 * 60 * 24));

    return {
        total,
        days,
        hours,
        minutes,
        seconds
    };
  }

  useEffect(() => {
    const interval = setInterval(() => {
        try {
            const data = getCountdown(1653746400)
            setCountdown({
                alive: data.total > 0,
                days: data.days,
                hours: data.hours,
                minutes: data.minutes,
                seconds: data.seconds
            })
        } catch (err) {
            console.log(err);
        }
    }, 1000);

    return () => clearInterval(interval);
  }, [])

  return (
    <Box
      component="div"
      sx={{ px: { lg: 0, xs: 2 }, maxWidth: "calc(100% - 10%)", mx: "auto", zIndex:"1" }}
    >
      <Wrapper>
        <div className="header_logo">
          <img src={logo} alt="" width={"600px"} />
        </div>

        <Box sx={{ display:"flex", }}>
          {/* <LanguageSelect responsive = {false}/> */}
          <Connect responsive = {false}/>
        </Box>

        {/* <Box sx={{ textAlign: "right"}}>
        </Box> */}

        {/* { countdown.alive && 
          <>
            <LaunchTitle>WE'RE LAUNCHING SOON</LaunchTitle>
            <Countdown>
              {`${countdown.days} Days, ${countdown.hours} Hours, ${countdown.minutes} Mins & ${countdown.seconds} Secs`}
            </Countdown>
          </>
        } */}
      </Wrapper>
    </Box>
  );
}
