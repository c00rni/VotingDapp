// SPDX-License-Identifier: GPLv3
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import "../src/Voting.sol";

contract VotingTest is Test {
    Voting votingInstance;
    address public user1Address = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
    address public owner = 0x7FA9385bE102ac3EAc297483Dd6233D62b3e1496;

    function setUp() public {
        votingInstance = new Voting();
    }

    function testFail_Owner() external view {
        assertEq(votingInstance.owner(), user1Address);
    }

    function test_owner() external view {
        assertEq(votingInstance.owner(), owner);
    }

    function test_Revert_If_NullAddress_Is_Registered() external {
        vm.expectRevert(bytes("You can't add null address"));
        address nullAddress = address(0);
        votingInstance.addVoter(nullAddress);
    }

    function test_Revert_If_Registration_Is_Not_Open() public {
        vm.expectRevert(bytes("Voters registration is not open yet"));
        votingInstance.addVoter(user1Address);
    }
}
