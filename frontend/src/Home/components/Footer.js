import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/system";
import TwitterIcon from '@mui/icons-material/Twitter';  
import TelegramIcon from '@mui/icons-material/Telegram';
import { FaDiscord, FaEthereum } from 'react-icons/fa';
import { BscscanIcon } from "../../components/Icons";
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { IconButton } from "@mui/material";
import '../index'
import { config } from "../../config"
const SocailIcon = styled(IconButton)(({ theme }) => ({
  background: "#8feaf2",
  color: "#000",
  margin: "10px 1px",
  border: "1px solid #8feaf2",
  "&:hover" :{
    color: "#8feaf2",
    background: "trasparent",   
    transition: ".5s all"
  }

}));

const FooterBox = styled(Box)(
  ({ theme }) => `
  padding-left: 0px !important;
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
      <FooterBox component="div" sx={{ px: 2, textAlign: "center" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box className="socialicon_wrap">
              <a href="https://twitter.com/ethsnowball" target="_blank">
                <SocailIcon><TwitterIcon  /></SocailIcon>
              </a>
              <a href="https://t.me/ethsnowball" target="_blank">
                <SocailIcon><TelegramIcon /></SocailIcon>
              </a>
              <a href="https://discord.gg/pnaDGkej2w" target="_blank">
                <SocailIcon><FaDiscord /></SocailIcon>
              </a>
            </Box>
            <Box className="socialicon_wrap">
              <a href={ config.scanLink } target="_blank">
                <SocailIcon><FaEthereum /></SocailIcon>                       
              </a>
              <a href="./audit.pdf" className="a-disable" target="_blank">
                <SocailIcon><VerifiedUserRoundedIcon  /></SocailIcon>
              </a>
              <a href="https://ethsnowball.gitbook.io/doc" target="_blank">
                <SocailIcon><AutoStoriesIcon  /></SocailIcon>
              </a>
            </Box>
          </Grid>
        </Grid> 
      </FooterBox>
    </>
  );
}
