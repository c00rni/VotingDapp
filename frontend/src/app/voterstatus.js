import { Icon, createIcon } from '@chakra-ui/react';
import {
  Table,
  Thead,
  Tbody,
  Text,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react'
import styles from "./page.module.css";
import { useEffect, useState } from 'react';
import { usePublicClient, useWatchContractEvent } from 'wagmi';
import { getBlockNumber, watchContractEvent } from '@wagmi/core';
import { parseAbiItem } from 'viem'
import { config } from './providers'
import { contractAddress } from './providers';
import { jsonInterface } from './votingABI';

export default function VoterStatus() {
    const [voters, setVoters] = useState([]);

    useWatchContractEvent({
        address: contractAddress,
        abi:jsonInterface,
        eventName: 'VoterRegistered',
        onLogs(logs) {
            setVoters([logs[0].args.voterAddress, ...voters]);
        },
        onError(error) {
            console.error('Logs error', error)
        },
     })

    const getVotersAddresses = async () => {
        const blockNumber = await getBlockNumber(config)
        const logList = client.getLogs({
            address: contractAddress,
            event: parseAbiItem('event VoterRegistered(address voterAddress)'),
            fromBlock: 0n,
            toBlock: blockNumber,
        }).then((logs) => {
            const eventAddress = []
            logs.forEach((log) => {
                eventAddress.push(log.args.voterAddress);
            });
            setVoters(eventAddress);
        });
        return logList;
    }

    const client = usePublicClient();
    useEffect(() => {
       getVotersAddresses();
    }, [])

    return (
        <>
<Text fontSize="3xl" mt={7} mb={2}>Whitelist</Text>
<TableContainer className={styles.voterList}>
  <Table variant='simple'>
    <TableCaption>Registered voter information</TableCaption>
    <Thead>
      <Tr>
        <Th>Users</Th>
        <Th>Voted</Th>
      </Tr>
    </Thead>
    <Tbody>
        {voters.map((voter) => {
            return (
                <Tr key={voter}>
                    <Td><p>{voter}</p></Td>
                    <Td>
                        <Icon viewBox='0 0 200 200' color='red.500'>
                            <path
                                fill='currentColor'
                                d='M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0'
                            />
                        </Icon>
                    </Td>
                </Tr>
            );
        })}
    </Tbody>
  </Table>
</TableContainer>
        </>
    );
}