import { Button } from "@mui/material";
import React, {useState} from "react";
import deployContract from "../src/ethereum/deploy.js";
import PropTypes from "prop-types";

DeployButton.propTypes = {
    team_data: PropTypes.object,
};

const DeployButton = ({team_data}) => {

    async function handleDeploy(data) {
        contractAddress = deployContract(data);
    }

    return(
        <Button onClick={handleDeploy(team_data)}>Deploy a new Contract</Button>
    );
}

export default DeployButton;