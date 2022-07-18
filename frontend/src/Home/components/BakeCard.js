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

import { useTranslation, Trans } from "react-i18next";

import { useSelector } from "react-redux";
import Axios from "axios";
import { shorten } from "./Connect";

const CardWrapper = styled(Card)({
  background: "#0000002e",
  borderRadius: "5px",
  width: "100%",
  border: "1px solid #BA8B22",
  backdropFilter: "blur(3px)",
  padding: "16px",
  height: "100%",
});

const SubTitle = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    marginTop: "60px",
    marginLeft: "5px"
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
    border: "1px solid #BA8B22",
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
  borderRight: "3px solid #BA8B22",
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

function _wait(ms = 7000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const copyfunc = async (text) => {
  try {
    const toCopy = text;
    await navigator.clipboard.writeText(toCopy);
    Toast.fire({
      icon: 'success',
      title: "Copied to clipboard!"
    });
  }
  catch (err) {
    console.error('Failed to copy: ', err);
  }
}

export const numberWithCommas = (x, digits = 3) => {
  return Number(x).toLocaleString(undefined, { maximumFractionDigits: digits });
}

export default function BakeCard() {
  const { t, i18n } = useTranslation();
  const languageType = useSelector(state => state.data.lang);

  let addressList = [
    {
      id: '1st'
    },
    {
      id: '2nd'
    },
    {
      id: '3rd'
    },
    {
      id: '4th'
    },
    {
      id: '5th'
    }
  ];

  let tierList = [
    {
      id: '0th',
      plus: '0%',
      total: '3.0%',
      value: 3
    },{
      id: '1st',
      plus: '+0.5%',
      total: '3.5%',
      value: 3.5
    },
    {
      id: '2nd',
      plus: '+0.5%',
      total: '4.0%',
      value: 4
    },
    {
      id: '3rd',
      plus: '+0.5%',
      total: '4.5%',
      value: 4.5
    },
    {
      id: '4th',
      plus: '+0.5%',
      total: '5.0%',
      value: 5
    },
    {
      id: '5th',
      plus: '+1.0%',
      total: '6.0%',
      value: 6
    },
    {
      id: '6th',
      plus: '+1.0%',
      total: '7.0%',
      value: 7
    },
    {
      id: '7th',
      plus: '+1.0%',
      total: '8.0%',
      value: 8
    },
    {
      id: '8th',
      plus: '+2.0%',
      total: '10.0%',
      value: 10
    }
  ];

  const { web3, contract, busdContract, contractUSDT, contractLottory, wrongNetwork, 
              getBnbBalance, getBusdBalance, getBusdApproved, fromWei, toWei } = useContractContext();
  const { address, chainId } = useAuthContext();
  const [contractBNB, setContractBNB] = useState(0);
  const [walletBalance, setWalletBalance] = useState({
    bnb: 0,
    beans: 0,
    rewards: 0,
    value: 0,
    approved: 0
  });

  const [winnerList, setWinnerList] = useState([]);


  // Lottory
  const [lotteryStarted, setLotteryStarted] = useState();
  const [lotteryInterval, setLotteryInterval] = useState();
  
  useEffect(()=> {
    onChangeLangType(languageType);
  }, [languageType]);

  const [landPrice, setLandPrice] = useState(0);
  const [withDrawCoolDown, setWithDrawCoolDown] = useState(0);
  const [initialBNBCalc, setInitialBNBCalc] = useState(0);
  const [compoundDayCalc, setCompoundDayCalc] = useState(0);
  const [referralWallet, setReferralWallet] = useState('')
  // const [referralLink, setReferralLink] = useState('')
  const [estimatedRate, setEstimatedRate] = useState('')
  const [bakeBNB, setBakeBNB] = useState(0);
  const [estimatedLands, setEstimatedLands] = useState(0);
  const [loading, setLoading] = useState(false);

  const [newTotalCalc, setNewTotalCalc] = useState(0);
  const [compoundAmountCalc, setCompoundAmountCalc] = useState(0);
  const [compoundValueCalc, setCompoundValueCalc] = useState(0);
  const [dailyRewardsCalc, setDailyRewasrdsCalc] = useState(0);

  const [lasthatch, setLasthatch] = useState(0);
  const [compoundTimes, setCompoundTimes] = useState(0);
  const [refBonus, setRefBonus] = useState(0);
  const [refCount, setRefCount] = useState(0);

  const [totalStaked, setTotalStaked] = useState(0);

  const query = useQuery();

  const link = `${window.origin}?ref=${referralWallet}`;

  const fetchContractInfo = async () => {
    if (!web3 || wrongNetwork) {
      setContractBNB(0);
      setLotteryStarted(false);
      setLotteryInterval(0);
      setLotteryStartTime(0);
            
      return;
    }
    getBusdBalance(config.contractAddress).then((amount) => {
      setContractBNB(fromWei(amount));
    });

    const [lotteryStarted, lotteryRound, lotteryInterval, lotteryStartTime] = await Promise.all([
      contract.methods
            .lotteryStarted()
            .call()
            .catch((err) => {
              console.error("estimateRateError:", err);
              return 0;
            }),
      contract.methods
            .LOTTERY_ROUND()
            .call()
            .catch((err) => {
              console.error("estimateRateError:", err);
              return 0;
            }),
      contract.methods
            .LOTTERY_INTERVAL()
            .call()
            .catch((err) => {
              console.error("estimateRateError:", err);
              return 0;
            }),
      contract.methods
            .LOTTERY_START_TIME()
            .call()
            .catch((err) => {
              console.error("estimateRateError:", err);
              return 0;
            }),
      // contract.methods
      //       .getSiteInfo()
      //       .call()
      //       .catch((err) => {
      //         console.error("estimateRateError:", err);
      //         return 0;
      //       }),
    ]);

    setLotteryStarted(lotteryStarted);
    setLotteryInterval(lotteryInterval);
    setLotteryStartTime(lotteryStartTime);
    if (lotteryStarted == false) return;

    const [winner1, winner2, winner3, winner4, winner5] = await Promise.all([
      contract.methods.getLotteryWinners(lotteryRound, 1)
            .call()
            .catch((err) => {
              console.error("lottery error: ", err);
            }),
      contract.methods.getLotteryWinners(lotteryRound, 2)
            .call()
            .catch((err) => {
              console.error("lottery error: ", err);
            }),
      contract.methods.getLotteryWinners(lotteryRound, 3)
            .call()
            .catch((err) => {
              console.error("lottery error: ", err);
            }),
      contract.methods.getLotteryWinners(lotteryRound, 4)
            .call()
            .catch((err) => {
              console.error("lottery error: ", err);
            }),
      contract.methods.getLotteryWinners(lotteryRound, 5)
            .call()
            .catch((err) => {
              console.error("lottery error: ", err);
            }),
    ]);

    let winnerlist = [];
    winnerlist.push(winner1);
    winnerlist.push(winner2);
    winnerlist.push(winner3);
    winnerlist.push(winner4);
    winnerlist.push(winner5);

    setWinnerList(winnerlist);
  };

  const fetchAccountInfo = async () => {
    if (!web3 || wrongNetwork || !address) {
      setWalletBalance({
        bnb: 0,
        beans: 0,
        rewards: 0,
        value: 0,
        approved: 0
      });

      setCompoundTimes(0);
      setRefBonus(0);
      setRefCount(0);

      return;
    }

    try {
      const [bnbAmount, userInvestInfo, approvedAmount, landPrice, withDrawCoolDown] = await Promise.all([
        getBusdBalance(address),
        contract.methods
          .getUserLandsAndRewards(address)// .beanRewards(address)
          .call()
          .catch((err) => {
            console.error("available_earning", err);
            return 0;
          }),
        getBusdApproved(address),
        contract.methods
          .landPrice()// .beanRewards(address)
          .call()
          .catch((err) => {
            console.error("available_earning", err);
            return 0;
          }),
        contract.methods
          .WITHDRAW_COOLDOWN()// .beanRewards(address)
          .call()
          .catch((err) => {
            console.error("available_earning", err);
            return 0;
          })
      ]);

      const lp = new web3.utils.BN(landPrice);
      const lm = new web3.utils.BN(userInvestInfo.userLandsAmount);
      const lr = new web3.utils.BN(userInvestInfo.userLandsRewards);
      setWalletBalance({
        bnb: fromWei(`${bnbAmount}`),
        beans: userInvestInfo.userLandsAmount,
        rewards: fromWei(lp.mul(lr).toString()),
        value: fromWei(lp.mul(lm).toString()),
        approved: fromWei(`${approvedAmount}`)
      });

      const userInfo = await contract.methods
                            .users(address)
                            .call()
                            .catch((err) => {
                              console.error("userInfo error", err);
                              return 0;
                            });
      console.log("userInfo: ", userInfo);
      setLasthatch(userInfo.lastHatch);
      setCompoundTimes(userInfo.tier);
      setRefBonus(fromWei(userInfo.referralEggRewards));
      setRefCount(userInfo.referralsCount);
      setTotalStaked(fromWei(userInfo.initialDeposit));
      setLandPrice(fromWei(landPrice));
      setWithDrawCoolDown(withDrawCoolDown);
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
      setNewTotalCalc(0);
      setCompoundAmountCalc(0);
      setCompoundValueCalc(0);
      setDailyRewasrdsCalc(0);

      return;
    }

    const initialLands = initialBNBCalc / landPrice;
    console.log("Calculation: ", initialLands);
    const newTotal = initialLands * Math.pow(1.1, compoundDayCalc);
    const compoundAmount = newTotal - initialLands;
    const compoundValue = compoundAmount * landPrice;
    const dailyRewards = newTotal * landPrice * 0.1;

    setNewTotalCalc(parseFloat(newTotal).toFixed(0));
    setCompoundAmountCalc(parseFloat(compoundAmount).toFixed(0));
    setCompoundValueCalc(parseFloat(compoundValue).toFixed(3));
    setDailyRewasrdsCalc(parseFloat(dailyRewards).toFixed(3));
  };

  const [countdown, setCountdown] = useState({
    alive: true,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  const [countdownLottery, setCountdownLottery] = useState({
    alive: true,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  const getCountdown = (lastCompound) => {
    const now = Date.now() / 1000;
    const total = lastCompound > 0 ? Math.max(lastCompound - now, 0) : 0;
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
        const last = Number(lasthatch);
        const data = getCountdown(last + Number(withDrawCoolDown) + 60);
        // console.log("withDrawCoolDown: ", withDrawCoolDown);
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
  }, [lasthatch, withDrawCoolDown])

  const zeroAddrss = '0x0000000000000000000000000000000000000000';
  const [lotteryStartTime, setLotteryStartTime] = useState(0);
  useEffect(() => {
    const intervalID = setInterval(() => {
      try {
        const data = getCountdown(Number(lotteryStartTime) + Number(lotteryInterval));
        setCountdownLottery({
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
  }, [lotteryStartTime, lotteryInterval])
  
  useEffect(() => {
    fetchContractInfo();
  }, [web3, chainId]);

  useEffect(() => {
    fetchAccountInfo();
    if (address !== undefined)
      setReferralWallet(address);
  }, [address, web3, chainId]);

  const onUpdateBakeBNB = async (value) => {
    setBakeBNB(value);

    setEstimatedLands(parseInt(value / landPrice));
  };

  const onUpdateInitialBNB = (value) => {
    setInitialBNBCalc(value);
  }

  const onUpdateCompoundDay = (value) => {
    setCompoundDayCalc(value);
  }

  const onUpdateReferralWallet = (value) => {
    setReferralWallet(value);
  }

  const getRef = () => {
    const ref = Web3.utils.isAddress(query.get("ref"))
      ? query.get("ref")
      // : "0x0000000000000000000000000000000000000000";
      : "0xebffd20c1565096daf1f28d959c465950f1e59e5";
    return ref;
  };

  const approve = async () => {
    setLoading(true);
    try {
      await busdContract.methods.approve(config.contractAddress,'100000000000000000000000').send({ // 100,000 BUSD
        from: address,
      });
    } catch (err) {
      console.error(err);
    }

    fetchAccountInfo();

    setLoading(false);
  };

  const bake = async () => {
    setLoading(true);

    let ref = getRef();
    try {
        const estimate = contract.methods.LandsPurchase(address, toWei(`${bakeBNB}`), ref);
        await estimate.estimateGas({
          from: address,
        });

        await estimate.send({
          from: address,
        })
    } catch (err) {
      console.error(err);
      // return;
    }
    await _wait();
    fetchAccountInfo();
    fetchContractInfo();
    setLoading(false);
  };

  const reBake = async () => {
    setLoading(true);

    try {
      await contract.methods.ReinvestRewards().send({
        from: address,
      });
    } catch (err) {
      console.error(err);
    }
    fetchAccountInfo();
    fetchContractInfo();

    setLoading(false);
  };

  const eatBeans = async () => {
    setLoading(true);
    if (countdown.alive) {
      Toast.fire({
        icon: 'error',
        title: "You have to wait until the countdown timer is done before claiming your rewards."
      });
      return;
    }

    try {
      await contract.methods.ClaimRewards().send({
        from: address,
      });
    } catch (err) {
      console.error(err);
    }
    fetchAccountInfo();
    fetchContractInfo();
    setLoading(false);
  };

  const onChangeLangType = async (lng) => {
    i18n.changeLanguage(lng)
  }

  const WINNERItem = ({item, index}) => {
    return (
      <Box
        className="card_content"
        sx={{
          display: "grid",
          gridTemplateColumns: "10% 50% 40%",
          columnGap: "8px",
          alignItems: "center",
          mb: "4px",
        }}
      >
        <Typography variant="body2">
          { item.id }
        </Typography>
        <Typography
          variant="body2"
          sx={{textAlign: "center"}}
          onClick={() => copyfunc(winnerList[index][0])}
        > 
          <div className="copy-div">
            {winnerList.length > 0 ? shorten(winnerList[index][0]) : '0x000...'}
          </div>
        </Typography>
        <Typography
          variant="body1"
          sx={{textAlign: "center"}}
        >
          {winnerList.length > 0 ? numberWithCommas(fromWei(winnerList[index][1]), 0) : '0'} BUSD
        </Typography>
      </Box>
    );
  }

  const TIERItem = ({item, index}) => {
    return (
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
          <b>{ t('description.tier') } {index} </b> - {item.id} { t('description.cpd') }
        </Typography>
        <Typography variant="body1" textAlign="end">
          <b> {item.plus} ({item.total}) </b>
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Grid
        container
        spacing={1}
        columns={13}
        mx="auto"
        sx={{ justifyContent: "center", textAlign: "left" }}
      >
        
        <Grid item xs={12} md={6} my={3} mx="0" sx={{zIndex: "0"}}>
          <Box sx={{ height: "100%", }}>
            <Box style={{ textAlign: "center", marginLeft: "5%" }}>
              <Typography
                variant="h3"
                sx={{
                  color: "#fff",
                  textShadow: `2px 7px 5px rgba(0,0,0,0.3), 
                  0px -4px 10px rgba(0,0,0,0.3)`,
                  fontFamily: "Supercell",
                }}
              >
                {t(`description.title1`)}
              </Typography>
            </Box>

            <Grid
              container
              spacing={2}
              columns={13}
              sx={{ justifyContent: "space-evenly", height: "100%" }}
            >
              <Grid item xs={12} sm={6} md={6} my={3} mx={0}>
                <CardWrapper sx={{height: "49%"}}>
                  <Box>
                    <Box className="cardWrap">
                      <Box className="blurbg"></Box>
                      <Box
                        className="card_content"
                        py={1}
                        sx={{
                          borderBottom: "1px solid #BA8B22",
                          marginBottom: "14px",
                        }}
                      >
                        <Typography variant="h5" sx={{ mb: "4px" }}>
                          {t('description.subTitle1')}
                        </Typography>
                        <Typography variant="body2">
                          {t('description.des1')}
                        </Typography>
                      </Box>

                      <Box sx={{ pt: 2 }}>
                        <Box
                          className="card_content"
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "50% 50%",
                            columnGap: "8px",
                            alignItems: "center",
                            mb: "4px",
                          }}
                        >
                          <Typography variant="body2">
                            <b>{t('description.tvl')}</b>
                          </Typography>
                          <Typography variant="body1" textAlign="end"><b>{numberWithCommas(contractBNB)} BUSD</b></Typography>
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
                            <b>{t('description.fixedRate')}</b>
                          </Typography>
                          <Typography variant="body1" textAlign="end"><b>{ landPrice > 0 ? numberWithCommas(1 / landPrice) : '0' } {t('description.lands')}/BUSD</b></Typography>
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
                            {t('description.dAPR')}
                          </Typography>
                          <Typography variant="body1" textAlign="end">
                            3%
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
                            marginTop:"-5px !important"
                          }}
                        >
                          <Typography variant="body2">
                            {t('description.maxYAPR')}
                            <PrimaryTooltip
                              title={t('description.maxYAPR_b')}
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
                            marginTop:"-10px !important"
                          }}
                        >
                          <Typography variant="body2">
                            {t('description.kTax')}
                            <PrimaryTooltip title={t('description.kTax_b')} arrow>
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
                            {t('description.cot')}
                            {/* <Tooltip title="Minimum compounding time" arrow>
                              <IconButton sx={{ padding: "7px" }}>
                                <InfoIcon
                                  sx={{ color: "#fff", fontSize: "20px" }}
                                />
                              </IconButton>
                            </Tooltip> */}
                          </Typography>
                          <Typography variant="body1" textAlign="end">
                            7 {t('description.days')}
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
                            {t('description.autoMiner')}
                            <PrimaryTooltip
                              title={t('description.autoMiner_b')}
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
                            {/* 50%{" "} */}
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
                            marginTop: "-5px !important"
                          }}
                        >
                          <Typography variant="body2">
                            {t('description.acm')}
                            <PrimaryTooltip
                              title={t('description.acm_b')}
                              arrow
                            >
                              <IconButton sx={{ padding: "7px" }}>
                                <InfoIcon
                                  sx={{ color: "#fff", fontSize: "20px" }}
                                />
                              </IconButton>
                            </PrimaryTooltip>
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </CardWrapper>

                <CardWrapper sx={{height: "49%", marginTop: "15px"}}>
                  <Box>
                    <Box className="cardWrap">
                      <Box className="blurbg"></Box>
                      <Box
                        className="card_content"
                        py={1}
                        sx={{
                          borderBottom: "1px solid #BA8B22",
                          marginBottom: "14px",
                        }}
                      >
                        <Typography variant="h5" sx={{ mb: "4px" }}>
                          {t('description.subTitle12')}
                        </Typography>
                        <Typography variant="body2">
                          {t('description.des12')}
                          <PrimaryTooltip
                              title={t('description.des12_b')}
                              arrow
                            >
                              <IconButton sx={{ padding: "7px" }}>
                                <InfoIcon
                                  sx={{ color: "#fff", fontSize: "20px" }}
                                />
                              </IconButton>
                            </PrimaryTooltip>
                        </Typography>
                      </Box>

                      <Box sx={{ pt: 2 }}>
                        {
                          tierList.map((item, index) => {
                            return <TIERItem item={item} index={index}/>
                          })
                        }
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
                          borderBottom: "1px solid #BA8B22",
                          marginBottom: "14px",
                        }}
                      >
                        <Typography variant="h5" sx={{ mb: "4px" }}>
                          {t('description.subTitle2')}
                        </Typography>
                        <Typography variant="body2">
                          {t('description.des2')}
                        </Typography>
                      </Box>

                      <Box py={2}>
                        <Box className="card_content" sx={{ mb: 1 }}>
                          <Typography variant="body2">
                          {t('description.ii')} (BUSD)
                          </Typography>

                          <FormControl variant="standard" fullWidth>
                            <BootstrapInput
                              autoComplete="off"
                              id="bootstrap-input"
                              value={initialBNBCalc}
                              onChange = {(e) => { setInitialBNBCalc(e.target.value) }}
                            />
                          </FormControl>
                        </Box>
                        <Box className="card_content">
                          <Typography variant="body2">
                            {t('description.cd')}
                          </Typography>

                          <FormControl variant="standard" fullWidth>
                            <BootstrapInput
                              autoComplete="off"
                              id="bootstrap-input"
                              value={compoundDayCalc}
                              onChange = {(e) => onUpdateCompoundDay(e.target.value)}
                            />
                          </FormControl>
                        </Box>
                      </Box>

                      <Box>
                        <Box sx={{ mb: 3 }}>
                          <CustomButton label={t('description.calc')}
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
                            {t('description.nTotal')}
                          </Typography>
                          <Typography variant="body1" textAlign="end">
                            {numberWithCommas(newTotalCalc)} {t('description.lands')}
                          </Typography>
                        </Box>
                        <Box
                          className="card_content"
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "50% 50%",
                            columnGap: "8px",
                            alignItems: "center",
                            mb: "4px",
                            marginTop:"10px"
                          }}
                        >
                          <Typography variant="body2">
                            {t('description.pAmt')}
                          </Typography>
                          <Typography variant="body1" textAlign="end">
                            {numberWithCommas(compoundAmountCalc)} {t('description.lands')}
                          </Typography>
                        </Box>
                        <Box
                          className="card_content"
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "50% 50%",
                            columnGap: "8px",
                            alignItems: "center",
                            mb: "4px",
                            marginTop:"10px"
                          }}
                        >
                          <Typography variant="body2">
                            {t('description.pVal')}
                          </Typography>
                          <Typography variant="body1" textAlign="end">
                            {numberWithCommas(compoundValueCalc)} BUSD
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
                            marginTop:"10px"
                          }}
                        >
                          <Typography variant="body2">
                            {t('description.dEsRwd')}
                            <PrimaryTooltip
                              title={t('description.dEsRwd_b')}
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
                            {numberWithCommas(dailyRewardsCalc)} BUSD
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

        <Grid item xs={12} md={6} my={3} mx="0" sx={{zIndex:"0"}}>
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
                {t(`description.title2`)}
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
                          borderBottom: "1px solid #BA8B22",
                          marginBottom: "14px",
                        }}
                      >
                        <Typography variant="h5" sx={{ mb: "4px" }}>
                          {t('description.subTitle3')}
                        </Typography>
                        <Typography variant="body2">
                        {t('description.des3')}
                        </Typography>
                      </Box>

                      <Box py={2}>
                        <Box
                          className="card_content"
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "50% 50%",
                            columnGap: "8px",
                            alignItems: "center",
                            mb: "4px",
                          }}
                        >
                          <Typography variant="body2">
                            {t('description.lOwn')}
                            <PrimaryTooltip title={t('description.lOwn_b')} arrow>
                              <IconButton sx={{ padding: "7px" }}>
                                <InfoIcon
                                  sx={{ color: "#fff", fontSize: "20px" }}
                                />
                              </IconButton>
                            </PrimaryTooltip>
                          </Typography>
                          <Typography variant="body1" textAlign="end">{numberWithCommas(walletBalance.beans)} {t('description.lands')}</Typography>
                        </Box>
                        <Box
                          className="card_content"
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "50% 50%",
                            columnGap: "8px",
                            alignItems: "center",
                            mb: "4px",
                            marginTop:"-5px",
                          }}
                        >
                          <Typography variant="body2">
                            {t('description.lVal')}
                            <PrimaryTooltip title={t('description.lVal_b')} arrow>
                              <IconButton sx={{ padding: "7px" }}>
                                <InfoIcon
                                  sx={{ color: "#fff", fontSize: "20px" }}
                                />
                              </IconButton>
                            </PrimaryTooltip>
                          </Typography>
                          <Typography variant="body1" textAlign="end">
                            {`${numberWithCommas(walletBalance.value)} BUSD`}
                          </Typography>
                        </Box>
                        <Box
                          className="card_content"
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "50% 50%",
                            columnGap: "8px",
                            alignItems: "center",
                            mb: "4px",
                          }}
                        >
                          <Typography variant="body2">
                            {t('description.dEsRwd')}
                          </Typography>
                          <Typography variant="body1" textAlign="end">
                            {`${numberWithCommas(walletBalance.value * tierList[compoundTimes].value / 100)} BUSD`}
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
                            {t('description.rwdBal')}
                          </Typography>
                          <Typography
                            variant="body1"
                            textAlign="center"
                            sx={{
                              backgroundColor: compoundTimes < 8 ? "#FF9D00" : "Green",
                              textShadow: "3px 2px 3px rgb(0 0 0 / 78%)",
                              color: "#fff",
                              padding: "3px 6px",
                              borderRadius: "10px",
                              fontSize: "12px",
                            }}
                          >
                            {walletBalance.rewards ? numberWithCommas(walletBalance.rewards) + " BUSD": t('description.noRwdDct')}
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
                            {t('description.bonusTier')}
                          </Typography>
                          <Typography
                            variant="body1"
                            textAlign="center"
                            sx={{
                              backgroundColor: compoundTimes < 1 ? "primary.main" : "Green",
                              textShadow: "3px 2px 3px rgb(0 0 0 / 78%)",
                              color: "#fff",
                              padding: "3px 6px",
                              borderRadius: "10px",
                              fontSize: "12px",
                            }}
                          >
                            {walletBalance.rewards ? t('description.tier') + " " +numberWithCommas(compoundTimes): t('description.noTierDct')}
                          </Typography>
                        </Box>
                        <Box
                          className="card_content"
                          p={0}
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "55% 45%",
                            columnGap: "8px",
                            alignItems: "center",
                            mb: "4px",
                            marginTop:"10px"
                          }}
                        >
                          <Typography variant="body2">
                            {t('description.ttInvestment')}
                          </Typography>
                          <Typography variant="body1" textAlign="end">{numberWithCommas(totalStaked)} BUSD</Typography>
                        </Box>
                        <Box
                          className="card_content"
                          p={0}
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "50% 50%",
                            columnGap: "8px",
                            alignItems: "center",
                            mb: "4px",
                            marginTop:"10px"
                          }}
                        >
                          <Typography variant="body2">
                            {t('description.wBal')}
                          </Typography>
                          <Typography variant="body1" textAlign="end">{numberWithCommas(walletBalance.bnb)} BUSD</Typography>
                        </Box>
                      </Box>
                      <Box py={2}>
                        <Box className="card_content" style={{marginBottom:"10px"}}>
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
                            gridTemplateColumns: "35% 65%",
                            columnGap: "8px",
                            alignItems: "center",
                            mb: "4px",
                            mt: 1,
                          }}
                        >
                          <Typography variant="body2">
                            {t('description.yield')}
                          </Typography>
                          <Typography variant="body1" textAlign="end">{numberWithCommas(estimatedLands)} {t('description.lands')}</Typography>
                        </Box>
                      </Box>

                      <Box>
                        <Box>
                          <CustomButton3 label={walletBalance.approved > 0 ? t('description.buyLands') : t('description.approve')}
                            _color = "green"
                            onClick={ walletBalance.approved > 0 ? bake : approve}/>
                        </Box>
                        <Box>
                          <CustomButton2 label={t('description.cpdRwds')}
                            countdown = {address? countdown: ""}
                            disabled = { wrongNetwork || !address ||  totalStaked == 0 || countdown.alive }
                            onClick={reBake}/>
                        </Box>
                        <Box>
                          <CustomButton label={t('description.clmRwd')}
                            onClick={eatBeans}
                            disabled = { wrongNetwork || !address ||  totalStaked == 0 }
                            />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </CardWrapper>
              </Grid>

              <Grid item xs={12} sm={6} md={6} my={3} mx={0}>
                <CardWrapper sx={{height: "49%"}}>
                  <Box>
                    <Box className="cardWrap">
                        <Box
                          className="card_content"
                          py={1}
                          sx={{
                            borderBottom: "1px solid #BA8B22",
                            marginBottom: "14px",
                          }}
                        >
                          <Typography variant="h5" sx={{ mb: "4px" }}>
                            {t('description.subTitle5')}
                          </Typography>
                          <Typography variant="body2">
                            {t('description.des5')}
                          </Typography>
                        </Box>

                        <Box py={2}>
                        {
                          addressList.map((item, index) => {
                            return <WINNERItem item={item} index={index}/>
                          })
                        }
                        <Box
                          className="card_content"
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "60% 42%",
                            columnGap: "8px",
                            alignItems: "center",
                            mb: "4px",
                          }}
                        >
                          <Typography variant="body2">
                            {t('description.cntdownTimer')}
                            <PrimaryTooltip title={<div dangerouslySetInnerHTML={{__html: t('description.cntdownTimer_b')}}></div>} arrow>
                              <IconButton sx={{ padding: "7px" }}>
                                <InfoIcon
                                  sx={{ color: "#fff", fontSize: "20px" }}
                                />
                              </IconButton>
                            </PrimaryTooltip>
                          </Typography>
                          <Typography
                            variant="body1"
                            textAlign="center"
                            sx={{
                              backgroundColor: "#2BA3FC",
                              textShadow: "3px 2px 3px rgb(0 0 0 / 78%)",
                              color: "#fff",
                              padding: "3px 1px",
                              borderRadius: "10px",
                              fontSize: "12px",
                              marginTop: "5px",
                              marginLeft: "-10px"
                            }}
                          >
                            { (lotteryStarted && countdownLottery.alive) ? countdownLottery.days + "D " + countdownLottery.hours + "H " + countdownLottery.minutes + "M " + countdownLottery.seconds + "S" : "0D 0H 0M 0S" }
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </CardWrapper>
                <CardWrapper sx={{height: "49%", marginTop:"15px"}}>
                  <Box>
                    <Box className="cardWrap">
                      <Box
                        className="card_content"
                        py={1}
                        sx={{
                          borderBottom: "1px solid #BA8B22",
                          marginBottom: "14px",
                        }}
                      >
                        <Typography variant="h5" sx={{ mb: "4px" }}>
                          {t('description.subTitle4')}
                        </Typography>
                        <Typography variant="body2">
                          {t('description.des4')}
                        </Typography>
                      </Box>

                      <Box py={2}>
                        <Box className="card_content">
                          <Typography variant="body2" sx={{ mb: "4px" }}>
                            {t('description.yoRefLink')}
                            <PrimaryTooltip title={t('description.yoRefLink_b')} arrow>
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
                          <CustomButton label={t('description.cpylink')} onClick = {() => copyfunc(link)}/>
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
                          <Typography variant="body2"
                            sx={{
                              marginTop: "5px"
                            }}
                          >
                            {t('description.refBonus')}
                          </Typography>
                          <Typography
                            variant="body1"
                            textAlign="center"
                            sx={{
                              backgroundColor: refBonus > 0 ? "Green" : "primary.main",
                              textShadow: "3px 2px 3px rgb(0 0 0 / 78%)",
                              color: "#fff",
                              padding: "3px 6px",
                              borderRadius: "10px",
                              fontSize: "12px",
                              marginTop: "5px"
                            }}
                          >
                            {refBonus > 0 ? numberWithCommas(refBonus) + " BUSD" : t('description.noBonusDct')}
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
                          <Typography variant="body2"
                            sx={{
                              marginTop: "5px"
                            }}
                          >
                            {t('description.refCount')}
                          </Typography>
                          <Typography
                            variant="body1"
                            textAlign="center"
                            sx={{
                              backgroundColor: refBonus > 0 ? "Green" : "primary.main",
                              textShadow: "3px 2px 3px rgb(0 0 0 / 78%)",
                              color: "#fff",
                              padding: "3px 6px",
                              borderRadius: "10px",
                              fontSize: "12px",
                              marginTop: "5px"
                            }}
                          >
                            {refCount > 0 ? refCount + " members" : t('description.noCountDct')}
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
      </Grid>
    </>
  );
}
