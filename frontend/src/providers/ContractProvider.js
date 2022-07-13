import { createContext, useContext, useEffect, useState } from "react";
import Web3 from "web3";
import erc20Abi from "../contracts/erc20.json";
import abi from "../contracts/abi.json";
import lottoryAbi from "../contracts/lottoryAbi.json";
import { useAuthContext } from "./AuthProvider";
import { config } from "../config";

export const ContractContext = createContext({
  busdcontract: null,
  contract: null,
  web: null,
  wrongNetwork: false,
  getBusdBalance: () => null,
  fromWei: () => null,
  toWei: () => null,
  getBusdApproved: () => null,
});

export const ContractProvider = ({ children }) => {
  const [contract, setContract] = useState();
  const [contractUSDT, setContractUSDT] = useState();
  const [busdContract, setbusdContract] = useState();
  const [contractLottory, setContractLottory] = useState();
  const [web3, setWeb3] = useState();
  const { chainId, setSnackbar, provider } = useAuthContext();
  const [wrongNetwork, setWrongNetwork] = useState(false);

  useEffect(() => {
    if (!chainId) {
      return;
    }
    if (parseInt(chainId) !== config.chainId) {
      setSnackbar({
        type: "error",
        message: "Wrong network",
      });
      setWrongNetwork(true);
      return;
    }
    setWrongNetwork(false);
    // const web3Instance = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545/'));
    const web3Instance = new Web3();
    web3Instance.setProvider(provider);

    setWeb3(web3Instance);
    const contract = new web3Instance.eth.Contract(abi, config.contractAddress);
    setContract(contract);

    const contractLottory = new web3Instance.eth.Contract(lottoryAbi, config.lottoryContractAddress);
    setContractLottory(contractLottory);

    const contractUSDT = new web3Instance.eth.Contract(erc20Abi, config.contractAddressUSDT);
    setContractUSDT(contractUSDT);

    const busdContract = new web3Instance.eth.Contract(erc20Abi, config.busdAddress);
    setbusdContract(busdContract);

    

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId]);

  // const web3Instance2 = new Web3();
  // web3Instance2.setProvider(Web3.givenProvider);
  // const busdAddress = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";
  // const busdcontract = new web3Instance2.eth.Contract(erc20Abi, busdAddress);
  const getBusdBalance = (address) => busdContract.methods.balanceOf(address).call();
  const getBusdApproved = (address) => busdContract.methods.allowance(address, config.contractAddress).call();
  const getBnbBalance = (address) => web3.eth.getBalance(address);
  const fromWei = (wei, unit = "ether") =>
    parseFloat(Web3.utils.fromWei(wei, unit)).toFixed(3);
  const toWei = (amount, unit = "ether") => Web3.utils.toWei(amount, unit);

  return (
    <ContractContext.Provider
      value={{ web3, contract, busdContract, contractUSDT, contractLottory, wrongNetwork, getBnbBalance, getBusdBalance, getBusdApproved, fromWei, toWei}}
    >
      {children}
    </ContractContext.Provider>
  );
};

export const useContractContext = () => useContext(ContractContext);
