import React, { useState, useEffect } from "react";
import { Box, VStack, Text, Button, Image, SlideFade, Flex, Center } from "@chakra-ui/react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Sidebar from "../components/Sidebar.jsx";

function Home() {
    useEffect(() => {}, []);

    useGSAP(() => {
        gsap.to("#firstBox", {
            duration: 2,
            x: 200,
            ease: "elastic",
            yoyo: true,
            repeat: -1,
        });
    });

    return (
        <Box
            as="main"
            bg={"gray.900"}
            height="100vh"
            width={"100vw"}
            display="flex"
            alignItems="center"
            justifyContent="center"
            rounded={"50px"}
            color="white"
        >

            <Flex height={'100%'} w={'100%'}>
                <Sidebar/>
            </Flex>
        </Box>
    );
}

export default Home;
