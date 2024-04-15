"use client";
import { Box, Flex, Icon, Circle } from "@chakra-ui/react";
import styles from "./page.module.css";

export default function BlurBackground() {
    return (
        <>
          <Flex position={"absolute"} top={0} left={0} w="100%" h="100%" align={"center"} style={{ filter: "blur(35px)" }} zIndex="-1">
            <div className={styles.circlePurple}></div>
            <div className={styles.circleBlue}></div>
          </Flex>
        </>
    );
}
