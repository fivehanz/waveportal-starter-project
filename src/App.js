import { Button } from "@chakra-ui/button";
import { Box, Container, Heading, Text } from "@chakra-ui/layout";
import * as React from "react";
// import { ethers } from "ethers";

export default function App({ Component }) {

  const wave = () => {
    
  }
  
  return (
    <Container maxW="container.xl" centerContent>
      {/* <div className="dataContainer"> */}
        <Heading>
        Hey there! 
        </Heading>

        <Text fontSize="3xl">
        I am Hanz and I worked on self-driving cars so that's pretty cool right? Connect your Ethereum wallet and wave at me!
        </Text>

        
      {/* </div> */}
    <Button colorScheme="teal" variant="outline" onClick={wave}>
      Wave at Me
    </Button>
    </Container>
  );
}
