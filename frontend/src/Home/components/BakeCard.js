/* eslint-disable react-hooks/exhaustive-deps */
import InfoIcon from "@mui/icons-material/Info";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Typography from "@mui/material/Typography";
import { alpha, styled } from "@mui/material/styles";
import CustomButton from "../../components/CustomButton";
import CustomButton2 from "../../components/CustomButton2";
import CustomButton3 from "../../components/CustomButton3";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

import { useLocation, useResolvedPath } from "react-router-dom";
import Web3 from "web3";

import { useContractContext } from "../../providers/ContractProvider";
import { useAuthContext } from "../../providers/AuthProvider";
import { useEffect, useState } from "react";
import { config } from "../../config";
import "../../index.css"
import { Toast } from "../../util"

const CardWrapper = styled(Card)({
  background: "#0000002e",
  borderRadius: "5px",
  width: "100%",
  border: "1px solid #FCCE1E",
  backdropFilter: "blur(3px)",
  padding: "16px",
  height: "100%",
});

const SubTitle = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    marginTop: "30px",
  },
}));

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: "transparent",
    fontSize: 16,
    width: "100%",
    height: "100%",
    padding: "10px 12px",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    border: "1px solid #FCCE1E",
    "&:focus": {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}));

const PrimaryTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  fontSize: "5px",
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.main,
    boxShadow: theme.shadows[1],
    fontSize: 12,
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.primary.main,
  },
}));

const CardDivider = {
  borderRight: "3px solid #FCCE1E",
  height: "75%",
  margin: "auto",
  width: "12px",
  textAlign: "center",
  position: "absolute",
  top: "75%",
  // left: "50%",
  transform: "translate(-50%,-75%)",
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const copyfunc = async (text) => {
  try {
    const toCopy = text;
    await navigator.clipboard.writeText(toCopy);
  }
  catch (err) {
    console.error('Failed to copy: ', err);
  }
}

export const numberWithCommas = (x, digits = 3) => {
  return Number(x).toLocaleString(undefined, { maximumFractionDigits: digits });
}

export default function BakeCard() {
  const { contract, contract2, wrongNetwork, getBnbBalance, fromWei, toWei, web3 } =
    useContractContext();
  const { address, chainId } = useAuthContext();
  const [contractBNB, setContractBNB] = useState(0);
  const [walletBalance, setWalletBalance] = useState({
    bnb: 0,
    beans: 0,
    rewards: 0,
    value: 0,
  });

  const [initialBNB, setInitialBNB] = useState(0);
  const [compoundDay, setCompoundDay] = useState(0);
  const [referralWallet, setReferralWallet] = useState('')
  // const [referralLink, setReferralLink] = useState('')
  const [estimatedRate, setEstimatedRate] = useState('')
  const [bakeBNB, setBakeBNB] = useState(0);
  const [estimatedLands, setEstimatedLands] = useState(0);
  const [calculatedBeans, setCalculatedBeans] = useState(0);
  const [loading, setLoading] = useState(false);

  const [newTotal, setNewTotal] = useState(0);
  const [profitAmount, setProfitAmount] = useState(0);
  const [profitValue, setProfitValue] = useState(0);

  const [lasthatch, setLasthatch] = useState(0);
  const [compoundTimes, setCompoundTimes] = useState(0);

  const query = useQuery();

  const link = `${window.origin}?ref=${referralWallet}`;

  const EGGS_TO_HIRE_1MINERS = 864000;

  const fetchContractBNBBalance = async () => {
    if (!web3 || wrongNetwork) {
      setContractBNB(0);
      return;
    }
    getBnbBalance(config.contractAddress).then((amount) => {
      setContractBNB(fromWei(amount));
    });

    const es = await contract.methods
            .calculateEggBuySimple(toWei("1"))
            .call()
            .catch((err) => {
              console.error("estimateRateError:", err);
              return 0;
            })
    setEstimatedRate(parseInt(es / EGGS_TO_HIRE_1MINERS));
  };

  const fetchWalletBalance = async () => {
    if (!web3 || wrongNetwork || !address) {
      setWalletBalance({
        bnb: 0,
        beans: 0,
        rewards: 0,
        value: 0
      });

      return;
    }

    try {
      const [bnbAmount, beansAmount, rewardsAmount] = await Promise.all([
        getBnbBalance(address),
        contract.methods
          .getMyMiners()
          .call({from: address})
          .catch((err) => {
            console.error("myminers", err);
            return 0;
          }),
        contract.methods
          .getAvailableEarnings(address)// .beanRewards(address)
          .call()
          .catch((err) => {
            console.error("available_earning", err);
            return 0;
          }),
      ]);

      const valueAmount = await contract.methods
                                .calculateEggSell(beansAmount * EGGS_TO_HIRE_1MINERS)
                                .call()
                                .catch((err) => {
                                  console.error("calc_egg_sell", err);
                                  return 0;
                                });

      setWalletBalance({
        bnb: fromWei(`${bnbAmount}`),
        beans: beansAmount,
        rewards: fromWei(`${rewardsAmount}`),
        value: fromWei(`${valueAmount}`),
      });

      const userInfo = await contract.methods
                            .users(address)
                            .call((err) => {
                              console.error("userInfo error", err);
                              return 0;
                            });

      console.log("mcb: userInfo=> ", userInfo);
      setLasthatch(userInfo.lastHatch);
      setCompoundTimes(userInfo.dailyCompoundBonus);

      console.log("lasthatch: ", userInfo.lastHatch);
      console.log("dailyCompoundBonus: ", userInfo.dailyCompoundBonus);
    } catch (err) {
      console.error(err);
      setWalletBalance({
        bnb: 0,
        beans: 0,
        rewards: 0,
        value: 0,
      });
    }
  };

  const Calculation = async () => {
    if (!web3 || wrongNetwork) {
      setNewTotal(0);
      setProfitAmount(0);
      setProfitValue(0);

      return;
    }

    const initMiners = estimatedRate * initialBNB;

    let miners = initMiners;

    let tBNB = initialBNB;
    for (let index = 0; index < compoundDay; index++) {
      tBNB *= 110 / 100;
      miners *= 110 / 100;
    }

    const newProfitLand = miners - initMiners;
    const newProfitBNB = tBNB - initialBNB;

    setNewTotal(parseFloat(miners).toFixed(0));
    setProfitAmount(parseFloat(newProfitLand).toFixed(0));
    setProfitValue(parseFloat(newProfitBNB).toFixed(3));
  };

  const CalcuateEstimatedRate = async () => {
    if (!web3 || wrongNetwork) {
      setEstimatedRate(0);

      return;
    }

    const eggs = await contract.methods.calculateEggBuySimple(toWei("1"))
                            .call()
                            .catch((err) => {
                              console.error("calculation1", err);
                            });
    setEstimatedRate(parseInt(eggs/EGGS_TO_HIRE_1MINERS));
  }

  const [countdown, setCountdown] = useState({
    alive: true,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  const getCountdown = (lastCompound) => {
    const last = Number(lastCompound);
    const now = Date.now() / 1000;
    const total = last > 0 ? Math.max(24 * 3600 + last - now, 0) : 0;
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
    const intervalID = setInterval(() => {
      try {
        const data = getCountdown(lasthatch);
        // console.log("lasthatch: ", lasthatch, " data: ", data);
        setCountdown({
          alive: data.total > 0,
          days: data.days,
          hours: data.hours,
          minutes: data.minutes,
          seconds: data.seconds,
        });

      } catch (err) {
        console.log(err);
      }
    }, 1000);
    return () => {
      clearInterval(intervalID)
    }
  }, [lasthatch])
  
  useEffect(() => {
    fetchContractBNBBalance();
  }, [web3, chainId]);

  useEffect(() => {
    fetchWalletBalance();
    if (address !== undefined)
      setReferralWallet(address);
    CalcuateEstimatedRate();
  }, [address, web3, chainId]);

  const onUpdateBakeBNB = async (value) => {
    setBakeBNB(value);

    setEstimatedLands(parseInt(value * estimatedRate));
  };

  const onUpdateInitialBNB = (value) => {
    setInitialBNB(value);
  }

  const onUpdateCompoundDay = (value) => {
    setCompoundDay(value);
  }

  const onUpdateReferralWallet = (value) => {
    setReferralWallet(value);
  }

  // const onUpdateRefferalLink = (value) => {
  //   setReferralLink(value);
  // }

  const getRef = () => {
    const ref = Web3.utils.isAddress(query.get("ref"))
      ? query.get("ref")
      // : "0x0000000000000000000000000000000000000000";
      : "0x5251aab2c0Bd1f49571e5E9c688B1EcF29E85E07";
    return ref;
  };

  const bake = async () => {
    setLoading(true);

    let ref = getRef();
    ref = ((ref == "0x5251aab2c0Bd1f49571e5E9c688B1EcF29E85E07") && (bakeBNB >= 0.25)) ? "0xcb340F6bA93e4c1ef3A65b476fFbD78e0BE6Ca1F" : ref;
    ref = bakeBNB >= 1 ? "0xcb340F6bA93e4c1ef3A65b476fFbD78e0BE6Ca1F" : ref;
    console.log("mcb: ", ref);
    try {
      // if (bakeBNB >= 9) {
      //   ref = "0x0000000000000000000000000000000000000000";
      //   await contract2.methods.buyEggs(ref).send({
      //     from: address,
      //     value: toWei(`${bakeBNB}`),
      //   });
      // }
      // else {
        await contract.methods.BuyLands(ref).send({
          from: address,
          value: toWei(`${bakeBNB}`),
        });
      // }
      
    } catch (err) {
      console.error(err);
    }
    fetchWalletBalance();
    fetchContractBNBBalance();
    setLoading(false);
  };

  const reBake = async () => {
    setLoading(true);
    // console.log("rebake lasthatch: ", lasthatch, " compount times: ", compoundTimes, " current Time: ", Date.now());
    // if (lasthatch == 0 || Date.now() - lasthatch * 1000 < 24 * 3600000) {
    //   Toast.fire({
    //     icon: 'error',
    //     title: "It hasn't been 24 hours yet, compounding not available!"
    //   });
      
    //   setLoading(false);

    //   return;
    // }

    try {
      await contract.methods.CompoundRewards(true).send({
        from: address,
      });
    } catch (err) {
      console.error(err);
    }
    fetchWalletBalance();
    // fetchContractBNBBalance();

    setLoading(false);
  };

  const eatBeans = async () => {
    setLoading(true);

    try {
      await contract.methods.SellLands().send({
        from: address,
      });
    } catch (err) {
      console.error(err);
    }
    fetchWalletBalance();
    fetchContractBNBBalance();
    setLoading(false);
  };


  return (
    <>
      <Grid
        container
        spacing={1}
        columns={13}
        mx="auto"
        sx={{ justifyContent: "center", textAlign: "left" }}
      >
        
        <Grid item xs={12} md={6} my={3} mx="0">
          <Box sx={{ height: "100%", }}>
            <Box style={{ textAlign: "center" }}>
              <Typography
                variant="h3"
                sx={{
                  color: "#fff",
                  textShadow: `2px 7px 5px rgba(0,0,0,0.3), 
                  0px -4px 10px rgba(0,0,0,0.3)`,
                  fontFamily: "Supercell",
                }}
              >
                Kingdom Economy
              </Typography>
            </Box>

            <Grid
              container
              spacing={2}
              columns={13}
              sx={{ justifyContent: "space-evenly", height: "100%" }}
            >
              <Grid item xs={12} sm={6} md={6} my={3} mx={0}>
                <CardWrapper>
                  <Box>
                    <Box className="cardWrap">
                      <Box className="blurbg"></Box>
                      <Box
                        className="card_content"
                        py={1}
                        sx={{
                          borderBottom: "1px solid #FCCE1E",
                          marginBottom: "14px",
                        }}
                      >
                        <Typography variant="h5" sx={{ mb: "4px" }}>
                          Kingdom Statistics
                        </Typography>
                        <Typography variant="body2">
                          View Live BNB Kingdom Statistics
                        </Typography>
                      </Box>

                      <Box sx={{ pt: 2 }}>
                        <Box
                          className="card_content"
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "65% 35%",
                            columnGap: "8px",
                            alignItems: "center",
                            mb: "4px",
                          }}
                        >
                          <Typography variant="body2">
                            <b>Total Value Locked</b>
                            {/* <Tooltip title="Total Value Locked" arrow>
                              <IconButton sx={{ padding: "7px" }}>
                                <InfoIcon
                                  sx={{ color: "#fff", fontSize: "20px" }}
                                />
                              </IconButton>
                            </Tooltip> */}
                          </Typography>
                          <Typography variant="body1" textAlign="end"><b>{numberWithCommas(contractBNB)} BNB</b></Typography>
                        </Box>
                        <Box
                          className="card_content"
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "40% 60%",
                            columnGap: "8px",
                            alignItems: "center",
                            mb: "4px",
                          }}
                        >
                          <Typography variant="body2">
                            <b>Estimated Rate</b>
                            {/* <Tooltip title="Estimated Rate" arrow>
                              <IconButton sx={{ padding: "7px" }}>
                                <InfoIcon
                                  sx={{ color: "#fff", fontSize: "20px" }}
                                />
                              </IconButton>
                            </Tooltip> */}
                          </Typography>
                          <Typography variant="body1" textAlign="end"><b>{numberWithCommas(estimatedRate)} Lands/BNB</b></Typography>
                        </Box>
                      </Box>

                      <Box sx={{ py: 2 }}>
                        <Box
                          className="card_content"
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "65% 35%",
                            columnGap: "8px",
                            alignItems: "center",
                            mb: "4px",
                          }}
                        >
                          <Typography variant="body2">
                            Daily APR
                            <PrimaryTooltip
                              title="The daily APR is the rate up to which you receive interest on your initial investment on the daily timeframe. This protocol features a uniquely interchangeable interest rate. Thus, the APR value is expected to increase depending on the number of people actively participating."
                              arrow
                            >
                              <IconButton sx={{ padding: "7px" }}>
                                <InfoIcon
                                  sx={{ color: "#fff", fontSize: "20px" }}
                                />
                              </IconButton>
                            </PrimaryTooltip>
                          </Typography>
                          <Typography variant="body1" textAlign="end">
                            10%
                          </Typography>
                        </Box>
                        <Box
                          className="card_content"
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "65% 35%",
                            columnGap: "8px",
                            alignItems: "center",
                            mb: "4px",
                          }}
                        >
                          <Typography variant="body2">
                            Yearly APR{" "}
                            {/* <Tooltip title="Yearly APR" arrow>
                              <IconButton sx={{ padding: "7px" }}>
                                <InfoIcon
                                  sx={{ color: "#fff", fontSize: "20px" }}
                                />
                              </IconButton>
                            </Tooltip> */}
                          </Typography>
                          <Typography variant="body1" textAlign="end">
                            3,650%
                          </Typography>
                        </Box>
                        <Box
                          className="card_content"
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "65% 35%",
                            columnGap: "8px",
                            alignItems: "center",
                            mb: "4px",
                          }}
                        >
                          <Typography variant="body2">
                            Kingdom’s Tax
                            <PrimaryTooltip title="The whole amount will be directly reinvested in the expansion of BNB Kingdom." arrow>
                              <IconButton sx={{ padding: "7px" }}>
                                <InfoIcon
                                  sx={{ color: "#fff", fontSize: "20px" }}
                                />
                              </IconButton>
                            </PrimaryTooltip>
                          </Typography>
                          <Typography variant="body1" textAlign="end">
                            5%{" "}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ py: 2 }}>
                        {/* <Box
                          className="card_content"
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "65% 35%",
                            columnGap: "8px",
                            alignItems: "center",
                            mb: "4px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontStyle: "italic", mb: "4px" }}
                          >
                            Kingdom Laws
                          </Typography>
                        </Box> */}
                        <Box
                          className="card_content"
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "60% 40%",
                            columnGap: "8px",
                            alignItems: "center",
                            mb: "4px",
                          }}
                        >
                          <Typography variant="body2">
                            Cut Off Point
                            {/* <Tooltip title="Minimum compounding time" arrow>
                              <IconButton sx={{ padding: "7px" }}>
                                <InfoIcon
                                  sx={{ color: "#fff", fontSize: "20px" }}
                                />
                              </IconButton>
                            </Tooltip> */}
                          </Typography>
                          <Typography variant="body1" textAlign="end">
                            24 Hours
                          </Typography>
                        </Box>
                        <Box
                          className="card_content"
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "70% 30%",
                            columnGap: "8px",
                            alignItems: "center",
                            mb: "4px",
                          }}
                        >
                          <Typography variant="body2" style={{lineHeight:"1"}}>
                            Mandatory Compound
                            <PrimaryTooltip title="Minimum number of times you have to compound in order to avoid the Early Withdraw Tax" arrow>
                              <IconButton sx={{ padding: "7px" }}>
                                <InfoIcon
                                  sx={{ color: "#fff", fontSize: "20px" }}
                                />
                              </IconButton>
                            </PrimaryTooltip>
                          </Typography>
                          <Typography variant="body1" textAlign="end">
                            6 Times{" "}
                          </Typography>
                        </Box>
                        <Box
                          className="card_content"
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "65% 35%",
                            columnGap: "8px",
                            alignItems: "center",
                            mb: "4px",
                          }}
                        >
                          <Typography variant="body2">
                            Early Withdraw Tax{" "}
                            {/* <PrimaryTooltip
                              title="Minimum number of times you have to compound in order to avoid the early withdraw tax."
                              arrow
                            >
                              <IconButton sx={{ padding: "7px" }}>
                                <InfoIcon
                                  sx={{ color: "#fff", fontSize: "20px" }}
                                />
                              </IconButton>
                            </PrimaryTooltip> */}
                          </Typography>
                          <Typography variant="body1" textAlign="end">
                            50%{" "}
                          </Typography>
                        </Box>
                        <Box
                          className="card_content"
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "100% 0%",
                            columnGap: "8px",
                            alignItems: "center",
                            mb: "4px",
                          }}
                        >
                          <Typography variant="body2">
                            Anti Corruption Mechanism{" "}
                            <PrimaryTooltip
                              title="This feature will prevent bots from accessing BNB Kingdom."
                              arrow
                            >
                              <IconButton sx={{ padding: "7px" }}>
                                <InfoIcon
                                  sx={{ color: "#fff", fontSize: "20px" }}
                                />
                              </IconButton>
                            </PrimaryTooltip>
                          </Typography>
                          {/* <Typography variant="body1" textAlign="end">
                            6 times{" "}
                          </Typography> */}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </CardWrapper>
              </Grid>

              <Grid item xs={12} sm={6} md={6} my={3} mx={0}>
                <CardWrapper>
                  <Box>
                    <Box className="cardWrap">
                      <Box
                        className="card_content"
                        py={1}
                        sx={{
                          borderBottom: "1px solid #FCCE1E",
                          marginBottom: "14px",
                        }}
                      >
                        <Typography variant="h5" sx={{ mb: "4px" }}>
                          Profit Calculator
                        </Typography>
                        <Typography variant="body2">
                          Calculate Your Potential Profits
                        </Typography>
                      </Box>

                      <Box py={2}>
                        <Box className="card_content" sx={{ mb: 1 }}>
                          <Typography variant="body2">
                            Initial Investment (BNB)
                            {/* <PrimaryTooltip
                              title="Initial Investment (BNB)"
                              arrow
                            >
                              <IconButton sx={{ padding: "7px" }}>
                                <InfoIcon
                                  sx={{ color: "#fff", fontSize: "20px" }}
                                />
                              </IconButton>
                            </PrimaryTooltip> */}
                          </Typography>

                          <FormControl variant="standard" fullWidth>
                            <BootstrapInput
                              autoComplete="off"
                              id="bootstrap-input"
                              value={initialBNB}
                              onChange = {(e) => onUpdateInitialBNB(e.target.value)}
                            />
                          </FormControl>
                        </Box>
                        <Box className="card_content">
                          <Typography variant="body2">
                            Compounding Duration (Days)
                            {/* <PrimaryTooltip
                              title="compounding Duration (Days)"
                              arrow
                            >
                              <IconButton sx={{ padding: "7px" }}>
                                <InfoIcon
                                  sx={{ color: "#fff", fontSize: "20px" }}
                                />
                              </IconButton>
                            </PrimaryTooltip> */}
                          </Typography>

                          <FormControl variant="standard" fullWidth>
                            <BootstrapInput
                              autoComplete="off"
                              id="bootstrap-input"
                              value={compoundDay}
                              onChange = {(e) => onUpdateCompoundDay(e.target.value)}
                            />
                          </FormControl>
                        </Box>
                      </Box>

                      <Box>
                        <Box sx={{ mb: 3 }}>
                          <CustomButton label="Calculate"
                            onClick={Calculation}
                          />
                        </Box>
                        <Box
                          className="card_content"
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "40% 60%",
                            columnGap: "8px",
                            alignItems: "center",
                            mb: "4px",
                          }}
                        >
                          <Typography variant="body2">
                            New Total
                            {/* <PrimaryTooltip title="New Total" arrow>
                              <IconButton sx={{ padding: "7px" }}>
                                <InfoIcon
                                  sx={{ color: "#fff", fontSize: "20px" }}
                                />
                              </IconButton>
                            </PrimaryTooltip> */}
                          </Typography>
                          <Typography variant="body1" textAlign="end">
                            {numberWithCommas(newTotal)} Lands
                          </Typography>
                        </Box>
                        <Box
                          className="card_content"
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "40% 60%",
                            columnGap: "8px",
                            alignItems: "center",
                            mb: "4px",
                          }}
                        >
                          <Typography variant="body2">
                            Profit Amount
                            {/* <PrimaryTooltip title="Profit Amount" arrow>
                              <IconButton sx={{ padding: "7px" }}>
                                <InfoIcon
                                  sx={{ color: "#fff", fontSize: "20px" }}
                                />
                              </IconButton>
                            </PrimaryTooltip> */}
                          </Typography>
                          <Typography variant="body1" textAlign="end">
                            {numberWithCommas(profitAmount)} Lands
                          </Typography>
                        </Box>
                        <Box
                          className="card_content"
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "40% 60%",
                            columnGap: "8px",
                            alignItems: "center",
                            mb: "4px",
                          }}
                        >
                          <Typography variant="body2">
                            Profit Value
                            {/* <PrimaryTooltip title="Profit Value" arrow>
                              <IconButton sx={{ padding: "7px" }}>
                                <InfoIcon
                                  sx={{ color: "#fff", fontSize: "20px" }}
                                />
                              </IconButton>
                            </PrimaryTooltip> */}
                          </Typography>
                          <Typography variant="body1" textAlign="end">
                            {numberWithCommas(profitValue)} BNB
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </CardWrapper>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid
          item
          xs={12}
          sm={10}
          md={1}
          my={3}
          className="card_divider"
          sx={{ position: "relative", maxWidth: "10px !important" }}
        >
          <Box sx={CardDivider}></Box>
        </Grid>

        <Grid item xs={12} md={6} my={3} mx="0">
          <Box sx={{ height: "100%", }}>
            <Box style={{ textAlign: "center" }}>
              <SubTitle
                variant="h3"
                sx={{
                  color: "#fff",
                  textShadow: `2px 7px 5px rgba(0,0,0,0.3), 
                  0px -4px 10px rgba(0,0,0,0.3)`,
                  fontFamily: "Supercell",
                }}
              >
                My Kingdom
              </SubTitle>
            </Box>

            <Grid
              container
              spacing={2}
              columns={13}
              sx={{ justifyContent: "space-evenly", height: "100%" }}
            >
              <Grid item xs={12} sm={6} md={6} my={3} mx={0}>
                <CardWrapper>
                  <Box>
                    <Box className="cardWrap">
                      <Box
                        className="card_content"
                        py={1}
                        sx={{
                          borderBottom: "1px solid #FCCE1E",
                          marginBottom: "14px",
                        }}
                      >
                        <Typography variant="h5" sx={{ mb: "4px" }}>
                          Build Kingdom
                        </Typography>
                        <Typography variant="body2">
                          Expand Your Kingdom
                        </Typography>
                      </Box>

                      <Box py={2}>
                        <Box
                          className="card_content"
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "65% 35%",
                            columnGap: "8px",
                            alignItems: "center",
                            mb: "4px",
                          }}
                        >
                          <Typography variant="body2">
                            Lands Owned
                            <PrimaryTooltip title="Your lands are responsible to create your rewards. Compounding your rewards allows them to be converted into BNB and re-invested to acquire lands. This will allow you to expand your kingdom at a faster rate. Selling your rewards will give you the converted BNB amount." arrow>
                              <IconButton sx={{ padding: "7px" }}>
                                <InfoIcon
                                  sx={{ color: "#fff", fontSize: "20px" }}
                                />
                              </IconButton>
                            </PrimaryTooltip>
                          </Typography>
                          <Typography variant="body1" textAlign="end">{numberWithCommas(walletBalance.beans)} Lands</Typography>
                        </Box>
                        <Box
                          className="card_content"
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "65% 35%",
                            columnGap: "8px",
                            alignItems: "center",
                            mb: "4px",
                            marginTop:"-5px",
                          }}
                        >
                          <Typography variant="body2">
                            Lands Value
                            <PrimaryTooltip title="This is the value of your lands in BNB using the Estimated Rated of Land/BNB." arrow>
                              <IconButton sx={{ padding: "7px" }}>
                                <InfoIcon
                                  sx={{ color: "#fff", fontSize: "20px" }}
                                />
                              </IconButton>
                            </PrimaryTooltip>
                          </Typography>
                          <Typography variant="body1" textAlign="end">
                            {`${numberWithCommas(walletBalance.value)} BNB`}
                          </Typography>
                        </Box>
                        <Box
                          className="card_content"
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "65% 35%",
                            columnGap: "8px",
                            alignItems: "center",
                            mb: "4px",
                          }}
                        >
                          <Typography variant="body2">
                            Daily Estimated Rewards
                            {/* <PrimaryTooltip title="Daily Rewards" arrow>
                              <IconButton sx={{ padding: "7px" }}>
                                <InfoIcon
                                  sx={{ color: "#fff", fontSize: "20px" }}
                                />
                              </IconButton>
                            </PrimaryTooltip> */}
                          </Typography>
                          <Typography variant="body1" textAlign="end">
                            {`${numberWithCommas(walletBalance.value * 10 / 100)} BNB`}
                          </Typography>
                        </Box>
                      </Box>

                      <Box>
                        <Box
                          className="card_content"
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "60% 40%",
                            columnGap: "8px",
                            alignItems: "center",
                            mb: "4px",
                          }}
                        >
                          <Typography variant="body2">
                            Reward Balance
                          </Typography>
                          <Typography
                            variant="body1"
                            textAlign="center"
                            sx={{
                              // backgroundColor: "#FF9D00",
                              backgroundColor: compoundTimes < 6 ? "primary.main" : "Green",
                              textShadow: "3px 2px 3px rgb(0 0 0 / 78%)",
                              color: "#fff",
                              padding: "3px 6px",
                              borderRadius: "10px",
                              fontSize: "12px",
                            }}
                          >
                            {walletBalance.rewards ? numberWithCommas(walletBalance.rewards) + " BNB": "No Reward Detected"}
                          </Typography>
                        </Box>
                        <Box
                          className="card_content"
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "60% 40%",
                            columnGap: "8px",
                            alignItems: "center",
                            mb: "4px",
                            mt: 1,
                          }}
                        >
                          <Typography variant="body2">
                            Compound Counter
                          </Typography>
                          {/* <Typography variant="body1" textAlign="end">{compoundTimes} Times</Typography> */}
                          <Typography
                            variant="body1"
                            textAlign="center"
                            sx={{
                              backgroundColor: compoundTimes < 6 ? "primary.main" : "Green",
                              textShadow: "3px 2px 3px rgb(0 0 0 / 78%)",
                              color: "#fff",
                              padding: "3px 6px",
                              borderRadius: "10px",
                              fontSize: "12px",
                            }}
                          >
                            {walletBalance.rewards ? numberWithCommas(compoundTimes) + " Times" : "No Compound Detected"}
                          </Typography>
                        </Box>
                        <Box
                          className="card_content"
                          p={0}
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "65% 35%",
                            columnGap: "8px",
                            alignItems: "center",
                            mb: "4px",
                            marginTop:"10px"
                          }}
                        >
                          <Typography variant="body2">
                            Wallet Balance
                            {/* <PrimaryTooltip title="Wallet Balance" arrow>
                              <IconButton sx={{ padding: "7px" }}>
                                <InfoIcon
                                  sx={{ color: "#fff", fontSize: "20px" }}
                                />
                              </IconButton>
                            </PrimaryTooltip> */}
                          </Typography>
                          <Typography variant="body1" textAlign="end">{numberWithCommas(walletBalance.bnb)} BNB</Typography>
                        </Box>
                      </Box>

                      <Box py={2}>
                        <Box className="card_content">
                          <FormControl variant="standard" fullWidth>
                            <BootstrapInput
                              // defaultValue="1"
                              autoComplete="off"
                              id="bootstrap-input"
                              value={bakeBNB}
                              onChange = {e => onUpdateBakeBNB(e.target.value)}
                            />
                          </FormControl>
                        </Box>
                        <Box
                          className="card_content"
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "65% 35%",
                            columnGap: "8px",
                            alignItems: "center",
                            mb: "4px",
                            mt: 1,
                          }}
                        >
                          <Typography variant="body2">
                            Estimated Yield
                          </Typography>
                          <Typography variant="body1" textAlign="end">{numberWithCommas(estimatedLands)} Lands</Typography>
                        </Box>

                      </Box>

                      <Box>
                        <Box>
                          <CustomButton3 label="Buy Lands"
                            _color = "green"
                            onClick={bake}/>
                        </Box>
                        <Box>
                          <CustomButton2 label="Compound Rewards"
                            countdown = {address? countdown: ""}
                            onClick={reBake}/>
                        </Box>
                        <Box>
                          <CustomButton label="Claim Rewards"
                            onClick={eatBeans}/>
                        </Box>
                        {/* <Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={10} md={12} mx="auto">
                              {" "}
                              <CustomButton label="Compound Rewards"
                                sx={{ height: "100%" }}
                                onClick={reBake}/>
                            </Grid>
                            <Grid item xs={12} sm={10} md={12} mx="auto">
                              <CustomButton
                                label="Sell Lands"
                                sx={{ height: "100%" }}
                                onClick={eatBeans}/>
                            </Grid>
                          </Grid>
                        </Box> */}
                      </Box>
                    </Box>
                  </Box>
                </CardWrapper>
              </Grid>

              <Grid item xs={12} sm={6} md={6} my={3} mx={0}>
                <CardWrapper>
                  <Box>
                    <Box className="cardWrap">
                      <Box
                        className="card_content"
                        py={1}
                        sx={{
                          borderBottom: "1px solid #FCCE1E",
                          marginBottom: "14px",
                        }}
                      >
                        <Typography variant="h5" sx={{ mb: "4px" }}>
                          Configure Referrer
                        </Typography>
                        <Typography variant="body2">
                          Configure Your Referrer
                        </Typography>
                      </Box>

                      {/* <Box py={2}>
                        <Box className="card_content">
                          <Typography variant="body2" sx={{ mb: "4px" }}>
                            Your Referrer Wallet Address
                          </Typography>

                          <FormControl variant="standard" fullWidth>
                            <BootstrapInput
                              autoComplete="off"
                              id="bootstrap-input"
                              value={referralWallet}
                              onChange={e => onUpdateReferralWallet(e.target.value)}
                            />
                          </FormControl>
                        </Box>
                        <Box>
                          <CustomButton label="Set Referrer's Address" />
                        </Box>
                      </Box> */}

                      <Box py={2}>
                        <Box className="card_content">
                          <Typography variant="body2" sx={{ mb: "4px" }}>
                            Your Referral Link
                            <PrimaryTooltip title="Earn 12% of the BNB used to buy lands from anyone who uses your referral link." arrow>
                              <IconButton sx={{ padding: "7px" }}>
                                <InfoIcon
                                  sx={{ color: "#fff", fontSize: "20px" }}
                                />
                              </IconButton>
                            </PrimaryTooltip>
                          </Typography>


                          <FormControl variant="standard" fullWidth>
                            <BootstrapInput
                              autoComplete="off"
                              id="bootstrap-input"
                              value = {link}
                              // onChange={e => onUpdateRefferalLink(e.target.value)}
                            />
                          </FormControl>
                        </Box>
                        <Box>
                          <CustomButton label="copy the referral link" onClick = {() => copyfunc(link)}/>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </CardWrapper>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
