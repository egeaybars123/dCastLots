const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const compiledCastLots = require("./build/CastLots.json");

const provider = new HDWalletProvider(
    "cram cinnamon moon off opera lumber transfer net fatal erupt sphere disagree",
    "https://rinkeby.infura.io/v3/f80433e9254742008f4557f645923fd3"
);

const web3 = new Web3(provider);


const deploy = async (team_object) => {
    const accounts = await web3.eth.getAccounts();
    console.log("Attempting to deploy from account", accounts[0]);

    let team_array = Object.values(team_object).map((array) => array[0]);
    console.log(team_array);

    const result = await new web3.eth.Contract(compiledCastLots.abi)
    .deploy({
        data: compiledCastLots.bytecode,
        arguments:[team_array]
    })
    .send({from: accounts[0], gas: "2000000"});

    console.log("Contract deployed to:", result.options.address);
    provider.engine.stop();

    return result.options.address;

    
};

export default deploy;