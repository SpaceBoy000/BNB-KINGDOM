import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/system";
import TwitterIcon from '@mui/icons-material/Twitter';  
import TelegramIcon from '@mui/icons-material/Telegram';
import { FaDiscord } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa';
import { SiBinance } from 'react-icons/si';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { IconButton } from "@mui/material";
import '../index'
import { config } from "../../config"
const SocailIcon = styled(IconButton)(({ theme }) => ({
  background: "#123F49",
  color: "white",
  margin: "20px 3px 0 3px",
  borderRadius: "30px",
  "&:hover" :{
    color: "#C5AC70",
    background: "trasparent",   
    transition: ".5s all"
  }

}));

const FooterBox = styled(Box)(
  ({ theme }) => `
  @media only screen and (max-width: 900px){
    margin-top: 30px;
  }

  @media only screen and (max-width: 376px){
    margin-top: 70px;
  }
`,);

export default function Footer() {
  return (
    <>
    <FooterBox component="div" sx={{ px: 2, textAlign: "center", marginTop:'120px' }}>
      <a href="https://safuaudit.com/" style={{textDecoration: 'none'}}>
        <h2 className="text-[30px] text-white text-center">Audited by</h2>
      </a>
      <div style={{marginBottom:'30px'}}>
        <a href="https://safuaudit.com/" style={{textDecoration: 'none'}}>
          <img src="/img/footer.png" alt="footer" className="mx-auto" />
        </a>
      </div>
      <div>
        <a className='social-item' href={ config.scanLink } target="_blank">
          <img
            src="/img/social-1.png"
            alt="footer"
            className="ml-auto mr-6 w-[56px] h-[56px]"
          />
        </a>
        <a className='social-item' href="https://instagram.com/busdpay" target="_blank">
          <img
            src="/img/social-2.png"
            alt="footer"
            className="mr-6 w-[56px] h-[56px]"
          />
        </a>
        <a className='social-item' href="https://mobile.twitter.com/Busdpay" target="_blank">
          <img
            src="/img/social-6.png"
            alt="footer"
            className="mr-6 w-[56px] h-[56px]"
          />
        </a>
        <a className='social-item' href="https://t.me/BUSDPAY" target="_blank">
          <img
            src="/img/social-5.png"
            alt="footer"
            className="mr-6 w-[56px] h-[56px]"
          />
        </a>
        <a className='social-item' href="https://www.youtube.com/channel/UCyCfwyqlCrJq7vyXUXClsRg" target="_blank">
          <img
            src="/img/social-4.png"
            alt="footer"
            className="mr-6 w-[56px] h-[56px]"
          />
        </a>
        <a className='social-item' href="./whitepaper.pdf" target="_blank">
          <img
            src="/img/social-3.png"
            alt="footer"
            className="mr-auto w-[56px] h-[56px]"
          />
        </a>
      </div>
      <h4 style={{color:'white', marginTop:'20px'}}>
        © Copyright 2022 by BUSDPAY
      </h4>
      </FooterBox>
    </>
  );
}
