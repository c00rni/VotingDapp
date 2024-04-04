// SPDX-License-Identifier: GPLv3
pragma solidity ^0.8.13;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

// @title Voting contract
// @author Antony Gandonou migna
// @notice This contract is an exercice to learn about foundry and Dapp.
// This contract allow to manage a voting process onchain.
// @dev Administrator of voting sessions is the address which deployed
// the contract. Admin can switch beteween deferents stats to manage
// the voting process.
contract Voting is Ownable {
    constructor() Ownable(msg.sender) {}
}
