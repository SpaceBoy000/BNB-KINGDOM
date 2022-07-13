import Button from "@mui/material/Button";
import { styled } from "@mui/system";

const MainButton = styled(Button)(({ theme }) => ({
  marginTop: 18,
  marginBottom: "5px",
  textShadow: "3px 2px 3px rgb(0 0 0 / 78%)",
  borderRadius: "5px",
  border: "1px solid #BA8B22",
  fontWeight: "400",
  fontSize: "14px",
  padding: "13px 28px",
  lineHeight: 1,
  // background: "linear-gradient(90deg, rgba(255,50,20,0.75), rgba(253, 136, 53, 0.75))",
  backgroundImage:
    // "linear-gradient(90deg, hsla(37, 100%, 50%, 0.75) 0%, hsla(48, 97%, 55%, 0.75) 100%)",
    "linear-gradient(90deg, #b68117 0%, #fffa8e 100%)",
  color: theme.palette.text.primary,
  maxHeight: "52px",
}));

export default function CustomButton({label, onClick, disabled, _color, ...rest}) {

  return (
    <MainButton
      // backgroundImage = "linear-gradient(90deg, hsla(37, 100%, 50%, 0.75) 0%, hsla(48, 97%, 55%, 0.75) 100%)"
      color = "secondary"
      variant="contained"
      disabled = { disabled }
      fullWidth {...rest}
      onClick = {onClick}
    >{label}</MainButton>    
  );
}
