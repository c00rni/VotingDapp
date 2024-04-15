"use client";
import {
  VStack,
  Text,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Spacer,
  useDisclosure,
  HStack,
  Container,
  Flex
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { lobster } from './fonts';
import { useRef } from "react";
import styles from "./page.module.css";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Link } from '@chakra-ui/next-js';
import { useAccount , useWatchContractEvent } from 'wagmi';
import TimeLine  from './timeline';

import { watchContractEvent, getAccount, readContract } from '@wagmi/core'
import { jsonInterface } from './votingABI'
import { config } from './providers'
import { useEffect, useState} from 'react';
import VoterStatus from './voterstatus';
import { contractAddress } from './providers';
import Proposals from './proposals';
import WinnerCard from './winnerCard';
import AdminPanel from './adminpanel';

export default function Home() {
  const { isConnected } = useAccount();
  const [status, setStatus] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const [winner, setWinner] = useState({id: 0, desc:""});
/*
  const unwatchStatusChanges = watchContractEvent(config, {
    address: contractAddress,
    abi: jsonInterface,
    eventName: 'WorkflowStatusChange',
    onLogs(logs) {
      changeStatus(logs[0].args.newStatus);
    },
    onError(error) {
      console.error('Logs error', error)
    },
  });
*/
    useWatchContractEvent({
        address: contractAddress,
        abi:jsonInterface,
        eventName: 'WorkflowStatusChange',
        onLogs(logs) {
          changeStatus(logs[0].args.newStatus);
        },
        onError(error) {
          console.error('Logs error', error)
        },
    })

  const changeStatus = async (data) => {

    const contractStatus = await data;
    if (contractStatus == 6) {
      getWinner();
    }

    if (contractStatus > status) {
      setStatus(contractStatus);
    }
  }

    const getWinner = async () => {
        try {
            const result = await readContract(config, {
                abi:jsonInterface,
                address: contractAddress,
                functionName: 'getWinner'
            });
            if (result != winner.id) {
              const proposals = await readContract(config, {
                abi:jsonInterface,
                address: contractAddress,
                functionName: 'getProposals'
              });

              setWinner({id: result, desc: proposals[result].description})
            }
        } catch(e) {
            console.log(e)
        }
    }

  useEffect(()=> {
    if (isConnected) {
      getWinner();

      const res = getWorkflowStatus();
      if (res != -1) {
        changeStatus(res);
      }
    }
  }, [isConnected])

  const getWorkflowStatus = async () => {
    if (isConnected) {
      try {
        const result = await readContract(config, {
          abi:jsonInterface,
          address: contractAddress,
          functionName: 'workflowStatus'
        });
        if (result == 6) {
          getWinner();
        }
        return result;
      } catch(e) {
        console.log(e)
      }
    }
    return -1;
  }

  return (
    <>
      <Container p="3" px="4" h="100%">
      <HStack>
          <Text fontSize='4xl' className={lobster.className}>Voting DAPP</Text>
          <Spacer />
          <HamburgerIcon boxSize={8} ref={btnRef} onClick={onOpen}/>
      </HStack>
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay/>
        <DrawerContent>
          <DrawerCloseButton color="#fff"/>

          <DrawerBody bg="purple" color="#fff">
            <VStack mt={10}>
              <Link href='/about' color='white' m={1} fontWeight="bold" _hover={{ color: 'blue.500' }}>
                About
              </Link>
              <Link href='https://github.com/c00rni' m={1} fontWeight="bold" color='white' _hover={{ color: 'blue.500' }}>
                Github
              </Link>
              <Link href='https://github.com/c00rni' m={1} fontWeight="bold" color='white' _hover={{ color: 'blue.500' }}>
                Docs
              </Link>
              <AdminPanel status={status}/>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      { !isConnected ? (
        <main className={styles.unauthMain}>
          <Text fontSize="3xl" mb={5} fontWeight="100">Simple voting Decentralize app.</Text>
          <ConnectButton label="Launch APP"/>
        </main>
      ) : (
        <main>
          <Flex>
            <Spacer />
            <ConnectButton label="Launch APP"/>
          </Flex>
          <TimeLine contractStatus={status}/>
          {winner.id != 0 ? (
            <WinnerCard desc={winner.desc} />
          ) : (
            <>
              <VoterStatus />
              <Proposals status={status}/>
             </>
          )}
       </main>
      )}
      </Container>
    </>
  );
}
