import { Button } from "@chakra-ui/button";
import { Container, Heading, Text, Stack, Box } from "@chakra-ui/layout";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./utils/WavePortal.json"

export default function App({ Component }) {

  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);

  const contractAddress = "0x81C8adB5b526567B39f29Dad455b4BE1fC9f96aB"
  const contractABI = abi.abi;


  /*
  * Create a method that gets all waves from your contract
  */
  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();
        

        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const checkIfWalletIsConnected = async () => {
    try {
      // check access to window.ethereum
      const {ethereum} = window;

      if (!ethereum) {
        console.log("Make sure you have Metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      // check if authorized to access the user's wallet
      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account: ", account);
        setCurrentAccount(account);
        getAllWaves();
      } else {
        console.log("No authorized account found.")
      }
    } catch (error) {
      console.log(error);
    }
    
  }

  // Connect to Wallet
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error)
    }
  }

  // get TotalWaves
  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
        * Execute the actual wave from your smart contract
        */
        // const waveTxn = await wavePortalContract.wave();
        const waveTxn = await wavePortalContract.wave("Wave", { gasLimit: 300000 });
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
}
  
  // run func when the page loads.
  useEffect(() => {
    checkIfWalletIsConnected();
  });

  return (
    <Container maxW="container.xl" centerContent>
      <Heading>
        Hey there! 
      </Heading>

      <Text fontSize="3xl">
        I am Hanz and I worked on self-deprecating bottles, so that's pretty cool right? Connect your Ethereum wallet and wave at me!
      </Text>

      <Stack spacing={4} direction="row" align="center">
        <Button colorScheme="teal" variant="outline" onClick={wave}>
          Wave at Me
        </Button>

        {!currentAccount && (
        <Button colorScheme="teal" variant="solid" onClick={connectWallet}>
            Connect Wallet
        </Button>
        )}
      </Stack>


      {allWaves.map((wave, index) => {
        return (
          <Box w="100%" p={4} color="white" bg="teal" borderWidth="1px" borderRadius="lg" overflow="hidden"  key={index} style={{ marginTop: "16px", padding: "8px" }}>
            <Text fontSize="xl">
              {wave.message}
            </Text>
            <Text fontSize="xs">
              From: {wave.address}
            </Text>
            <Text fontSize="xs">
              When: {wave.timestamp.toString()}
            </Text>
          </Box>
          )
      })}


    </Container>
  );
}
