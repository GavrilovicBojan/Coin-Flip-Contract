// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IPriceFeed {
    function latestAnswer() external view returns(int256 answer);
}

contract CoinFlip is Ownable, ReentrancyGuard {
    address private priceFeedEth;
    address private feeAddress;
    uint256 private misfortuneNum;
    uint256 private currentBettingID;
    uint256 private seed;
    uint256 private feePerentage;

    receive() external payable {}

    event BetResult(address indexed from, uint amount, bool result);

    constructor() Ownable(msg.sender){
        priceFeedEth = 0x6D41d1dc818112880b40e26BD6FD347E41008eDA; // Main Network
        feeAddress = 0x6D41d1dc818112880b40e26BD6FD347E41008eDA;
        misfortuneNum = 13;
        currentBettingID = 0;
        seed = uint256(
            keccak256(
                abi.encodePacked(block.timestamp, msg.sender, block.prevrandao)
            )
        );
        feePerentage = 350;
    }

    function getEthByUSD(uint256 _usdAmount) public view returns(uint256) {
        return _usdAmount / 1e8 / uint256(IPriceFeed(priceFeedEth).latestAnswer());
    }

    function getEthByUSDWithFee(uint256 _usdAmount) public view returns(uint256) {
        return _usdAmount * (10000 + feePerentage) / 10000 * 1e8 / uint256(IPriceFeed(priceFeedEth).latestAnswer());
    }

    function generateRandomValue(
        uint256 minValue,
        uint256 maxValue
    ) private returns (uint256) {
        require(maxValue > minValue);
        seed = uint256(
            keccak256(abi.encodePacked(seed, blockhash(block.number)))
        );

        return (seed % (maxValue - minValue + 1)) + minValue;
    }

    function setPriceFeedETH(address _pricefeed) external onlyOwner {
        priceFeedEth = _pricefeed;
    }

    function setFeeAddress(address _feeAddress) external onlyOwner {
        feeAddress = _feeAddress;
    }

    function setMisfortuneNum(uint256 _misfortuneNum) external onlyOwner {
        misfortuneNum = _misfortuneNum;
    }

    function doBet(uint256 _expect, uint256 _usdAmount) public payable returns(bool) {
        uint256 ethAmountWithFee = getEthByUSDWithFee(_usdAmount);
        uint256 ethAmount = getEthByUSD(_usdAmount);
        require(ethAmountWithFee <= msg.value, "Insufficient ETH for deposit!");
        
        (bool s, ) = payable(feeAddress).call{value: ethAmountWithFee - ethAmount}("");

        currentBettingID ++;

        bool isWin = false;
        uint256 randomNumber = generateRandomValue(0, 1);
        if (randomNumber == _expect && address(this).balance > ethAmount * 2)
            isWin = true;
        
        if (currentBettingID >= misfortuneNum) {
            isWin = false;
            currentBettingID = 0;
        }

        if (isWin) {
            (bool s, ) = msg.sender.call{value: ethAmount * 2}("");
            emit BetResult(msg.sender, _usdAmount, true);
            return true;
        } else {
            emit BetResult(msg.sender, _usdAmount, false);
            return false;
        }
    }

    function withdrawTokens(uint256 _amount) external onlyOwner {
      (bool s, ) = owner().call{value: _amount}("");
      require(s);
    }
}
