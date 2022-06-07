//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;
//import "github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/VRFConsumerBase.sol";
import "../node_modules/@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract CastLots is VRFConsumerBase{

    address public admin;
    string[] public initial_teams;
    uint256 public randomResult;
    bool public rand_available = false;
    bytes32 internal keyHash;
    uint256 internal fee;

    constructor (string[] memory teams) VRFConsumerBase(0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B, 0x01BE23585060835E02B77ef475b0Cc51aA1e0709) {
        admin = msg.sender;
        initial_teams = teams;
        keyHash = 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311;
        fee = 0.1 * 10 ** 18;
    }

      function getRandomNumber() public returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
        return requestRandomness(keyHash, fee);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        randomResult = randomness;
        rand_available = true;
    }

    function removeItem( uint index) internal {
        initial_teams[index] = initial_teams[initial_teams.length - 1];
        initial_teams.pop();
    }

    function randNumber (uint randomNumber, string memory safety, uint mod) private pure returns (uint) {
        return uint(keccak256(abi.encodePacked(randomNumber,safety))) % mod;
    }

    function generateGroups () public returns (string[] memory final_teams) {
        require(msg.sender == admin);
        require(rand_available == true);

        final_teams = new string[](initial_teams.length);

        uint random;
        uint initial_length = initial_teams.length;
 
        for (uint i = 0; i < initial_length; i++) {

            random = randNumber(randomResult, initial_teams[initial_teams.length - 1], initial_teams.length);
            final_teams[i] = initial_teams[random];
            removeItem(random);
        }

        rand_available = false;

        return final_teams;
    } 

    function getAllInitialTeams() public view returns (string[] memory) {
        return initial_teams;
    }
}