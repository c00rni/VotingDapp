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
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        string description;
        uint voteCount;
    }

    enum WorkflowStatus {
        BeforeRegistrations,
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    uint256 winningProposalId;
    WorkflowStatus public workflowStatus;
    mapping(address => Voter) whitelist;
    Proposal[] proposalsArray;

    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );
    event ProposalRegistered(uint proposalId);
    event Voted(address voter, uint proposalId);

    constructor() Ownable(msg.sender) {}

    modifier onlyVoters() {
        require(whitelist[msg.sender].isRegistered, "You're not a voter");
        _;
    }

    // @return ID of the winner
    function getWinner() external view returns (uint256) {
        return winningProposalId;
    }

    function getVoter(
        address _voterAddres
    ) external view onlyVoters returns (Voter memory) {
        return whitelist[_voterAddres];
    }

    // @dev allow the administrator to add a new address of voter to the
    // whitelist.
    function addVoter(address _voterAddress) external onlyOwner {
        require(_voterAddress != address(0), "You can't add null address");
        require(
            workflowStatus == WorkflowStatus.RegisteringVoters,
            "Voters registration is not open yet"
        );
        require(
            whitelist[_voterAddress].isRegistered != true,
            "Address already registered."
        );
        whitelist[_voterAddress].isRegistered = true;
        emit VoterRegistered(_voterAddress);
    }

    function setVote(uint _id) external onlyVoters {
        require(
            workflowStatus == WorkflowStatus.VotingSessionStarted,
            "Voting session havent started yet"
        );
        require(
            whitelist[msg.sender].hasVoted != true,
            "You have already voted"
        );
        require(_id < proposalsArray.length, "Proposal not found"); // pas obligé, et pas besoin du >0 car uint

        whitelist[msg.sender].votedProposalId = _id;
        whitelist[msg.sender].hasVoted = true;
        proposalsArray[_id].voteCount++;

        emit Voted(msg.sender, _id);
    }

    // ::::::::::::: STATE ::::::::::::: //

    // @dev Modify the contract status to voter registration stat.
    // Voter can be add by the administrator.
    function startVoterRegistering() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.BeforeRegistrations,
            "You can't register voters anymore."
        );
        workflowStatus = WorkflowStatus.RegisteringVoters;

        emit WorkflowStatusChange(
            WorkflowStatus.BeforeRegistrations,
            WorkflowStatus.RegisteringVoters
        );
    }

    // @dev Modify the contract status to allow proposal registration
    // by registered voters
    function startProposalsRegistering() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.RegisteringVoters,
            "Registering proposals cant be started now"
        );
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;

        Proposal memory proposal;
        proposal.description = "GENESIS";
        proposalsArray.push(proposal);

        emit WorkflowStatusChange(
            WorkflowStatus.RegisteringVoters,
            WorkflowStatus.ProposalsRegistrationStarted
        );
    }

    // @dev Forbid Proposal registration
    function endProposalsRegistering() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.ProposalsRegistrationStarted,
            "Registering proposals havent started yet"
        );
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(
            WorkflowStatus.ProposalsRegistrationStarted,
            WorkflowStatus.ProposalsRegistrationEnded
        );
    }

    // @dev Modify the contract status to allow registered users to vote.
    function startVotingSession() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.ProposalsRegistrationEnded,
            "Registering proposals phase is not finished"
        );
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(
            WorkflowStatus.ProposalsRegistrationEnded,
            WorkflowStatus.VotingSessionStarted
        );
    }

    // @dev Forbid users to vote.
    function endVotingSession() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.VotingSessionStarted,
            "Voting session havent started yet"
        );
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(
            WorkflowStatus.VotingSessionStarted,
            WorkflowStatus.VotingSessionEnded
        );
    }

    // @dev Count vote to find the winner
    function tallyVotes() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.VotingSessionEnded,
            "Current status is not voting session ended"
        );
        uint _winningProposalId;
        for (uint256 p = 0; p < proposalsArray.length; p++) {
            if (
                proposalsArray[p].voteCount >
                proposalsArray[_winningProposalId].voteCount
            ) {
                _winningProposalId = p;
            }
        }
        winningProposalId = _winningProposalId;

        workflowStatus = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(
            WorkflowStatus.VotingSessionEnded,
            WorkflowStatus.VotesTallied
        );
    }

    function addProposal(string calldata _desc) external onlyVoters {
        require(
            workflowStatus == WorkflowStatus.ProposalsRegistrationStarted,
            "Proposals are not allowed yet"
        );
        require(
            keccak256(abi.encode(_desc)) != keccak256(abi.encode("")),
            "Vous ne pouvez pas ne rien proposer"
        );

        Proposal memory proposal;
        proposal.description = _desc;
        proposalsArray.push(proposal);
        emit ProposalRegistered(proposalsArray.length - 1);
    }
}
