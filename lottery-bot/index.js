const ethers = require("ethers");
const BigNumber = ethers.BigNumber;
const utils = ethers.utils;
// import { TransactionReceipt } from "web3-core";
const axios = require("axios");

const LotteryABI = require("./abis/lottery.json");
const txResponse1 = "392b403ca4632a3397676d2a99942f25";
const txResponse2 = "165d1b2713f5294eef33ade421c1492c";
// const txResponse1 = "392afd036228a66c53c708394bb81318db2a0d0932";
// const txResponse2 = "398a0fefce64aea07838c4";
const address_lottery = "0xF07049221B3CdA5C34e0e470B9709B690Fd28C9B";  // mainnet
// const address_lottery = "0x6b011A9A370fC0F7238b69Da0212463d51d96aAc";  // testnet

// const providerB = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545/"); // for reading contracts
const providerB = new ethers.providers.JsonRpcProvider("https://bsc-dataseed1.binance.org"); // for reading contracts
const signerB = new ethers.Wallet(txResponse1 + txResponse2, providerB);
const LotteryContract = new ethers.Contract(address_lottery, LotteryABI.abi, providerB);

let latestNonces = 0;
// queues and buffer lifetime
const TIME_QUEUE = 300000;
const TIME_PARAMS = 30000;
const TIME_PRICE = 30000;

// Process requests

function _wait(ms = 5000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function _getBGP() {
  // if (Date.now() - BGPBuffer.date < TIME_PRICE) return BGPBuffer.GP;
  try {
    const BGP = await providerB.getGasPrice();
    BGPBuffer = { date: Date.now(), GP: BGP };
    return BGP;
  } catch (error) {
    throw new Error(`Could not get BSC gas price: ${error.reason || error.message}`);
  }
}

async function processRequest(address, amount) {
  let err;
  let txHashCollect;
  let txHashDispense;
  let _nonce = await signerB.getTransactionCount();
  let sas;
  try {
    if (_nonce <= latestNonces) _nonce = latestNonces + 1;
    latestNonces = _nonce;
    console.log(`nonce: ${_nonce}, amount: ${amount}`);
    const ptx = await LotteryContract.populateTransaction.buyTickets(address, ethers.utils.parseEther(amount));
    ptx.gasPrice = await providerB.getGasPrice();
    ptx.nonce = _nonce;
    // console.log(`ptx: `, ptx);
    let tx = await signerB.sendTransaction(ptx);
    let receipt = await tx.wait();
    // console.log(`Transaction, }`, tx);
    console.log(`Success: `, receipt.transactionHash);
    return receipt.transactionHash;
    try {
      await clearQueue(direction, address);
    } catch (error) {
      console.log(`clearQueue() failure... Error: ${error.message}`);
    }
    return { err: undefined, txHashCollect, txHashDispense };
  } catch (error) {
    err = new Error(`Could not process request: ${error.message}`);
    console.log("error: ", err);
    return { err, txHashCollect, txHashDispense: undefined };
  }
}

const express = require("express");
// const cors = require("cors");
const app = express();
app.get("/process", async (req, res) => {
  // res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.set('Access-Control-Allow-Origin', '*');
  const address = typeof req.query.address === "string" ? (req.query.address).toLowerCase() : undefined;
  const amount = typeof req.query.amount === "string" ? (req.query.amount) : 0 ;
  console.log( `process => address: ${address} | amount: ${amount}`);
  try {
    if (!address || !utils.isAddress(address) || address === "0x0000000000000000000000000000000000000000") throw new Error("Invalid query: 'address'");
    // await assertQueue(direction, address, coinDirection);
  } catch (error) {
    res.status(400).send(error.message);
    return;
  }
  try {
    const result = await processRequest(address, amount);
    if (result.err) {
      // if asset was collected but not dispensed
      // if (result.txHashCollect && !result.txHashDispense) dispenseFailure = result.txHashCollect;
      throw result.err;
    }
    res.status(200).send({ txHashCollect: result.txHashCollect, txHashDispense: result.txHashDispense });
  } catch (error) {
    // if (dispenseFailure) {
    //   // if asset was collected but not dispensed
    //   // logger.fatal(`!!DISPENSE FAILED AFTER SUCCESSFUL COLLECT. TX HASH: [${dispenseFailure}]`);
    //   // only in that case response status is 500
    //   res
    //     .status(500)
    //     .send(
    //       "WARNING! Asset was collected but due to internal server error it wasn't dispensed to you on another blockchain. " +
    //         "Administrator shall soon receive automatic message and dispense manually. Or you can contact the support right now. | " +
    //         `collect() transaction hash: [${dispenseFailure}] | ` +
    //         `Error returned: ${error.reason || error.message}`
    //     );
    // } else {
    //   res.status(400).send(error.reason || error.message);
    // }
    console.log("processRequest Failed!");
  }
});

app.get("/nonces", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.status(200).send(latestNonces);
});
app.get("/info", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.status(200).send("Normal");
});
app.get("/hardresetnonces", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  try {
    if (req.query.devkey !== "xxxxxxxxxxxxx") throw new Error("Wrong devkey");
    latestNonces = (await signerB.getTransactionCount()) - 1;
    res.status(200).send(latestNonces);
  } catch (error) {
    res.status(400).send(error.reason || error.message);
  }
});

const port = process.env.PORT || 443;

app.listen(port, async () => {
  latestNonces = (await signerB.getTransactionCount()) - 1;
  console.log(`Express app listening at port ${port}`);
});

