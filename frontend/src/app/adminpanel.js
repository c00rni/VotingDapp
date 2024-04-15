"use client";
import {
  FormControl,
  FormErrorMessage,
  Text,
  Button,
  Input,
  Flex,
  VStack,
} from '@chakra-ui/react'
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
import { useToast } from '@chakra-ui/react'
import { useAccount } from 'wagmi';

export default function AdminPanel({status}) {

    const getVoter = async (_address) => {
        try {
            const voter = await readContract(config, {
                abi:jsonInterface,
                address: contractAddress,
                functionName: 'getVoter',
                account: getAccount(config).address,
                args: [
                    _address,
                ]
            });
            return voter;
        } catch(e) {
            console.log(e)
        }
    }

    const validateAddress = async (value) => {
        let error;
        const regex = new RegExp(/^(0x)?[0-9a-fA-F]{40}$/);
        if (regex.test(value)){
            const voter = await getVoter(value);
            if (voter.isRegistered) {
                error = "This address is already registered";
            }
        }
        else {
            error = "Address Required."
        }
        return error
    }


    const addVoter = async (voterAddress) => {
        try {
            const { request } = await simulateContract(config, {
                abi: jsonInterface,
                address: contractAddress,
                functionName: 'addVoter',
                args: [voterAddress],
                account: getAccount(config).address,
            })
            await writeContract(config, request);
            toast({
                title: 'Address accepted',
                description: "New user whitelisted",
                status: 'success',
                duration: 9000,
                isClosable: true,
                position: "top"
            })
        } catch(e) {
            console.log(e);
        }
    }

    const workflowStep = [
        {name:"startVoterRegistering", title:"Start voter registering"},
        {name:"startProposalsRegistering", title:"Start proposal registering"},
        {name:"endProposalsRegistering", title:"End proposal registering"},
        {name:"startVotingSession", title:"Start vote process"},
        {name:"endVotingSession", title:"End vote process"},
        {name:"tallyVotes", title:"Select Winner"}
    ]

     const forwardWorkflow = async () => {
        try {
            const { request } = await simulateContract(config, {
                abi: jsonInterface,
                address: contractAddress,
                functionName: workflowStep[status].name,
                account: getAccount(config).address,
            })
            await writeContract(config, request);
            toast({
                title: 'Process forward',
                description: "The contract continued to the next step",
                status: 'success',
                duration: 4500,
                isClosable: true,
                position: "top"
            });
        } catch(e) {
            console.log(e)
        }
    }

    const toast = useToast();
    const { isConnected } = useAccount();

    return (
        <>
        {isConnected && (
            <>
             <Formik
                initialValues={{ voterAddress: '' }}
                onSubmit={async (values, resetForm) => {
                    addVoter(values.voterAddress);
                    resetForm();
                }}
            >
                {(props) => (
                <>
                <Form>
                    <Field name='voterAddress' validate={(validateAddress)}>
                        {({ field, form }) => (
                        <FormControl isInvalid={form.errors.voterAddress && form.touched.voterAddress}>
                            <Text fontSize="3xl" mt={7} mb={2}>Add voters</Text>
                            <Flex>
                                <Input {...field} placeholder='Address to whitelist' bgColor="white" color="black" isDisabled={status !== 1}/>
                                <Button
                                    ml={3}
                                    colorScheme='blue'
                                    isLoading={props.isSubmitting}
                                    type='submit'
                                    isDisabled={status !== 1}
                                >
                                    Add
                                </Button>
                            </Flex>
                           <FormErrorMessage>{form.errors.voterAddress}</FormErrorMessage>
                        </FormControl>
                        )}
                    </Field>
                </Form>
                <FormControl>
                    <Text fontSize="3xl" mt={7} mb={2}>Voting Process</Text>
                    <Button onClick={forwardWorkflow} isDisabled={status === 6}>{workflowStep[status]?.title || "No more phases"}</Button>
                </FormControl>
                 </>
               )}
            </Formik>
            </>
        )

        }
       </>
    )
}