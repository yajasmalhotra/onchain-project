// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Bets {

    address public admin;
    uint256 public betTransactionFeePercent;

    struct Bet {
        address owner;
        string side1Title;
        string side2Title;
        uint256 side1Total;
        uint256 side2Total;
        string title;
        bool settled;
        uint32 winningSide;
    }

    struct Participant {
        address _address;
        uint256 amount;
    }

    mapping(address owner => uint256[] betIds) public ownerBetIds;
    mapping(address participant => uint256[] betIds) public participantBetIds;

    Bet[] public bets;
    mapping(uint256 betId => Participant[]) public side1Participants;
    mapping(uint256 betId => Participant[]) public side2Participants;

    error BetAlreadySettled();
    error ParticipantAlreadyJoined();
    error InvalidSide();
    error OwnerCannotJoin();
    error OnlyOwnerCanSettle();

    event PayedOut(uint256 betId, address dest, uint256 amount);

    constructor(address _admin) {
        admin = _admin;
        betTransactionFeePercent = 1;
    }

    function createBet(string memory title, string memory side1Title, string memory side2Title) external returns (uint256 betId) {
        bets.push(Bet({
            owner: msg.sender,
            side1Title: side1Title,
            side2Title: side2Title,
            side1Total: 0,
            side2Total: 0,
            title: title,
            settled: false,
            winningSide: 0
        }));
        betId = bets.length - 1;
        ownerBetIds[msg.sender].push(betId);
    }

    function joinBet(uint256 betId, uint32 side) external payable {
        if (bets[betId].settled) {
            revert BetAlreadySettled();
        }

        if (side != 1 && side != 2) {
            revert InvalidSide();
        }

        if (bets[betId].owner == msg.sender) {
            revert OwnerCannotJoin();
        }

        for (uint256 i = 0; i < side1Participants[betId].length; i++) {
            if (side1Participants[betId][i]._address == msg.sender) {
                revert ParticipantAlreadyJoined();
            }
        }
        
        for (uint256 i = 0; i < side2Participants[betId].length; i++) {
            if (side2Participants[betId][i]._address == msg.sender) {
                revert ParticipantAlreadyJoined();
            }
        }

        if (side == 1) {
            side1Participants[betId].push(Participant({
                _address: msg.sender,
                amount: msg.value
            }));
            bets[betId].side1Total += msg.value;
        } else if (side == 2) {
            side2Participants[betId].push(Participant({
                _address: msg.sender,
                amount: msg.value
            }));
            bets[betId].side2Total += msg.value;
        } else {
            revert();
        }
        participantBetIds[msg.sender].push(betId);
    }


    function settleBet(uint256 betId, uint32 winningSide) external {
        if (msg.sender != bets[betId].owner) {
            revert OnlyOwnerCanSettle();
        }

        if (bets[betId].settled) {
            revert BetAlreadySettled();
        }

        if (winningSide != 1 && winningSide != 2) {
            revert InvalidSide();
        }

        if (winningSide == 1) {
            for (uint256 i = 0; i < side1Participants[betId].length; i++) {
                Participant memory participant = side1Participants[betId][i];
                uint256 winnings = participant.amount / bets[betId].side1Total * bets[betId].side2Total;
                uint256 payout = (participant.amount + winnings) * (100 - betTransactionFeePercent) / 100;
                (bool success, ) = payable(participant._address).call{value: payout}("");
                emit PayedOut(betId, participant._address, payout);
                require(success, "Transfer failed");
            }
        } else if (winningSide == 2) {
            for (uint256 i = 0; i < side2Participants[betId].length; i++) {
                Participant memory participant = side2Participants[betId][i];
                uint256 winnings = participant.amount / bets[betId].side2Total * bets[betId].side1Total;
                uint256 payout = (participant.amount + winnings) * (100 - betTransactionFeePercent) / 100;
                (bool success, ) = payable(participant._address).call{value: payout}("");
                emit PayedOut(betId, participant._address, payout);
                require(success, "Transfer failed");
            }
        } else {
            revert();
        }

        bets[betId].settled = true;
        bets[betId].winningSide = winningSide;
    }

    function getParticipantBetIds(address participant) external view returns (uint256[] memory betIds) {
        betIds = participantBetIds[participant];
    }

    function getOwnerBetIds(address owner) external view returns (uint256[] memory betIds) {
        betIds = ownerBetIds[owner];   
    }
    
    function getAllSide1ParticipantsForBet(uint256 betId) external view returns (Participant[] memory participants) {
        participants = side1Participants[betId];
    }

    function getAllSide2ParticipantsForBet(uint256 betId) external view returns (Participant[] memory participants) {
        participants = side2Participants[betId];
    }
}
