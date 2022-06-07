const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);


const lotterypath = path.resolve(__dirname,'CastLots.sol');
const source = fs.readFileSync(lotterypath, 'UTF-8');

var input = {
  language: 'Solidity',
  sources: {
    'CastLots.sol' : {
        content: source
    }
},
settings: {
    outputSelection: {
        '*': {
            '*': [ '*' ]
        }
    }
}
};

var output = JSON.parse(solc.compile(JSON.stringify(input)));


fs.ensureDirSync(buildPath);

for (let contract in output) {
    fs.outputJsonSync(  
        path.resolve(buildPath, contract.replace(":", "") + ".json"),
        output[contract]
    );
}

//exports.abi = output.contracts['CastLots.sol']['CastLots'].abi;
//exports.bytecode = output.contracts['CastLots.sol']['CastLots'].evm.bytecode.object;