import React from "react";
import { Box, Flex, Text, Image, Button } from "@chakra-ui/react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Carousel } from "../components/index.js";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
    useGSAP(() => {
        const timeline = gsap.timeline();

        timeline
            .from("#logo", {
                opacity: 0,
                x: -300,
                duration: 2,
                ease: "power3.out",
            })
            .from(
                "#titlebox",
                {
                    opacity: 0,
                    x: 300,
                    duration: 2,
                    ease: "power3.out",
                },
                "-=2" // This ensures that both animations start at the same time
            )
    });
    const navigate = useNavigate()
    return (
        <Box
            as="main"
            position="relative"
            w="100%"
            h="100vh"
            overflowX="hidden"
            display="flex"
            flexDirection="column"
            bgGradient="linear(to-br, gray.900, gray.800)"
        >
            <Carousel />
            <Flex
                as="header"
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                justifyContent="center"
                alignItems="center"
                px={10}
                direction="column"
                textAlign="center"
                gap={4}
                bg="rgba(0, 0, 0, 0.1)"
                // backdropFilter="blur(10px)" // Ensure this is applied as a base style
            >
                <Flex
                    alignItems="center"
                    justifyContent={"center"}
                    direction={{ base: "column", md: "row" }}
                    h={"full"}
                    w="full"
                    px={{ base: 4, md: 10 }}
                    py={6}
                    gap={6}
                >
                    <Image
                        id="logo"
                        src="/res/vaiakshMusic1.png"
                        alt="Logo"
                        height={{ base: "30%", md: "40%" }}
                        rounded="full"
                        mb={4}
                        boxShadow="md"
                    />
                    <Box
                        mb={4}
                        ml={4}
                        id="titlebox"
                        rounded={'10px'}
                        pb={4}
                        // Ensure backdropFilter is included in the initial style
                        backdropFilter="blur(10px)"
                    >
                        <Text
                            fontSize={{ base: "3xl", md: "5xl" }}
                            fontWeight="bold"
                            color="white"
                            px={4}
                            py={2}
                            mb={4}
                            position="relative"
                            zIndex="1"
                            bg="rgba(0, 0, 0, 0.3)"
                            borderRadius="md"
                            boxShadow="md"
                        >
                            Vaiaksh Music - Where Music Becomes Alive
                        </Text>
                        <Button
                            onClick={()=> {navigate('/music-player')}}
                                fontSize={{ base: "lg", md: "xl" }}
                                color="white"
                                px={8}
                                py={4}
                                border="2px solid"
                                borderColor="green.500"
                                bg="green.400"
                                boxShadow="md"
                                rounded="md"
                                _hover={{
                                    bg: "green.500",
                                    borderColor: "green.600",
                                    boxShadow: "lg",
                                }}
                                _focus={{
                                    outline: "none",
                                    boxShadow: "outline",
                                }}
                                // transition="all 0.3s ease"
                            >
                                Start Listening...
                            </Button>
                    </Box>
                </Flex>
            </Flex>
        </Box>
    );
};

export default Home;
