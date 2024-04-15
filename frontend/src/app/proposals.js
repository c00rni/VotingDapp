"use client";
import {
  FormControl,
  FormErrorMessage,
  Text,
  Button,
  Input,
  Flex,
  Spacer,
  Box,
  Card,
  CardBody,
} from '@chakra-ui/react'
import styles from "./page.module.css";
import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { config } from './providers'
import { contractAddress } from './providers';
import { jsonInterface } from './votingABI';
import {
    readContract,
    getAccount,
    writeContract,
    watchContractEvent,
    simulateContract
} from '@wagmi/core'
import { usePublicClient, useWriteContract } from 'wagmi';
import { Radio, RadioGroup } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'

export default function Proposals({status}) {
    const [proposals, setProposals] = useState([]);
    const [formIsActive, setFormIsActive] = useState(false);
    const [votesValue, setVoteValue] = useState(0);
    const [hasVoted, setHasVoted] = useState(false);
    const toast = useToast();

    const validateProposal = (value) => {
        let error
        if (!value) {
            error = "A description is required";
        }
        return error
    }

    const addProposal = async (description) => {
        try {
            const { request } = await simulateContract(config, {
                abi: jsonInterface,
                address: contractAddress,
                functionName: 'addProposal',
                args: [description], //used a hardcoded string for test
                account: getAccount(config).address,
            })
            await writeContract(config, request);
        } catch(e) {
            console.log(e);
        }
    }

    const getProposals = async () => {
        try {
            const result = await readContract(config, {
                abi:jsonInterface,
                address: contractAddress,
                functionName: 'getProposals'
            });
            setProposals(result)
        } catch(e) {
            console.log(e)
        }
    }

    const unwatchStatusChanges = watchContractEvent(config, {
        address: contractAddress,
        abi: jsonInterface,
        eventName: 'ProposalRegistered',
        onLogs(logs) {
            getProposals();
        },
        onError(error) {
            console.error('Logs error', error)
        },
    });



    const vote = async (proposalId) => {
        try {
            const { request } = await simulateContract(config, {
                abi: jsonInterface,
                address: contractAddress,
                functionName: 'setVote',
                args: [proposalId],
                account: getAccount(config).address,
            })
            await writeContract(config, request);
        } catch(e) {
            toast({
                title: 'Vote not registered',
                description: "You have already voted",
                status: 'error',
                duration: 9000,
                isClosable: true,
                position: "top"
            })
            console.log(e);
        }
    }

    watchContractEvent(config, {
        address: contractAddress,
        abi: jsonInterface,
        eventName: 'Voted',
        args: {
            _id: getAccount(config).address
        },
        onLogs(logs) {
            setHasVoted(true);
        },
        onError(error) {
           console.error('Logs error', error)
        },
    });

    useEffect(() => {
        getProposals();
    }, [])

    return (
        <>
            <Formik
                initialValues={{ description: '' }}
                onSubmit={async (values, actions) => {
                    addProposal(values.description);
                    actions.resetForm({description: ''});
                }}
            >
                {(props) => (
                <Form>
                    <Field name='description' validate={(validateProposal)}>
                        {({ field, form }) => (
                        <>
                        <Text fontSize="3xl" mt={7} mb={2}>Proposals</Text>
                        <FormControl isInvalid={form.errors.description && form.touched.description}>
                            <Flex>
                                <Input {...field} placeholder='Your proposal description' isDisabled={status !== 2}/>
                                <Button
                                    ml={3}
                                    colorScheme='blue'
                                    isLoading={props.isSubmitting}
                                    type='submit'
                                    isDisabled={status !== 2}
                                >
                                    Add
                                </Button>
                            </Flex>
                           <FormErrorMessage>{form.errors.description}</FormErrorMessage>
                        </FormControl>
                        </>
                       )}
                    </Field>
                </Form>
                )}
            </Formik>
            <Box>
                <Text fontSize="3xl" mt={7} mb={2}>Vote</Text>
                <RadioGroup onChange={setVoteValue} value={votesValue} >
                    {proposals.length === 0 ? (
                        <>
                        <Card mt={3}>
                            <CardBody>
                                <Text align="center">No proposal submited.</Text>
                            </CardBody>
                        </Card>
                        </>
                    ) : (
                        <>
                        {proposals.filter(proposal => proposal.description != "GENESIS").map((proposal, index) => {
                            return (
                                <Flex key={index+1} mt={3}>
                                    <Text>{proposal.description}</Text>
                                    <Spacer />
                                    <Radio value={`${index+1}`} isDisabled={status !== 4 || hasVoted}></Radio>
                                </Flex>
                            );
                        })}
                        </>
                    )}
               </RadioGroup>
            </Box>
            <Button
                mt={3}
                colorScheme='blue'
                type='submit'
                onClick={() => !hasVoted && vote(votesValue)}
                isDisabled={hasVoted || status != 4}
            >
                Vote
            </Button>
       </>
    );
}