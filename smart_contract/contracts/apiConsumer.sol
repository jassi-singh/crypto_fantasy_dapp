// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract ApiConsumer is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;
    using Strings for uint256;
    uint256 private constant ORACLE_PAYMENT =
        ((0 * LINK_DIVISIBILITY) / 100) * 5;
    bytes32 private constant JOB_ID = "412871186b47499fa4926bcda2526674";

    constructor() ConfirmedOwner(msg.sender) {
        setChainlinkToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
        setChainlinkOracle(0xedaa6962Cf1368a92e244DdC11aaC49c0A0acC37);
    }

    mapping(uint256 => mapping(uint256 => uint256))
        internal scoresOfPlayerInContest;

    mapping(uint256 => uint256[22]) private scoresOfContest;
    mapping(uint256 => uint256[22]) private playersOfContest;

    event RequestFulfilledEvent(bytes32 indexed requestId, uint256[] data);

    ///@notice function to request chainlink node for the data from api
    ///@param contestId , id of the contest
    ///@param matchId , id of the match
    ///@param dataType data type of data , if true player id, if false scores
    function requestContestData(
        uint256 contestId,
        uint256 matchId,
        bool dataType
    ) public onlyOwner {
        bytes4 callbackFunction;

        if (dataType) callbackFunction = this.fulfillPlayerData.selector;
        else callbackFunction = this.fulfillScoreData.selector;

        Chainlink.Request memory req = buildChainlinkRequest(
            JOB_ID,
            address(this),
            callbackFunction
        );
        req.add(
            "get",
            string(
                abi.encodePacked(
                    "https://crypto-fantasy-dapp.vercel.app/api/score?matchId=",
                    matchId.toString(),
                    "&contestId=",
                    contestId.toString()
                )
            )
        );
        if (dataType) req.add("path", "data,player-id");
        else req.add("path", "data,scores");

        sendOperatorRequest(req, ORACLE_PAYMENT);
    }

    ///@notice fullfill function for chainlink node to provide the data of playerids from api
    ///@param requestId id of request made to node
    ///@param data recieved from api
    function fulfillPlayerData(bytes32 requestId, uint256[] memory data)
        public
        recordChainlinkFulfillment(requestId)
    {
        emit RequestFulfilledEvent(requestId, data);
        uint256 contestId = data[0];
        for (uint8 i = 1; i < 23; i++)
            playersOfContest[contestId][i - 1] = data[i];
    }

    ///@notice fullfill function for chainlink node to provide the data of scores from api
    ///@param requestId id of request made to node
    ///@param data recieved from api
    function fulfillScoreData(bytes32 requestId, uint256[] memory data)
        public
        recordChainlinkFulfillment(requestId)
    {
        emit RequestFulfilledEvent(requestId, data);
        uint256 contestId = data[0];
        for (uint8 i = 1; i < 23; i++)
            scoresOfContest[contestId][i - 1] = data[i];
    }

    ///@notice combine the scores and player id of a particular contest
    ///@param contestId id of the contest
    function getScoresOfPlayersInContest(uint256 contestId) internal {
        for (uint256 i = 0; i < 22; i++) {
            scoresOfPlayerInContest[contestId][
                playersOfContest[contestId][i]
            ] = scoresOfContest[contestId][i];
        }
    }
}
