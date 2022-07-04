import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/system";
import TwitterIcon from '@mui/icons-material/Twitter';  
import TelegramIcon from '@mui/icons-material/Telegram';
import { BscscanIcon } from "../../components/Icons";
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { IconButton } from "@mui/material";
import '../index'
import { config } from "../../config"
const SocailIcon = styled(IconButton)(({ theme }) => ({
  background: "#FACC1E",
  color: "#000",
  margin: "10px 1px",
  border: "1px solid #FACC1E",
  "&:hover" :{
    color: "#FACC1E",
    background: "trasparent",   
    transition: ".5s all"
  }

}));

const FooterBox = styled(Box)(
  ({ theme }) => `
  padding-left: 0px !importantt;
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
      <FooterBox component="div" sx={{ marginLeft:"-10px", px: 2, textAlign: "center", marginBottom:"20px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box className="socialicon_wrap">
              <a href="https://twitter.com/BNBKingdom" target="_blank">
                <SocailIcon><TwitterIcon  /></SocailIcon>
              </a>
              <a href="https://t.me/BNBKingdom" target="_blank">
                <SocailIcon><TelegramIcon /></SocailIcon>
              </a>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box className="socialicon_wrap">
              <a href={ config.scanLink } target="_blank">
                <SocailIcon><BscscanIcon  /></SocailIcon>                       
              </a>
              <a href="./audit.pdf" target="_blank">
                <SocailIcon><VerifiedUserRoundedIcon  /></SocailIcon>
              </a>
              <a href="https://bnb-kingdom.gitbook.io/bnb-kingdom/" target="_blank">
                <SocailIcon><AutoStoriesIcon  /></SocailIcon>
              </a>
            </Box>
          </Grid>
        </Grid> 
      </FooterBox>
    </>
  );
}
