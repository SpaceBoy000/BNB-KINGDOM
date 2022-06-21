import { Box } from "@mui/material";
import backgroundImage from "../assets/bg-img.png";
import BakeCard from "./components/BakeCard";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Connect from "./components/Connect";
import { styled } from "@mui/system";
import LanguageSelect from "./components/LanguageSelect";

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
          <LanguageSelect responsive={true} />
          <Header />
          <Connect />
        </div>
        
        <Box px={2}>
          <BakeCard />
        </Box>
        <Footer />
      </MainBox>
    </>
  );
}
