import {
  Text
} from '@chakra-ui/react';
import { Card, CardBody } from '@chakra-ui/react'
import { lobster } from './fonts';




export default function WinnerCard({desc}) {
    return (
        <>
            <Text fontSize='4xl' align="center" className={lobster.className}>Winning proposal</Text>
            <Card>
                <CardBody>
                    <Text align="center">{desc}</Text>
                </CardBody>
            </Card>
        </>
    );
}