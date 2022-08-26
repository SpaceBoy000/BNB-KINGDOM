/* eslint-disable react-hooks/exhaustive-deps */
import { useRef } from "react";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import { AiOutlineCopy } from "react-icons/ai";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/system";
import { useLocation } from "react-router-dom";
import Web3 from "web3";

import { useContractContext } from "../../providers/ContractProvider";
import { useAuthContext } from "../../providers/AuthProvider";
import { useEffect, useState } from "react";
import { config } from "../../config";
import Connect from "./Connect";
import { Toast } from "../../util"
import logoTitle from "../../assets/logo-title.png";
import { shorten } from "./Connect";

const Wrapper = styled("div")(({ theme }) => ({
  maxWidth: "1000px",
  // width: "70%",
  margin: "0 auto",
  color: "white",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "100%",
    width: "90%"
  },
}));


const Logo = styled("img")(({ theme }) => ({
  margin: "auto",
}));

const ButtonContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    "> div": {
      marginLeft: 0,
      marginRight: 0,
    },
  },
}));

let timeout = null;

function useQuery() {
  return new URLSearchParams(useLocation().search);
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
  const { contract, busdContract, contractLottory, wrongNetwork, getBnbBalance, getBusdApproved, getBusdBalance, fromWei, toWei, web3 } =
    useContractContext();
  const vidRef = useRef(null);
  const { address, chainId } = useAuthContext();
  const [contractBNB, setContractBNB] = useState(0);
  const [compoundTimes, setCompoundTimes] = useState(0);
  const [lastHatch, setLasthatch] = useState(0);
  const [lastHatchTimePool, setLasthatchTimePool] = useState(0);
  const [lastUser, setLastUser] = useState('');
  const [poolSize, setPoolSize] = useState(0);
  const [walletBalance, setWalletBalance] = useState({
    bnb: 0,
    beans: 0,
    rewards: 0,
    approved: 0,
  });
  const [countdown, setCountdown] = useState({
    alive: true,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [countdownTimePool, setCountdownTimePool] = useState({
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
        const last = Number(lastHatch);
        const data = getCountdown(last + 86400 + 110); //24 * 3600
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
  }, [lastHatch])

  useEffect(() => {
    const intervalID = setInterval(() => {
      try {
        const last = Number(lastHatchTimePool);
        const data = getCountdown(last + 3600); //24 * 3600
        setCountdownTimePool({
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
  }, [lastHatchTimePool])
  
  const [calcAmount, setCalcAmount] = useState(0);
  const [referralCount, setReferralCount] = useState(0);
  const [referralAmount, setReferralAmount] = useState(0);
  const [bakeBNB, setBakeBNB] = useState(0);
  const [calculatedBeans, setCalculatedBeans] = useState(0);
  const [loading, setLoading] = useState(false);
  const [win, setWin] = useState(null);
  const query = useQuery();

  const onChangeCalc = (value) => {

  }

  const link = `${window.origin}?ref=${address}`;
  // console.log("link: ", link);

  const nutritionFacts = [
    {
      label: "Daily Return",
      value: 8,
    },
    {
      label: "APR",
      value: "2,920",
    },
    {
      label: "Dev Fee",
      value: 2,
    },
    {
      label: "Treasury",
      value: 2,
    },
    {
      label: "Invested Back in Amplifier",
      value: 3,
    },
  ];

  const fetchContractBNBBalance = () => {
    if (!web3 || wrongNetwork) {
      setContractBNB(0);
      return;
    }
    getBusdBalance(config.contractAddress).then((amount) => {
      setContractBNB(fromWei(amount));
    });
  };

  const fetchWalletBalance = async () => {
    if (!web3 || wrongNetwork || !address) {
      setWalletBalance({
        bnb: 0,
        beans: 0,
        rewards: 0,
        approved: 0.
      });
      setReferralCount(0);
      setReferralAmount(0);
      setCompoundTimes(0);
      return;
    }

    try {
      const [bnbAmount, approvedAmount, beansAmount, rewardsAmount, lastHatch, lastUser, lastHatchTimePool, poolSize, userInfo] = await Promise.all([
        getBusdBalance(address),
        getBusdApproved(address),
        contract.methods
          .getMyMiners(address)
          .call()
          .catch((err) => {
            console.error("myminers", err);
            return 0;
          }),
        contract.methods
          .MyReward(address)
          .call()
          .catch((err) => {
            console.error("beanrewards", err);
            return 0;
          }),
        contract.methods
          .lastHatch(address)
          .call()
          .catch((err) => {
            console.error("beanrewards", err);
            return 0;
          }),
        contractLottory.methods
          .lastUser()
          .call()
          .catch((err) => {
            console.error("beanrewards", err);
            return 0;
          }),
        contractLottory.methods
          .moment()
          .call()
          .catch((err) => {
            console.error("beanrewards", err);
            return 0;
          }),
        contractLottory.methods
          .poolSize()
          .call()
          .catch((err) => {
            console.error("beanrewards", err);
            return 0;
          }),
        contract.methods
          .users(address)
          .call()
          .catch((err) => {
            console.error("beanrewards", err);
            return 0;
          }),
      ]);


      setWalletBalance({
        bnb: fromWei(`${bnbAmount}`),
        beans: beansAmount,
        rewards: fromWei(`${rewardsAmount}`),
        approved: fromWei(`${approvedAmount}`)
      });

      console.log('poolSize: ', poolSize);
      // setCompoundTimes(compoundTimes);
      setLasthatch(lastHatch);

      setLasthatchTimePool(lastHatchTimePool);
      setLastUser(lastUser);
      setPoolSize(fromWei(`${poolSize}`));

      console.log("rewardsAmount: ", rewardsAmount, " : ", fromWei(`${rewardsAmount}`));

      setReferralCount(userInfo.referrals);
      setReferralAmount(fromWei(`${userInfo.refAmount}`));
    } catch (err) {
      console.error(err);
      setWalletBalance({
        bnb: 0,
        beans: 0,
        rewards: 0,
        approved: 0,
      });
      setReferralCount(0);
      setReferralAmount(0);
    }
  };

  useEffect(() => {
    fetchContractBNBBalance();
  }, [web3, chainId]);

  useEffect(() => {
    fetchWalletBalance();
  }, [address, web3, chainId]);

  const onUpdateBakeBNB = (value) => {
    setBakeBNB(value);
  };

  const getRef = () => {
    const ref = Web3.utils.isAddress(query.get("ref"))
      ? query.get("ref")
      // : "0xCB376BaAf5216F392F116F1907b1F4578E464308";
         : "0x0000000000000000000000000000000000000000";
    return ref;
  };

  const approve = async () => {
    setLoading(true);
    try {
      await busdContract.methods.approve(config.contractAddress,'100000000000000000000000').send({ // 100,000 ETH
        from: address,
      });
    } catch (err) {
      console.error(err);
    }
    fetchWalletBalance();

    setLoading(false);
  };

  const bake = async () => {
    setLoading(true);

    const ref = getRef();

    try {
      await contract.methods.buyMiners(ref, toWei(`${bakeBNB}`)).send({
        from: address,
        // value: toWei(`${bakeBNB}`),
      });
    } catch (err) {
      console.error(err);
    }
    fetchWalletBalance();
    fetchContractBNBBalance();
    setLoading(false);
  };

  const reBake = async () => {
    setLoading(true);

    // const ref = getRef();

    try {
      await contract.methods.reinvest().send({
        from: address,
      });
    } catch (err) {
      console.error(err);
    }
    fetchWalletBalance();
    fetchContractBNBBalance();
    setLoading(false);
  };

  const eatBeans = async () => {
    setLoading(true);

    // if (countdown.alive) {
    //   Toast.fire({
    //     icon: 'error',
    //     title: "You should wait until the countdown timer is done."
    //   });
    //   setLoading(false);
    //   return;
    // }

    try {
      await contract.methods.sellTokens().send({
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
    <div style={{ textAlign: "center" }}>
      <Wrapper>
        {/* {loading ? <Logo src={logoGif} ref={vidRef} id="video1" alt="site logo" /> : <Logo src={logoPng} ref={vidRef} id="video1" alt="site logo" />} */}
        {/* <div className="font-effect-shadow-multiple" style={{ fontWeight: "bold", fontSize: "70px", color: "#c0c602", marginBottom: "20px", marginLeft: "10px", fontFamily: "monospace", textAlign:"center" }}> BUSD BANK</div> */}
        {/* <img src={ logoTitle } alt="" className="logoTitle"/> */}
        {/* <Connect responsive = { false }/> */}
        <p className="title">
          Speculate Less, Earn More
        </p>

        <span className="content">
          Join the most user oriented Mining platform and generate a predictable income on your crypto assets. Keep calm, no matter if crypto prices rise or fall.
        </span>

        <div className="dashboard">DASHBOARD</div>
        <div className="main-board">
          <Grid style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
            <div>Total Value Locked</div>
            <div>{ contractBNB } BUSD</div>
          </Grid>
          <Grid style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
            <div>Wallet Balance</div>
            <div>{ walletBalance.bnb } BUSD</div>
          </Grid>
          <Grid style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
            <div>Your Miners</div>
            <div>{ walletBalance.beans } MINERS</div>
          </Grid>

          <input 
            className="input-box"
            type="number"
            min={0}
            max={+walletBalance.bnb}
            value={bakeBNB}
            placeholder="Enter BUSD Amount"
            onChange={ e => {setBakeBNB(e.target.value)}}>
          </input>
          {/* <Grid style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
            <div className="input-box" style={{width:"49%", padding:"10px 5px"}}>
              <Grid style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
                <div>Min</div>
                <div>0.01 BUSD</div>
              </Grid>
            </div>
            <div className="input-box" style={{width:"49%", padding:"10px 5px"}}>
              <Grid style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
                <div>Max</div>
                <div>50 BUSD</div>
              </Grid>
            </div>
          </Grid> */}
          <button 
            className="main-button"
            disabled={wrongNetwork || !address }
            onClick={ walletBalance.approved > 0 ? bake : approve }
          >
            {walletBalance.approved > 0 ? 'BUY MINERS' : 'APPROVE'} 
          </button>

          {/* <Grid style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
            <div>Compound Counter</div>
            <div>{ compoundTimes }</div>
          </Grid> */}
          
          {/* <Grid style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
            <Typography variant="body1" fontSize="22px" fontWeight="bolder" color="white">
              Compound Counter
            </Typography>
            <Typography variant="h5" fontWeight="bolder" 
              sx = {{
                color: compoundTimes >= 6 ? "Green" : "white"
              }}
            >
              { compoundTimes }
            </Typography>
          </Grid> */}

          <Grid style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
            <div>Total BUSD Earned</div>
            <div>{ walletBalance.rewards } BUSD</div>
          </Grid>

          <button
            className="main-button"
            disabled={wrongNetwork || !address }
            onClick={ reBake }
          >
            { 'RE-MINING' }
          </button>

          <button 
            className="main-button"
            disabled={wrongNetwork || !address }
            onClick={eatBeans}
          >
            WITHDRAW
          </button>

          {/* <div style={{ textAlign:"center" }}>6.66% Daily Return for 30 days - 200% ROI(no limits, deposit any amount any times)</div>
          <div style={{ textAlign:"center" }}>10% Referral Reward | 10% Dev fee (not affect on your deposit and earnings amount)</div> */}
        </div>
        <div className="dashboard">STATISTICS</div>
        <div className="main-board">
          <Grid style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
            <div>Daily ROI</div>
            <div>10%</div>
          </Grid>
          <Grid style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
            <div>APR</div>
            <div>3650%</div>
          </Grid>
          <Grid style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
            <div>Dev Fee</div>
            <div>10%</div>
          </Grid>
        </div>

        <div className="dashboard">REFERRAL PROGRAM</div>
        <div className="main-board">
          <div style={{ textAlign:"center",  }}>Invite Your Friends. Earn Together</div>
          <div style={{width: "100%", display:"flex", alignItems:"center", position: "relative"}}>
            <input 
              className="input-box"
              value = { address ? link: ''}
              placeholder="Connect Wallet"
              sx={{border: 'none'}}
              readOnly>
            </input>
            <div style={{position:"absolute", right: "0px", top:"0px", bottom:"0px", height: "100%", display: "flex", alignItems:"center"}}>
              <AiOutlineCopy className="copyIcon"  onClick={() => { copyfunc(link) }}/> 
            </div>
          </div>
          <div style={{ textAlign:"center" }}>Earn 10% of every buy when someone uses your referral link!</div>
          <Grid style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
            <div>Active friends</div>
            <div>{ referralCount }</div>
          </Grid>
          <Grid style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
            <div>Total Earned</div>
            <div>{ referralAmount } BUSD</div>
          </Grid>
        </div>

        <div className="dashboard">JACKPOT POOL</div>
        <div className="main-board">
          <div style={{ textAlign:"center" }}>
            <span>If there are no purchases of the amount of $50 or more within an hour after you, then the entire amount of JACKPOT will automatically be credited to your wallet. This is guaranteed by a </span>
            <a href={ config.timepoolLink } target="_blank">smart contract</a>
          </div>
          <Grid style={{display:"flex", justifyContent:"center", width:"100%"}}>
            <div>{ countdownTimePool.alive ? countdownTimePool.minutes + " : " + countdownTimePool.seconds : "00 : 00" }</div>
          </Grid>
          <Grid style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
            <div>Time Pool Size</div>
            <div>{ poolSize } BUSD</div>
          </Grid>
          <Grid style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
            <div>Last Wallet Address</div>
            <div>{ lastUser ? shorten(lastUser) : "" }</div>
          </Grid>
        </div>

        <div className="dashboard">BUSD PAY BENEFITS</div>
        <div className="main-board">
          <div className="benefit-row">
            <div className="benefit-item">
              <div className="mt-[25px] flex">
                <img
                  src="/img/1.png"
                  className="mx-auto w-[40px] h-[40px]"
                  alt="icon"
                />
              </div>
              <p className="mt-[23px] mb-[24px] text-xl text-center text-white">
                Earn a predictable income
              </p>
            </div>
            <div className="benefit-item">
              <div className="mt-[25px] flex">
                <img
                  src="/img/3.png"
                  className="mx-auto w-[40px] h-[40px]"
                  alt="icon"
                />
              </div>
              <p className="mt-[23px] mb-[24px] text-xl text-center text-white">
                Confidence while investing
              </p>
            </div>
          </div>
          <div className="benefit-row">
            <div className="benefit-item">
              <div className="mt-[25px] flex">
                <img
                  src="/img/4.png"
                  className="mx-auto w-[40px] h-[40px]"
                  alt="icon"
                />
              </div>
              <p className="mt-[23px] mb-[24px] text-xl text-center text-white">
                Win in the bear market
              </p>
            </div>
            <div className="benefit-item">
              <div className="mt-[25px] flex">
                <img
                  src="/img/2.png"
                  className="mx-auto w-[40px] h-[40px]"
                  alt="icon"
                />
              </div>
              <p className="mt-[23px] mb-[24px] text-xl text-center text-white">
                Save your valuable time
              </p>
            </div>
          </div>
        </div>

        <div className="dashboard">CALCULATOR</div>
        <div className="main-board" style={{flexDirection:"row", textAlign:'left', justifyContent:'space-between'}}>
          <div style={{width:"60%"}}>
            <h4 style={{width:"100%"}}>BUSD AMOUNT</h4>
            <div>
              <input
                value={ calcAmount }
                className="calc-input"
                placeholder="Enter BUSD Amount"
                onChange={ e => {setCalcAmount(e.target.value)}}
              />
            </div>
            <p className="mt-[40px] text-white text-xl w-3/4 md:w-1/2">
              Amount of returns calculated on the basis of investment amount. 
              Note: Min investment is 35 BUSD & max amount of investment in 100k BUSD.
            </p>
          </div>
          <div className="calc-result">
            <h4>Return of Investment</h4>
            <div style={{display:"flex", justifyContent:"space-between"}}>
              <span>
                Day
              </span>
              <span >{ Number(calcAmount * 0.1).toFixed(3) } BUSD</span>
            </div>
            <div style={{display:"flex", justifyContent:"space-between"}}>
              <span>
                Week
              </span>
              <span>{ Number(calcAmount * 0.7).toFixed(3) } BUSD</span>
            </div>
            <div style={{display:"flex", justifyContent:"space-between"}}>
              <span >
                Month
              </span>
              <span >{ Number(calcAmount * 3).toFixed(3) } BUSD</span>
            </div>
          </div>
        </div>

      </Wrapper>
      
    </div>
  );
}
