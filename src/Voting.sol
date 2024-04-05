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

    // @dev allow the administrator to add a new address of voter to the
    // whitelist.
    // @dev Registration are available only if the contract is in
    // the RegistrationVoters status.
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
}
