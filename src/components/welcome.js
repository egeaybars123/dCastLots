import { Typography, Box, Stack} from "@mui/material";
import React, {useState, useEffect} from "react";
import '../App.css';
import {shortenAddress} from "../shortenAddress";
import Web3 from "web3";

const minABI = [
  // balanceOf function for LINK Token 
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
];
const LINKAddress = "0x01BE23585060835E02B77ef475b0Cc51aA1e0709";

function Welcome () {

  const [web3, setWeb3] = useState("null");
  const [currentAccount, setCurrentAccount] = useState("null");
  const [linkBalance, setLinkBalance] = useState("null");

  useEffect(() => {
    activate();
    }, []);

  getLinkBalance();
   
    return(
        <Box className="TopBox">  
          <Typography sx={{
            fontWeight: "550",
            fontSize: "1.8rem",
            color: '#C4FCEF',
            textAlign: "center"
          }}>
            Welcome,
          </Typography>
          <Typography sx={{
            fontWeight: "500",
            fontSize: "1.1rem",
            color: "#C4FCEF",
            opacity: "0.9",
            textAlign: "center"
          }}
          >
            {shortenAddress(currentAccount)}
          </Typography>

          {linkBalance !== "null" && 
            <Stack direction="row" spacing={2} justifyContent="center">
              <Typography sx={{
              fontWeight: "500",
              fontSize: "1.1rem",
              color: "#C4FCEF",
              opacity: "0.9",
              textAlign: "center"
            }}
            >
              LINK Token Balance:
            </Typography>
            <Typography sx={{
              fontWeight: "500",
              fontSize: "1.1rem",
              color: "#C4FCEF",
              opacity: "0.9",
              textAlign: "center"
            }}
            >
              {linkBalance}
            </Typography>
            </Stack>
          }
        </Box>
    );

    async function getLinkBalance() {
      //querying the balance of the LINK token
      let web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(minABI, LINKAddress);
      const result = await contract.methods.balanceOf(currentAccount).call();
      const format = web3.utils.fromWei(result);
      console.log(format);
      setLinkBalance(format);
    }

    async function checkAccount() {
      //getting the address of the Ethereum wallet
      let web3 = new Web3(window.ethereum);
      setWeb3(web3);
      const accounts = await web3.eth.getAccounts();
      setCurrentAccount(accounts[0]);
    }
    async function activate() {
      if (window.ethereum) {
        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        })
        window.ethereum.on('accountsChanged', () => {
          window.location.reload();
          getLinkBalance();
        })
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          checkAccount();
          getLinkBalance();
        } catch (err) {
          console.log('user did not add account...', err);
        }
      }
    }
}




export default Welcome;