// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.7;
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract ApiConsumer is ChainlinkClient {
    
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;

    constructor() {
        
    }
}