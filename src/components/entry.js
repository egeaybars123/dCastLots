import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import { Typography, Card, Stack, Button, Grid, TextField, List, ListItem} from "@mui/material";
import { styled } from '@mui/material/styles';
import * as XLSX from "xlsx";
import CastLotsAbi from "../ethereum/build/CastLots.json";
import deployContract from "../ethereum/deploy";
import Web3 from "web3";

let jsonData = null;
let number_of_teams = 0;
let rand_available = false;

const Input = styled('input')({
    display: 'none',
});



//ListItem to list the teams according to separated groups
ListItems.propTypes = {
    array_data: PropTypes.array,
    group_count: PropTypes.number
};
DeployButton.propTypes = {
    team_data: PropTypes.array
};

function ListItems({ array_data, group_count }) {

    const team_cards = [];
    const team_per_group = number_of_teams / group_count;

    for (let i = 0; i < number_of_teams; i += team_per_group) {

        let new_array = array_data.slice(i, i + team_per_group);

        team_cards.push(
                <Card>
                    <List>
                        {new_array.map((elements) => (
                            <ListItem>{elements}</ListItem>
                     ))}
                    </List>
                </Card>
        );
    }
    return (
        <div>
            {team_cards}
        </div>   
    );
}

function DeployButton({ team_data }) {

    const [contractAddress, setContractAddress] = useState("0x1a12ec8142522828578f798ad7d514d8203494af");
    const [random, setRandom] = useState(false);

    function handleDeploy(data) {
        const new_contract = deployContract(data);
        setContractAddress(new_contract);
    }

    async function handleRandomNumber() {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const castLots = new web3.eth.Contract(CastLotsAbi.abi, contractAddress);
        console.log(accounts[0]);
        /*
        await castLots.methods.getRandomNumber().send({
            from: accounts[0]
        });
        console.log("transaction sent");
        */
        let limitedInterval = setInterval( async () => {
                console.log("Querying if random number is retrieved from Chainlink VRF");
                console.log(rand_available);
                rand_available = await castLots.methods.rand_available().call();
                if (rand_available === true) {
                    console.log("random is available.");
                    clearInterval(limitedInterval);
                }
            }, 10000);
        }
    
    async function handleFinalDeploy() {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const castLots = new web3.eth.Contract(CastLotsAbi.abi, contractAddress);

        const new_teams = await castLots.methods.generateGroups().send({
            from: accounts[0]
        });
        console.log("generating groups...");
        console.log(new_teams);
    }


    return (
        
        <div>
        <Button sx={{backgroundColor:"black"}} onClick={() => handleDeploy(team_data)}>Deploy a new Contract</Button>
        <Button sx={{backgroundColor:"black"}} onClick={handleRandomNumber}>Get a Random Number</Button>
        <Button sx={{backgroundColor:"black"}} onClick={handleFinalDeploy}>Obtain the Result</Button>
        </div>
    );
}


//React component
function Entry() {
    
    const [rows, set_Rows] = useState(0);

    const handleRows = e => {
        set_Rows(e.target.value);
    };

    const retrieve_data = async (e) => {
        const file = e.target.files[0];
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {
            header: 1,
            defval: "", 
        });
        number_of_teams = jsonData.length;
    };

    return (
        <div>
            <Card sx={{
                borderRadius: "10px",
                backgroundColor: "#CBDCD2",
                width: "700px"
            }} alignitems="center">

                <Grid container direction="column" spacing={4} sx={{ padding: "20px 40px" }}>

                    <Grid item>
                        <Stack direction="row" alignItems="center" spacing={7}>

                            <Typography>Enter the number of groups: </Typography>
                            
                            <TextField value = {rows} variant="outlined" 
                            label="Number of Groups" size="small" onChange = {handleRows}/>

                        </Stack>
                    </Grid>

                    <Grid item>
                        <Stack direction="row" alignItems="center" spacing={7}>

                            <Typography>Choose the file containing the list of teams: </Typography>

                            <label htmlFor="contained-button-file">
                                <Input id="contained-button-file" multiple type="file" onChange = {(e) => retrieve_data(e)}/>
                                <Button variant="contained" component="span">
                                    Upload
                                </Button>
                            </label>
                            <span>{rows}</span>
                            <input type="file" onChange = {(e) => retrieve_data(e)}></input>
                        </Stack>
                    </Grid>
                </Grid>

                {jsonData === null? null: <div>
                    <ListItems array_data={jsonData} group_count={rows}></ListItems>
                </div>
                }
            </Card>
        
        {jsonData !== null &&
            <DeployButton team_data={jsonData} />
        }
        </div>
    );
}

export default Entry;