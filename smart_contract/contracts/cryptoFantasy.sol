// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./apiConsumer.sol";
import "./errors.sol";

///@title Crypto Fantasy is a decentralized fantasy cricket game
///@author  Jaswinder Singh   - https://github.com/jassi-singh
///@notice Anybody can play fantasy cricket game in a decentralized way with the help of this contract.
contract CryptoFantasy is ApiConsumer {
    constructor() {}

    struct Contest {
        uint256 contestId;
        uint256 apiMatchId;
        uint256 entryFee;
        uint256 poolPrize;
        address winner;
        uint256 totalTeams;
        address[] teamOwners;
        uint256 startDateTime;
        uint256 endDateTime;
        uint256 joinDeadline;
    }
    struct Team {
        address teamOwner;
        uint256[11] playerIds;
        uint256 score;
    }

    mapping(uint256 => Contest) public totalContest;
    mapping(uint256 => mapping(address => Team)) public teamsOfContest;
    mapping(address => Contest[]) public contestPlayedByUser;
    uint256 public numberOfContests;

    ///@notice allow only the contract owner to create the new contests which users can join and play
    ///@param matchId : match id of the real match
    ///@param fee , entryFee of the contest
    ///@param startDateTime , start time of the contest
    ///@param endDateTime end time of the contest
    ///@param joinDeadline end time of the contest
    function createContest(
        uint256 matchId,
        uint256 fee,
        uint256 startDateTime,
        uint256 endDateTime,
        uint256 joinDeadline
    ) external onlyOwner {
        totalContest[numberOfContests] = Contest(
            numberOfContests,
            matchId,
            fee,
            0,
            address(0),
            0,
            new address[](0),
            startDateTime,
            endDateTime,
            joinDeadline
        );
        numberOfContests++;

        if (
            startDateTime >= joinDeadline ||
            startDateTime >= endDateTime ||
            joinDeadline >= endDateTime
        ) revert CryptoFantasy__CheckTimingsOfContest();
    }

    ///@notice allow user to participate in a upcoming match
    ///@param contestId : a integer id of the match which user wants to join
    ///@param playerIds : list of player ids (number of ids must be 11 as in a cricket match there are 11 players each team) present in the users team.
    function joinMatch(uint256 contestId, uint256[11] memory playerIds)
        external
        payable
    {
        Contest storage contest = totalContest[contestId];
        if (
            teamsOfContest[contestId][address(msg.sender)].teamOwner !=
            address(0)
        ) {
            revert CryptoFantasy__AlreadyJoinedThisContest();
        }
        contest.poolPrize += contest.entryFee;
        contest.totalTeams++;
        contest.teamOwners.push(address(msg.sender));
        teamsOfContest[contestId][address(msg.sender)] = Team(
            address(msg.sender),
            playerIds,
            0
        );
        contestPlayedByUser[address(msg.sender)].push(contest);
        if (block.timestamp < contest.startDateTime)
            revert CryptoFantasy__ContestNotStartedYet();
        if (block.timestamp > contest.endDateTime)
            revert CryptoFantasy__ContestEnded();
        if (block.timestamp > contest.joinDeadline)
            revert CryptoFantasy__JoiningDeadlinePassed();
        if (msg.value != contest.entryFee) {
            revert CryptoFantasy__ValueNotEqualToEntryFee();
        }
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

    ///@notice start finding winner of a contest
    ///@param contestId : id of the contest whose winner to be calculated
    function getContestData(uint256 contestId) external onlyOwner {
        Contest memory contest = totalContest[contestId];
        requestContestData(contestId, contest.apiMatchId, true);
        requestContestData(contestId, contest.apiMatchId, false);
    }

    ///@notice calculate the total points of all teams in a contest
    ///@param contestId , is the id of the contest
    function calculatePointsAllTeams(uint256 contestId) public onlyOwner {
        Contest storage contest = totalContest[contestId];
        uint256 maxScore = 0;
        for (uint256 i = 0; i < contest.totalTeams; i++) {
            Team storage team = teamsOfContest[contestId][
                contest.teamOwners[i]
            ];
            team.score = calculateScoreOfTeam(team.playerIds, contestId);
            if (team.score > maxScore) {
                contest.winner = team.teamOwner;
            }
        }
    }

    ///@notice calculate the score of the a particular team in a contest and retunrs it
    ///@param playerIds is array of player ids in a team
    ///@param contestId is the id of the contest
    function calculateScoreOfTeam(
        uint256[11] memory playerIds,
        uint256 contestId
    ) public view onlyOwner returns (uint256) {
        uint256 score = 0;
        for (uint256 i = 0; i < 11; i++) {
            score += scoresOfPlayerInContest[contestId][playerIds[i]];
        }
        return score;
    }
}
