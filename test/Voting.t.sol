pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/Voting.sol";

contract VotingTest is Test {
    Voting votingInstance;
    address public user1Address = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
    address public owner = 0x7FA9385bE102ac3EAc297483Dd6233D62b3e1496;

    function setUp() public {
        votingInstance = new Voting();
    }

    function testFail_Owner() public view {
        assertEq(votingInstance.owner(), user1Address);
    }

    function test_owner() public view {
        assertEq(votingInstance.owner(), owner);
    }
}
