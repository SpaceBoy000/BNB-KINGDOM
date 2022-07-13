// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;


/*
*
* ██████╗ ██╗   ██╗███████╗██████╗     ██╗  ██╗██╗███╗   ██╗ ██████╗ ██████╗  ██████╗ ███╗   ███╗
* ██╔══██╗██║   ██║██╔════╝██╔══██╗    ██║ ██╔╝██║████╗  ██║██╔════╝ ██╔══██╗██╔═══██╗████╗ ████║
* ██████╔╝██║   ██║███████╗██║  ██║    █████╔╝ ██║██╔██╗ ██║██║  ███╗██║  ██║██║   ██║██╔████╔██║
* ██╔══██╗██║   ██║╚════██║██║  ██║    ██╔═██╗ ██║██║╚██╗██║██║   ██║██║  ██║██║   ██║██║╚██╔╝██║
* ██████╔╝╚██████╔╝███████║██████╔╝    ██║  ██╗██║██║ ╚████║╚██████╔╝██████╔╝╚██████╔╝██║ ╚═╝ ██║
* ╚═════╝  ╚═════╝ ╚══════╝╚═════╝     ╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═════╝  ╚═════╝ ╚═╝     ╚═╝
*
* BUSD Kingdom - BUSD Miner
*
* Website  : https://busdkingdom.xyz
* Twitter  : https://twitter.com/BUSDKingdom
* Telegram : https://t.me/BUSDKingdom
*
*/


contract Ownable{
    address private _owner;
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor() {
        _owner = msg.sender;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(owner() == msg.sender, "Ownable: caller is not the owner");
        _;
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

library SafeMath {

  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    if (a == 0) {
      return 0;
    }
    uint256 c = a * b;
    assert(c / a == b);
    return c;
  }

  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a / b;
    return c;
  }

  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }

  function mod(uint256 a, uint256 b) internal pure returns (uint256) {
    require(b != 0);
    return a % b;
  }
}

interface IERC20 {
    function totalSupply() external view returns (uint);

    function balanceOf(address account) external view returns (uint);

    function transfer(address recipient, uint amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint);

    function approve(address spender, uint amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint value);
    event Approval(address indexed owner, address indexed spender, uint value);
}

contract BUSDKingdom is Ownable {
    using SafeMath for uint256;
    IERC20 public busd;

    /* base parameters */
    uint256 public EGGS_TO_HIRE_1MINERS = 864000;
    uint256 public REFERRAL = 80;
    mapping(address => uint256) referrals;
    uint256 public PERCENTS_DIVIDER = 1000;
    uint256 public TAX = 15;
    uint256 public MARKET_EGGS_DIVISOR = 5;
    uint256 public MARKET_EGGS_DIVISOR_SELL = 2;

    // 0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56
    uint256 public MIN_INVEST_LIMIT = 10 * 1e18; // 10 BUSD
    uint256 public WALLET_DEPOSIT_LIMIT = 10_000 * 1e18; // 10,000 BUSD

	uint256[] public COMPOUND_BONUS;
	uint256 public COMPOUND_BONUS_MAX_TIMES = 10;
    uint256 public COMPOUND_STEP = 24 * 60 * 60;

    uint256 public WITHDRAWAL_TAX = 500;
    uint256 public COMPOUND_FOR_NO_TAX_WITHDRAWAL = 6;
    uint256 public LOTTERY_INTERVAL = 7 days;
    bool public lotteryStarted = false;
    uint256 public LOTTERY_START_TIME;
    uint8 public lotteryRound = 1;
    uint8 public WINNER_COUNT = 5;
    mapping(uint8 => mapping(uint8 => address)) public WINNER_ADDRESS;
    mapping(uint8 => mapping(uint8 => uint256)) public WINNER_AMOUNTS;

    uint256 public rate = 100; // Lands per BUSD
    uint256 public totalStaked;
    uint256 public totalDeposits;
    uint256 public totalCompound;
    uint256 public totalRefBonus;
    uint256 public totalWithdrawn;
    uint256 public totalMembers;

    mapping(address => bool) isMember;
    address[] public memberList;
    

    uint256 private marketEggs;
    uint256 PSN = 10000;
    uint256 PSNH = 5000;
    bool private contractStarted;
    bool public blacklistActive = true;
    mapping(address => bool) public Blacklisted;

	uint256 public CUTOFF_STEP = 48 * 60 * 60;
	uint256 public WITHDRAW_COOLDOWN = 0;

    /* addresses */
    // address private owner;
    address payable private dev1;
    address payable private dev2;

    struct User {
        uint256 initialDeposit;
        uint256 userDeposit;
        mapping(uint8 => uint256) LotteryDeposit;
        uint256 miners;
        uint256 claimedEggs;
        uint256 lastHatch;
        address referrer;
        uint256 referralsCount;
        uint256 referralEggRewards;
        uint256 totalWithdrawn;
        uint256 dailyCompoundBonus;
        uint256 farmerCompoundCount; //added to monitor farmer consecutive compound without cap
        uint256 lastWithdrawTime;
    }

    mapping(address => User) public users;

    constructor(address payable _dev1, address payable _dev2, address _busd) {
		require(!isContract(_dev1) && !isContract(_dev2));
        // owner = msg.sender;
        dev1 = _dev1;
        dev2 = _dev2;
        busd = IERC20(_busd);
        marketEggs = 144000000000;
        COMPOUND_BONUS.push(5);
        COMPOUND_BONUS.push(5);
        COMPOUND_BONUS.push(5);
        COMPOUND_BONUS.push(5);
        COMPOUND_BONUS.push(10);
        COMPOUND_BONUS.push(10);
        COMPOUND_BONUS.push(10);
        COMPOUND_BONUS.push(20);
    }

	function isContract(address addr) internal view returns (bool) {
        uint size;
        assembly { size := extcodesize(addr) }
        return size > 0;
    }

    function setblacklistActive(bool isActive) public{
        require(msg.sender == owner(), "Admin use only.");
        blacklistActive = isActive;
    }

    function blackListWallet(address Wallet, bool isBlacklisted) public{
        require(msg.sender == owner(), "Admin use only.");
        Blacklisted[Wallet] = isBlacklisted;
    }

    function blackMultipleWallets(address[] calldata Wallet, bool isBlacklisted) public{
        require(msg.sender == owner(), "Admin use only.");
        for(uint256 i = 0; i < Wallet.length; i++) {
            Blacklisted[Wallet[i]] = isBlacklisted;
        }
    }

    function checkIfBlacklisted(address Wallet) public view returns(bool blacklisted){
        require(msg.sender == owner(), "Admin use only.");
        blacklisted = Blacklisted[Wallet];
    }

    function ReinvestRewards(bool isCompound) public {
        require(contractStarted, "Contract not yet Started.");

        if (blacklistActive) {
            require(!Blacklisted[msg.sender], "Address is blacklisted.");
        }

        User storage user = users[msg.sender];
        uint256 eggsUsed = getMyEggs();
        uint256 eggsForCompound = eggsUsed;

        if(isCompound) {
            uint256 dailyCompoundBonus = getDailyCompoundBonus(msg.sender, eggsForCompound);
            eggsForCompound = eggsForCompound.add(dailyCompoundBonus);
            uint256 eggsUsedValue = calculateEggSell(eggsForCompound);
            user.userDeposit = user.userDeposit.add(eggsUsedValue);
            totalCompound = totalCompound.add(eggsUsedValue);
        } 

        if(block.timestamp.sub(user.lastHatch) >= COMPOUND_STEP) {
            if(user.dailyCompoundBonus < COMPOUND_BONUS_MAX_TIMES) {
                user.dailyCompoundBonus = user.dailyCompoundBonus.add(1);
            }
            //add compoundCount for monitoring purposes.
            user.farmerCompoundCount = user.farmerCompoundCount.add(1);
        }
        
        user.miners = user.miners.add(eggsForCompound.div(EGGS_TO_HIRE_1MINERS));
        user.claimedEggs = 0;
        user.lastHatch = block.timestamp;

        marketEggs = marketEggs.add(eggsUsed.div(MARKET_EGGS_DIVISOR));
    }

    function SellLands() public{
        require(contractStarted, "Contract not yet Started.");

        if (blacklistActive) {
            require(!Blacklisted[msg.sender], "Address is blacklisted.");
        }

        User storage user = users[msg.sender];
        uint256 hasEggs = getMyEggs();
        uint256 eggValue = calculateEggSell(hasEggs);
        
        /** 
            if user compound < to mandatory compound days**/
        if(user.dailyCompoundBonus < COMPOUND_FOR_NO_TAX_WITHDRAWAL){
            //daily compound bonus count will not reset and eggValue will be deducted with 50% feedback tax.
            eggValue = eggValue.sub(eggValue.mul(WITHDRAWAL_TAX).div(PERCENTS_DIVIDER));
        }else{
            //set daily compound bonus count to 0 and eggValue will remain without deductions
             user.dailyCompoundBonus = 0;   
             user.farmerCompoundCount = 0;  
        }
        
        user.lastWithdrawTime = block.timestamp;
        user.claimedEggs = 0;  
        user.lastHatch = block.timestamp;
        marketEggs = marketEggs.add(hasEggs.div(MARKET_EGGS_DIVISOR_SELL));
        
        if(getBalance() < eggValue) {
            eggValue = getBalance();
        }

        uint256 eggsPayout = eggValue.sub(payFees(eggValue));
        busd.transfer(address(msg.sender), eggsPayout);
        user.totalWithdrawn = user.totalWithdrawn.add(eggsPayout);
        totalWithdrawn = totalWithdrawn.add(eggsPayout);
    }

     
    /* transfer amount of BNB */
    function LandsPurchase(address _investor, uint256 _amount, address ref) public payable{
        require(contractStarted, "Contract not yet Started.");

        if (lotteryStarted && LOTTERY_START_TIME + LOTTERY_INTERVAL > block.timestamp) {
            LOTTERY_START_TIME = LOTTERY_START_TIME.add(LOTTERY_INTERVAL);
            lotteryRound = lotteryRound + 1;
        }

        if (blacklistActive) {
            require(!Blacklisted[_investor], "Address is blacklisted.");
        }

        busd.transferFrom(address(msg.sender), address(this), _amount);

        User storage user = users[_investor];
        require(_amount >= MIN_INVEST_LIMIT, "Mininum investment not met.");
        require(user.initialDeposit.add(_amount) <= WALLET_DEPOSIT_LIMIT, "Max deposit limit reached.");
        uint256 eggsBought = calculateEggBuy(_amount, address(this).balance.sub(_amount));
        user.userDeposit = user.userDeposit.add(_amount);
        user.initialDeposit = user.initialDeposit.add(_amount);
        user.claimedEggs = user.claimedEggs.add(eggsBought);

        if (lotteryStarted) {
            user.LotteryDeposit[lotteryRound] = user.LotteryDeposit[lotteryRound].add(_amount);
            for (uint8 i = 0; i < WINNER_COUNT; i++) {
                if (user.LotteryDeposit[lotteryRound] > WINNER_AMOUNTS[lotteryRound][i]) {
                    WINNER_AMOUNTS[lotteryRound][i] = user.LotteryDeposit[lotteryRound];
                    WINNER_ADDRESS[lotteryRound][i] = _investor;
                    break;
                }
            }
        }

        if (user.referrer == address(0)) {
            if (ref != _investor) {
                user.referrer = ref;
            }

            address upline1 = user.referrer;
            if (upline1 != address(0)) {
                users[upline1].referralsCount = users[upline1].referralsCount.add(1);
            }
        }

        if (user.referrer != address(0)) {
            address upline = user.referrer;
            if (upline != address(0)) {
                uint256 refBonus = referrals[upline] != 0 ? referrals[upline] : REFERRAL;
                uint256 refRewards = _amount.mul(refBonus).div(PERCENTS_DIVIDER);
                busd.transfer(address(upline), refRewards);
                users[upline].referralEggRewards = users[upline].referralEggRewards.add(refRewards);
                totalRefBonus = totalRefBonus.add(refRewards);
            }
        }

        uint256 eggsPayout = payFees(_amount);
        totalStaked = totalStaked.add(_amount.sub(eggsPayout));
        totalDeposits = totalDeposits.add(1);

        if (user.initialDeposit == 0) {
            memberList.push(_investor);
            totalMembers = totalMembers.add(1);
        }
        ReinvestRewards(false);
    }

    function startKingdom(address addr, uint256 _amount) public payable{
        if (!contractStarted) {
    		if (msg.sender == owner()) {
    			contractStarted = true;
                LandsPurchase(addr, _amount, msg.sender);
    		} else revert("Contract not yet started.");
    	}
    }

    //fund contract with BNB before launch.
    function fundContract() external payable {}

    function payFees(uint256 eggValue) internal returns(uint256){
        uint256 tax = eggValue.mul(TAX).div(PERCENTS_DIVIDER);
        busd.transfer(dev1, tax);
        busd.transfer(dev2, tax);
        return tax.mul(2);
    }

    function getDailyCompoundBonus(address _adr, uint256 amount) public view returns(uint256){
        if(users[_adr].dailyCompoundBonus == 0) {
            return 0;
        } else {
            uint256 totalBonus = users[_adr].dailyCompoundBonus.mul(COMPOUND_BONUS[users[_adr].dailyCompoundBonus]); 
            uint256 result = amount.mul(totalBonus).div(PERCENTS_DIVIDER);
            return result;
        }
    }

    function getUserInfo(address _adr) public view returns(uint256 _initialDeposit, uint256 _userDeposit, uint256 _miners,
     uint256 _claimedEggs, uint256 _lastHatch, address _referrer, uint256 _referrals,
	 uint256 _totalWithdrawn, uint256 _referralEggRewards, uint256 _dailyCompoundBonus, uint256 _farmerCompoundCount, uint256 _lastWithdrawTime) {
         _initialDeposit = users[_adr].initialDeposit;
         _userDeposit = users[_adr].userDeposit;
         _miners = users[_adr].miners;
         _claimedEggs = users[_adr].claimedEggs;
         _lastHatch = users[_adr].lastHatch;
         _referrer = users[_adr].referrer;
         _referrals = users[_adr].referralsCount;
         _totalWithdrawn = users[_adr].totalWithdrawn;
         _referralEggRewards = users[_adr].referralEggRewards;
         _dailyCompoundBonus = users[_adr].dailyCompoundBonus;
         _farmerCompoundCount = users[_adr].farmerCompoundCount;
         _lastWithdrawTime = users[_adr].lastWithdrawTime;
	}

    function getBalance() public view returns(uint256){
        return busd.balanceOf(address(this));
    }

    function getTimeStamp() public view returns (uint256) {
        return block.timestamp;
    }

    function getAvailableEarnings(address _adr) public view returns(uint256) {
        uint256 userEggs = users[_adr].claimedEggs.add(getEggsSinceLastHatch(_adr));
        return calculateEggSell(userEggs);
    }

    //  Supply and demand balance algorithm 
    function calculateTrade(uint256 rt,uint256 rs, uint256 bs) public view returns(uint256){
    // (PSN * bs)/(PSNH + ((PSN * rs + PSNH * rt) / rt)); PSN / PSNH == 1/2
    // bs * (1 / (1 + (rs / rt)))
    // purchase ： marketEggs * 1 / ((1 + (this.balance / eth)))
    // sell ： this.balance * 1 / ((1 + (marketEggs / eggs)))
        return SafeMath.div(
                SafeMath.mul(PSN, bs), 
                    SafeMath.add(PSNH, 
                        SafeMath.div(
                            SafeMath.add(
                                SafeMath.mul(PSN, rs), 
                                    SafeMath.mul(PSNH, rt)), 
                                        rt)));
    }

    function calculateEggSell(uint256 eggs) public view returns(uint256){
        return calculateTrade(eggs, marketEggs, getBalance());
    }

    function calculateEggBuy(uint256 eth,uint256 contractBalance) public view returns(uint256){
        return calculateTrade(eth, contractBalance, marketEggs);
    }

    function calculateEggBuySimple(uint256 eth) public view returns(uint256){
        return calculateEggBuy(eth, getBalance());
    }

    /* How many lands per day user will receive based on BNB deposit */
    function getEggsYield(uint256 amount) public view returns(uint256,uint256) {
        uint256 eggsAmount = calculateEggBuy(amount , getBalance().add(amount).sub(amount));
        uint256 miners = eggsAmount.div(EGGS_TO_HIRE_1MINERS);
        uint256 day = 1 days;
        uint256 eggsPerDay = day.mul(miners);
        uint256 earningsPerDay = calculateEggSellForYield(eggsPerDay, amount);
        return(miners, earningsPerDay);
    }

    function calculateEggSellForYield(uint256 eggs,uint256 amount) public view returns(uint256){
        return calculateTrade(eggs,marketEggs, getBalance().add(amount));
    }

    function getSiteInfo() public view returns (uint256 _totalStaked, uint256 _totalDeposits, uint256 _totalCompound, uint256 _totalRefBonus) {
        return (totalStaked, totalDeposits, totalCompound, totalRefBonus);
    }

    function getMyMiners() public view returns(uint256){
        return users[msg.sender].miners;
    }

    function getMyEggs() public view returns(uint256){
        return users[msg.sender].claimedEggs.add(getEggsSinceLastHatch(msg.sender));
    }

    function getEggsSinceLastHatch(address adr) public view returns(uint256){
        uint256 secondsSinceLastHatch = block.timestamp.sub(users[adr].lastHatch);
                            /* get min time. */
        uint256 cutoffTime = min(secondsSinceLastHatch, CUTOFF_STEP);
        uint256 secondsPassed = min(EGGS_TO_HIRE_1MINERS, cutoffTime);
        return secondsPassed.mul(users[adr].miners);
    }

    function min(uint256 a, uint256 b) private pure returns (uint256) {
        return a < b ? a : b;
    }

    function CHANGE_DEV1(address value) external {
        require(msg.sender == dev1, "Admin use only.");
        dev1 = payable(value);
    }

    function CHANGE_DEV2(address value) external {
        require(msg.sender == dev2, "Admin use only.");
        dev2 = payable(value);
    }

    /* percentage setters */

    // 2592000 - 3%, 2160000 - 4%, 1728000 - 5%, 1440000 - 6%, 1200000 - 7%
    // 1080000 - 8%, 959000 - 9%, 864000 - 10%, 720000 - 12%, 576000 - 15%, 480000 - 18%
    
    function SET_EGGS_TO_HIRE_1MINERS(uint256 value) external {
        require(msg.sender == owner(), "Admin use only.");
        require(value >= 480000 && value <= 2592000); /* min 3% max 18%*/
        EGGS_TO_HIRE_1MINERS = value;
    }

    function PRC_MARKET_EGGS_DIVISOR(uint256 value) external {
        require(msg.sender == owner(), "Admin use only.");
        require(value <= 50);
        MARKET_EGGS_DIVISOR = value;
    }

    function PRC_MARKET_EGGS_DIVISOR_SELL(uint256 value) external {
        require(msg.sender == owner(), "Admin use only.");
        require(value <= 50);
        MARKET_EGGS_DIVISOR_SELL = value;
    }

    function SET_WITHDRAWAL_TAX(uint256 value) external {
        require(msg.sender == owner(), "Admin use only.");
        require(value <= 1000, "available between 0% and 100%");
        WITHDRAWAL_TAX = value;
    }

    function SET_COMPOUND_BONUS(uint256 value, uint8 _index) external {
        require(msg.sender == owner(), "Admin use only.");
        require(value <= 1000);
        require(_index < 8);
        COMPOUND_BONUS[_index] = value;
    }

    function SET_COMPOUND_FOR_NO_TAX_WITHDRAWAL(uint256 value) external {
        require(msg.sender == owner(), "Admin use only.");
        require(value <= 100);
        COMPOUND_FOR_NO_TAX_WITHDRAWAL = value;
    }
    
    //--------------------------------//
    function SET_COMPOUND_BONUS_MAX_TIMES(uint256 value) external {
        require(msg.sender == owner(), "Admin use only.");
        require(value <= 100, "available between 0 and 100");
        COMPOUND_BONUS_MAX_TIMES = value;
    }
    
    function SET_COMPOUND_STEP(uint256 value) external {
        require(msg.sender == owner(), "Admin use only.");
        require(value <= 1_209_600, "available between 0 and 14 days");
        COMPOUND_STEP = value;
    }

    function SET_CUTOFF_STEP(uint256 value) external {
        require(msg.sender == owner(), "Admin use only");
        require(value <= 1_209_600, "available between 0 and 14 days");
        CUTOFF_STEP = value;
    }

    function SET_RATE(uint256 value) external {
        require(msg.sender == owner(), "Admin use only");
        require(value <= 1_000_000, "available between 0 and 1M");
        rate = value;
    }

    function SET_INVEST_MIN(uint256 value) external {
        require(msg.sender == owner(), "Admin use only");
        require(value <= 1_000, "available between $0 and $1000");
        MIN_INVEST_LIMIT = value * 1e18;
    }

    function SET_WALLET_DEPOSIT_LIMIT(uint256 value) external {
        require(msg.sender == owner(), "Admin use only");
        require(value <= 100_000, "available between $0 and $100,000");
        WALLET_DEPOSIT_LIMIT = value * 1e18;
    }
    
    function SET_REFERRAL_BONUS(uint256 value) external {
        require(msg.sender == owner(), "Admin use only.");
        require(value <= 1000, "available between 0% and 100%");
        REFERRAL = value;
    }

    function SET_CUSTOM_REFERRAL_BONUS(address _account, uint256 value) external {
        require(msg.sender == owner(), "Admin use only.");
        require(value <= 1000, "available between 0% and 100%");
        referrals[_account] = value;
    }

    function SET_WITHDRAW_COOLDOWN(uint256 value) external {
        require(msg.sender == owner(), "Admin use only");
        require(value <= 1_209_600, "available between 0 and 14 days");
        WITHDRAW_COOLDOWN = value;
    }

    function SET_TAX(uint256 value) external {
        require(msg.sender == owner(), "Admin use only");
        require(value <= 500, "available between 0 and 50%");
        TAX = value;
    }

    function LandsGift(address _account, uint256 _amount) external {
        require(msg.sender == owner(), "Admin use only");
        users[_account].miners = users[_account].miners + _amount;
    }

    function withDraw () onlyOwner public{
        busd.transfer(address(msg.sender), getBalance());
    }

    function SET_LOTTERY_INTERVAL(uint256 value) external {
        require(msg.sender == owner(), "Admin use only");
        require(value <= 1_209_600, "available between 0 and 14 days");
        LOTTERY_INTERVAL = value;
    }

    function START_LOTTERY() external {
        require(msg.sender == owner(), "Admin use only");
        lotteryStarted = true;
        LOTTERY_START_TIME = block.timestamp;
    }

    function FINISH_LOTTERY() external {
        require(msg.sender == owner(), "Admin use only");
        lotteryStarted = false;
    }

    function SET_WINNER_COUNT(uint8 value) external {
        require(msg.sender == owner(), "Admin use only");
        require(value < 10);
        WINNER_COUNT = value;
    }

    function getLotteryWinners(uint8 _round, uint8 _index) view external returns (address, uint256) {
        return (WINNER_ADDRESS[_round][_index], WINNER_AMOUNTS[_round][_index]);
    }
}