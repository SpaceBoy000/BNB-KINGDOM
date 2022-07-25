import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import backgroundImage from "../assets/bg-img.png";
import BakeCard from "./components/BakeCard";
import Header from "./components/Header";
import { styled } from "@mui/system";

const MainBox = styled(Box)(
  ({theme}) => `
    // background: url(../assets/bg-img.png);
    // background-size: cover;
    // background-position: center center;
    // background-repeat: "no-repeat";
    // background-attachment: fixed !important;
    // min-height: 100vh;

    @media only screen and (max-width: 767px) {
      background-attachment: initial ;
    }
`);

const BKDiv = styled(Box)(
  ({theme}) => `
    display: none;
    width: 100%;
    height: 120vh;
    top: 0;
    left: 0;
    position: fixed;
    z-index: 0;
    background-size: cover;
    background-position: center center;
    // background-repeat: "no-repeat";
    // background-attachment: fixed !important;
    // min-height: 100vh;

    @media only screen and (max-width: 767px) {
      display: block;
    }
`);

const Countdown = styled("h3")(({ theme }) => ({
  // color: ${props => props.theme.textPrimary};
  position: "absolute",
  width: "100%",
  height: "45px",
  backgroundImage: "linear-gradient(90deg, hsl(182deg 100% 50%) 0%, hsl(141deg 97% 55%) 100%)",
  opacity:"0.4",
  [theme.breakpoints.down("md")]: {
    fontSize: 20,
  },
}));

export default function Home() {
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
            const data = getCountdown(1659024000)
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
    <>
      <MainBox
        component="div"
        sx={{
          background: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          textAlign: "right",
          minHeight: "100vh",
        }}
      >
        <BKDiv
          sx={{
            background: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            // backgroundAttachment: "fixed",
            // textAlign: "right",
            // minHeight: "100vh",
          }}
        />
        <div style={{marginBottom:"-30px"}}>
          { countdown.alive && 
            <>
              <Countdown/>
              <div style={{color:"white", fontSize:"20px", textAlign:"center", padding:"10px", fontWeight:"bold", position:"relative"}}>
              LAUNCH &nbsp; {`${countdown.days}D ${countdown.hours}H ${countdown.minutes}M ${countdown.seconds}S`}
              </div>
            </>
          }
        </div>

        <div style={{display:"flex", alignItems:"center"}}>
          <Header />
        </div>
        
        <Box px={2}>
          <BakeCard />
        </Box>
        {/* <Footer /> */}
      </MainBox>
    </>
  );
}
