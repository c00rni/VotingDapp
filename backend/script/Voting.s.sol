// SPDX-License-Identifier: GPLv3
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/Voting.sol";

contract VotingScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        Voting votingInstance = new Voting();

        vm.stopBroadcast();
    }
}
