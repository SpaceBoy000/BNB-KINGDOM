import Button from "@mui/material/Button";
import { styled } from "@mui/system";

const MainButton = styled(Button)(({ theme }) => ({
  marginTop: 18,
  textShadow: "3px 2px 3px rgb(0 0 0 / 78%)",
  borderRadius: "5px",
  border: "1px solid #44c2c7",
  fontWeight: "400",
  fontSize: "14px",
  padding: "13px 28px",
  lineHeight: 1,
  background: "#1db3b8",
  // backgroundImage:
    // "linear-gradient(90deg, hsla(37, 100%, 50%, 0.75) 0%, hsla(48, 97%, 55%, 0.75) 100%)",
    // "linear-gradient(90deg, #1b6866 0%, #0cc093 100%)",
  color: theme.palette.text.primary,
  maxHeight: "52px",
  "&:hover" :{
    background: "rgb(73 207 211)",
    transition: ".5s all"
  },
  "&:disabled" :{
    // background: "rgb(73 207 211) !important",
    color:"white",
    transition: ".5s all"
  },
}));

export default function CustomButton2({label, countdown, disabled, onClick, ...rest}) {

  return (
    <MainButton
      color={countdown.alive ? "primary" : "secondary"}
      variant="contained"
      fullWidth {...rest}
      onClick = {onClick}
      disabled = { disabled }
    >
      { countdown.alive ? countdown.days + "D " + countdown.hours + "H " + countdown.minutes + "M " + countdown.seconds + "S" : label }
    </MainButton>
  );
}
