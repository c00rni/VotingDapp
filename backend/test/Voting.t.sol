// SPDX-License-Identifier: GPLv3
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import "../src/Voting.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract VotingTest is Test {
    Voting votingInstance;
    address public user1Address = vm.addr(2);
    address public owner = 0x7FA9385bE102ac3EAc297483Dd6233D62b3e1496;

    event ProposalRegistered(uint proposalId);

    function setUp() public {
        vm.prank(owner);
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

    function test_Initiale_State_Is_BeforeRegistrations() external {
        assertEqUint(uint256(votingInstance.workflowStatus()), uint256(0));
    }

    function test_Revert_If_Registration_Is_Not_Open() public {
        vm.expectRevert(bytes("Voters registration is not open yet"));
        votingInstance.addVoter(user1Address);
    }

    function test_Modification_Status_to_RegistreringVoters() public {
        votingInstance.startVoterRegistering();
        assertEqUint(uint256(votingInstance.workflowStatus()), uint256(1));
    }

    function test_Revert_user_change_status_to_Registering() external {
        vm.expectRevert();
        vm.startPrank(vm.addr(1));
        votingInstance.startVoterRegistering();
        vm.stopPrank();
    }

    function test_Administrator_Add_User_Address() external {
        votingInstance.startVoterRegistering();
        votingInstance.addVoter(vm.addr(1));
        vm.startPrank((vm.addr(1)));
        bool userIsRegistered = votingInstance
            .getVoter(vm.addr(1))
            .isRegistered;
        assertEq(userIsRegistered, true);
        vm.stopPrank();
    }

    function testFail_Get_Unregistered_data() external {
        votingInstance.addVoter(vm.addr(1));
        vm.startPrank(vm.addr(1));
        assertEq(votingInstance.getVoter(vm.addr(2)).isRegistered, true);
        vm.stopPrank();
    }

    function test_Revert_If_Proposal_Are_submited_At_Wrong_Status() external {
        votingInstance.startVoterRegistering();
        votingInstance.addVoter(owner);
        vm.expectRevert(bytes("Proposals are not allowed yet"));
        votingInstance.addProposal("Test");
    }

    function test_Create_Proposal() external {
        votingInstance.startVoterRegistering();
        votingInstance.addVoter(owner);
        votingInstance.startProposalsRegistering();
        vm.expectEmit(true, false, false, true, address(votingInstance));
        emit ProposalRegistered(1);
        votingInstance.addProposal("Test");
    }

    function testFail_when_Proposal_Are_Created_In_EndProposalRegistrating_Satus()
        external
    {
        votingInstance.startVoterRegistering();
        votingInstance.addVoter(owner);
        vm.expectEmit(true, false, false, true, address(votingInstance));
        emit ProposalRegistered(1);
        votingInstance.addProposal("Test");
    }

    function test_voting() external {
        votingInstance.startVoterRegistering();
        votingInstance.addVoter(owner);
        votingInstance.startProposalsRegistering();
        votingInstance.addProposal("Test");
        votingInstance.endProposalsRegistering();
        votingInstance.startVotingSession();
        votingInstance.setVote(1);

        assertTrue(votingInstance.getVoter(owner).hasVoted);
        assertEq(votingInstance.getVoter(owner).votedProposalId, 1);
    }

    function testFail_when_vote_are_out_of_VotingSession() external {
        vm.expectRevert(bytes("Voting session havent started yet"));
        votingInstance.startVoterRegistering();
        votingInstance.addVoter(owner);
        votingInstance.startProposalsRegistering();
        votingInstance.addProposal("Test");
        votingInstance.endProposalsRegistering();
        votingInstance.setVote(1);
    }

    function test_Revert_tallyVotes_out_of_VotingSessionEnded_Status()
        external
    {
        vm.expectRevert(bytes("Current status is not voting session ended"));
        votingInstance.tallyVotes();
    }

    function test_tallyVotes_winner_selection() external {
        votingInstance.startVoterRegistering();
        votingInstance.addVoter(owner);
        votingInstance.addVoter(vm.addr(1));
        votingInstance.addVoter(vm.addr(2));
        votingInstance.startProposalsRegistering();
        votingInstance.addProposal("Test");
        vm.startPrank(vm.addr(1));
        votingInstance.addProposal("Test 2");
        votingInstance.addProposal("Test 3");
        vm.stopPrank();
        votingInstance.endProposalsRegistering();
        votingInstance.startVotingSession();
        votingInstance.setVote(1);

        vm.startPrank(vm.addr(1));
        votingInstance.setVote(1);
        vm.stopPrank();

        vm.startPrank(vm.addr(2));
        votingInstance.setVote(2);
        vm.stopPrank();
        votingInstance.endVotingSession();
        votingInstance.tallyVotes();
        assertEqUint(votingInstance.getWinner(), 1);
    }
}
