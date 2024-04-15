"use client"
import {
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  Stack,
  Text
} from '@chakra-ui/react'
import { useEffect } from 'react';

const steps = [
  { title: 'Initialization', description: 'Waiting for admin action'},
  { title: 'Registration', description: 'Contact an admin to be whitelisted' },
  { title: 'Proposals', description: 'Create vote proposals' },
  { title: 'Break', description: 'Proposal phase ended'},
  { title: 'Vote', description: 'Vote for a proposal' },
  { title: 'Break', description: 'Voting phases ended'},
  { title: 'Tally votes', description: 'Count votes' },
]

export default function TimeLine({contractStatus}) {
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  useEffect(() => {
    setActiveStep(contractStatus);
  },[contractStatus])

  const activeStepText = steps[activeStep].description

  return (
    <Stack my={4} mt={8}>
      <Stepper size='sm' index={activeStep} gap='0'>
        {steps.map((step, index) => (
          <Step key={index} gap='0'>
            <StepIndicator>
              <StepStatus complete={<StepIcon />} />
            </StepIndicator>
            <StepSeparator _horizontal={{ ml: '0' }} />
          </Step>
        ))}
      </Stepper>
      <Text>
        Step {activeStep + 1}: <b>{activeStepText}</b>
      </Text>
    </Stack>
  )
}
