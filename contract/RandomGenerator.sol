// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

interface IRandomGenerator {
    function getRandomNumber(uint _count) external view returns (uint);
}

contract RandomGenerator is IRandomGenerator {

    AggregatorV3Interface internal priceFeed;

    /**
     * Network: AVAX Testnet
     * Aggregator: AVAX/USD
     * Address: 0x5498BB86BC934c8D34FDA08E81D444153d0D06aD
     * BSC Testnet: 0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526
     * BSC Mainnet: 0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE
     */
    constructor() {
        priceFeed = AggregatorV3Interface(0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE);
    }

    /**
     * Returns the latest price
     */
    function getLatestPrice() public view returns (int) {
        (
            /*uint80 roundID*/,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceFeed.latestRoundData();
        return price;
    }

    function getRandomNumber(uint256 _count) external override view returns (uint256) {
        uint256 random = uint256(keccak256(abi.encodePacked(tx.origin, 
                blockhash(block.number - 1), block.timestamp, _count)));
        random = random + uint256(getLatestPrice());
        return random % _count;
    }
}
