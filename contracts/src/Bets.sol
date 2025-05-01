// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Bets {

    address public admin;
    uint256 public betTransactionFeePercent;

    struct Bet {
        address owner;
        uint256 side1Total;
        uint256 side2Total;
        string title;
    }

    struct Participant {
        address _address;
        uint256 amount;
    }

    mapping(uint256 betId => Participant[]) public side1Participants;
    mapping(uint256 betId => Participant[]) public side2Participants;

    Bet[] public bets;

    event PayedOut(uint256 betId, address dest, uint256 amount);

    constructor(address _admin) {
        admin = _admin;
        betTransactionFeePercent = 1;
    }

    function createBet(string memory title) external returns (uint256 betId) {
        bets.push(Bet({
            owner: msg.sender,
            side1Total: 0,
            side2Total: 0,
            title: title
        }));
        side1Participants[betId] = new Participant[](0);
        side2Participants[betId] = new Participant[](0);
        betId = bets.length;
    }

    function joinBet(uint256 betId, uint32 side) external payable {
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
    }


    function settleBet(uint256 betId, uint32 winningSide) external {
        if (msg.sender != bets[betId].owner) {
            revert();
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
    }    
}
