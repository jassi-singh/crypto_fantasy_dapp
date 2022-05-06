// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./errors.sol";

///@title Crypto Fantasy is a decentralized fantasy cricket game
///@author  Jaswinder Singh   - https://github.com/jassi-singh
///@notice Anybody can play fantasy cricket game in a decentralized way with the help of this contract.
contract CryptoFantasy is Ownable {
    constructor() {}

    struct Contest {
        uint256 contestId;
        uint256 apiMatchId;
        uint256 entryFee;
        uint256 poolPrize;
        address winner;
        uint256 totalTeams;
        address[] teamOwners;
    }
    struct Team {
        address teamOwner;
        uint256[11] playerIds;
    }

    mapping(uint256 => Contest) public totalContest;
    mapping(uint256 => mapping(address => Team)) public teamsOfContest;
    mapping(address => Contest[]) public contestPlayedByUser;
    uint256 public numberOfContests;

    ///@notice allow only the contract owner to create the new contests which users can join and play
    ///@param matchId : match id of the real match
    function createContest(uint256 matchId, uint256 fee) external onlyOwner {
        totalContest[numberOfContests] = Contest(
            numberOfContests,
            matchId,
            fee,
            0,
            address(0),
            0,
            new address[](0)
            /// TODO : add start time and end Time
        );
        numberOfContests++;
    }

    ///@notice allow user to participate in a upcoming match
    ///@param contestId : a integer id of the match which user wants to join
    ///@param playerIds : list of player ids (number of ids must be 11 as in a cricket match there are 11 players each team) present in the users team.
    function joinMatch(uint256 contestId, uint256[11] memory playerIds)
        external
        payable
    {
        Contest storage contest = totalContest[contestId];
        contest.poolPrize += contest.entryFee;
        contest.totalTeams++;
        contest.teamOwners.push(address(msg.sender));
        teamsOfContest[contestId][address(msg.sender)] = Team(
            address(msg.sender),
            playerIds
        );
        contestPlayedByUser[address(msg.sender)].push(contest);
        if (msg.value != contest.entryFee)
            revert CryptoFantasy__JoinMatchFailed();
    }

    ///@notice get the list of contests played by a particular user
    ///@param user address of user
    function getContestPlayedByUser(address user)
        public
        view
        returns (Contest[] memory)
    {
        return contestPlayedByUser[user];
    }

    ///@notice get the list of players of a user in a contest
    ///@param contestId id of the contest
    ///@param user address of user whose team you need
    function getContestTeamOfUser(uint256 contestId, address user)
        public
        view
        returns (Team memory)
    {
        return teamsOfContest[contestId][user];
    }

    ///@notice get the mapping of all the user to team in a contest
    ///@param contestId id of the contest
    function getContestTeams(uint256 contestId)
        public
        view
        returns (Team[] memory)
    {
        address[] memory teamOwners = totalContest[contestId].teamOwners;
        Team[] memory allTeams = new Team[](teamOwners.length);
        for (uint256 i = 0; i < teamOwners.length; i++) {
            allTeams[i] = teamsOfContest[contestId][teamOwners[i]];
        }
        return allTeams;
    }
}
