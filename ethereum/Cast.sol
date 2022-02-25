pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

contract Test {

    address public admin;
    string[] public initial_teams;

    constructor (string[] memory teams) public {
        admin = msg.sender;
        initial_teams = teams;
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

        final_teams = new string[](initial_teams.length);

        uint random;
        uint initial_length = initial_teams.length;
 
        for (uint i = 0; i < initial_length; i++) {

            random = randNumber(432908093275392750932121490128409175916, initial_teams[initial_teams.length - 1], initial_teams.length);
            final_teams[i] = initial_teams[random];
            removeItem(random);
        }

        return final_teams;
    } 

    function getAllInitialTeams() public view returns (string[] memory) {
        return initial_teams;
}
    
        

}