import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { styled } from "@mui/system";
import logo from "../../assets/busdking-logo.png";
import Connect from "./Connect";
import LanguageSelect from "./LanguageSelect";
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

import { GiMiner } from 'react-icons/gi';
import { FaCoins, FaEthereum } from 'react-icons/fa';
import { BiJoystick } from 'react-icons/bi'

import Footer from "./Footer";

const Wrapper = styled("div")(({ theme }) => ({
  textAlign: "center",
  // marginLeft: "6% !important",
  paddingTop: "50px",
  paddingBottom: 24,
  display: "flex",
  justifyContent: "space-between",
  [theme.breakpoints.down("md")]: {
    h5: {
      fontSize: 20,
      margin: 0,
    },
    display: "none",
  },
}));

const SmallScreenWrapper = styled("div")(({ theme }) => ({
  display: "none",
  textAlign: "center",
  paddingTop: "50px",
  paddingBottom: 24,
  display: "flex",
  justifyContent: "space-between",
  [theme.breakpoints.down("md")]: {
    h5: {
      fontSize: 20,
      margin: 0,
    },
    display: "block",
  },
}));

const MenuButton = styled(Button)(({ theme }) => ({
  display:"flex",
  width: "190px",
  height:"55px",
  marginTop:"52px",
  justifyContent: "space-around !important",
  textShadow: "3px 2px 3px rgb(0 0 0 / 78%)",
  borderRadius: "5px",
  // border: "1px solid #ff5141",
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
    // display: "none",
    width: "40%",
    height: "40px",
    marginTop: "20px",
    fontSize: "14px",
  },
}));

export default function Header() {
  const [toggle, setToggle] = useState(false);
  let isMobile = window.matchMedia("only screen and (max-width: 900px)").matches;

  const link = window.location.href;
  const isBUSDLink = link.includes("busd");

  return (
    <Box
      component="div"
      sx={{ px: { lg: 0, xs: 2 }, width: "100%", maxWidth: "calc(100% - 11%)", mx: "auto", zIndex:"1"}}
    >
      { !isMobile ? 
      <Wrapper>
        <MenuButton onClick={()=>{ setToggle(!toggle) }}>
          <MenuRoundedIcon/> 
          <div >
            Menu
          </div>
        </MenuButton>
        <div className="header_logo">
          <img src={logo} alt="" width={"600px"} />
        </div>        
        <Connect/>
      </Wrapper> 
        :
      <SmallScreenWrapper>
        <div className="header_logo">
          <img src={logo} alt="" />
        </div>
        <div style={{display:"flex", justifyContent:"space-evenly"}}>
          <MenuButton onClick={()=>{ setToggle(!toggle) }}>
            <MenuRoundedIcon/> 
            <div>
              Menu
            </div>
          </MenuButton>
          <Connect responsive = { false }/>
        </div>
      </SmallScreenWrapper>
      }
      {
          toggle ? 
            <div style={{height:"100%", width:"100%", display:"flex", position:"fixed", top:"0px", left:"0px", background:"rgba(0,0,0,0.3)", zIndex:"3"}} >
              <div className="menu-bar">
                <div style={{alignSelf:"center", marginTop:"10px"}}>
                  <img src="./favicon.png" alt="" width={"30px"} />
                </div>
                <div className="menu-list">
                  <div className="menu-item">
                    <GiMiner className="a-icon"/>
                    <a href="https://bnbkingdom.xyz/?ref=0x5251aab2c0Bd1f49571e5E9c688B1EcF29E85E07" className={!isBUSDLink ? "w-disable" : ''} target="_blank" style={{flex: 1}}>
                      BNB Kingdom
                    </a>
                    <div className={!isBUSDLink ? "menu-line" : ''}/>
                  </div>
                  <div className="menu-item">
                    <GiMiner className="a-icon"/>
                    <a href="https://busdkingdom.xyz/" className={isBUSDLink ? "w-disable" : ''} target="_blank" style={{flex: 1}}>
                      BUSD Kingdom
                    </a>
                    <div className={isBUSDLink ? "menu-line" : ''}/>
                  </div>
                  <div className="menu-item">
                    <FaCoins className="a-icon"/>
                    <a href="https://twitter.com/BNBKingdom" target="_blank" className="a-disable">
                      Token
                    </a>
                  </div>
                  <div className="menu-item">
                    <FaEthereum className="a-icon"/>
                    <a href="https://twitter.com/BNBKingdom" target="_blank" className="a-disable">
                      NFT
                    </a>
                  </div>
                  <div className="menu-item">
                    <BiJoystick className="a-icon"/>
                    <a href="/" target="_blank" className="a-disable">
                      P2E
                    </a>
                  </div>
                  <div className="menu-item" style={{marginLeft:"5px", zIndex:"999"}}>
                    <LanguageSelect responsive={true} />
                  </div>
                </div>

                <div style={{flex: 1}}></div>
                <div >
                  <Footer />
                </div>
              </div>
              <div style={{height: "100%", width:"3px", backgroundColor:"#BA8B22"}}></div>
              <div style={{flex: 1, zIndex:"9999"}} onClick={()=>{setToggle(!toggle)}}>
              </div>
            </div> 
            : 
            <></>
      }
    </Box>
  );
}
