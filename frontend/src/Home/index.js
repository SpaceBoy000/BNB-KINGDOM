import { Box, Button } from "@mui/material";
import backgroundImage from "../assets/bg-img.png";
import BakeCard from "./components/BakeCard";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Connect from "./components/Connect";
import { styled } from "@mui/system";
import LanguageSelect from "./components/LanguageSelect";
import { useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import logo from "../assets/bnbking-logo.png";

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

export default function Home() {
  const [toggle, setToggle] = useState(false);
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
        <div style={{display:"flex", paddingTop:"50px", alignItems:"center"}}>
          <Button className="menu-Btn" style={{marginLeft: "6%"}} onClick={()=>{setToggle(!toggle)}}>
            <MenuIcon/>
          </Button>
          {/* <LanguageSelect responsive={true} /> */}
          <Header />
          <Connect />
        </div>
        
        <Box px={2}>
          <BakeCard />
        </Box>
        {/* <Footer/> */}
        {
          toggle? 
        <div style={{height:"100%", width:"100%", display:"flex", position:"fixed", top:"0px", left:"0px", background:"rgba(0,0,0,0.3)", zIndex:"3"}} >
          <div className="menu-bar" style={{zIndex:"4", display:"flex", flexDirection:"column"}}>
            <img src={logo} alt="" width={"200px"} />
            <div style={{height:"60%", marginBottom: "10px"}}>
              <div className="menu-item">
                <a href="https://twitter.com/BNBKingdom" target="_blank">
                  Link to BNB-Kingdom
                </a>
              </div>
              <div className="menu-item">
                <a href="https://twitter.com/BNBKingdom" target="_blank">
                  Link to BUSD-Kingdom
                </a>
              </div>
              <div className="menu-item">
                <a href="https://twitter.com/BNBKingdom" target="_blank" className="a-disable">
                  Token
                </a>
              </div>
              <div className="menu-item">
                <a href="https://twitter.com/BNBKingdom" target="_blank" className="a-disable">
                  NFT
                </a>
              </div>
              <div className="menu-item">
                <a href="/" target="_blank" className="a-disable">
                  P2E
                </a>
              </div>
              <div className="menu-item">
                <LanguageSelect responsive={true} />
              </div>
            </div>

            <div style={{flex: 1}}></div>
            <div >
              <Footer />
            </div>
          </div>
          <div style={{flex: 1}} onClick={()=>{setToggle(!toggle)}}>
          </div>
        </div> : <></>
        }
      </MainBox>
    </>
  );
}
