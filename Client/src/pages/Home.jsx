import React from "react";
import { Box, Flex, Text, Image, Button } from "@chakra-ui/react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Carousel } from "../components/index.js";
import { Link } from "react-router-dom";

const Home = () => {
    useGSAP(() => {
        gsap.to("#logo", {
            rotate: 360,
            repeat: -1,
            duration: 5,
        });
    }, []);

    return (
        <Box
            as="main"
            position="relative"
            w="100%"
            h="100vh"
            overflowX="hidden"
            display="flex"
            flexDirection="column"
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
            >
                <Flex
                    alignItems="center"
                    direction={{ base: "column", md: "row" }}
                    h={"full"}
                    w="full"
                    px={{ base: 4, md: 10 }}
                    py={6}
                >
                    <Image
                        id="logo"
                        src="/res/vaiakshMusic1.png"
                        alt="Logo"
                        height={{ base: "40%", md: "40%" }}
                        rounded="full"
                        mb={4}
                    />
                    <Box
                        mb={4}
                        ml={4}
                    >
                        <Text
                            fontSize={{ base: "2xl", md: "4xl" }}
                            color="white"
                            px={4}
                            py={2}
                            mb={4}
                            position="relative"
                            zIndex="1"
                            bg="rgba(0, 0, 0, 0.2)" // Semi-transparent background
                            borderRadius="md"
                            backdropFilter="blur(10px)" // Glass effect
                        >
                            Vaiaksh Music - Where Music Becomes Alive
                        </Text>
                        <Link to="/music-player">
                            <Button
                                fontSize={{ base: "lg", md: "2xl" }}
                                color="white"
                                px={6}
                                py={3}
                                border="2px solid"
                                borderColor="green.500"
                                bgGradient="linear(to-r, teal.300, blue.400)" // Use bgGradient instead of bg
                                boxShadow="lg"
                                rounded="md"
                                position="relative"
                                zIndex="1"
                                _hover={{
                                    bgGradient:
                                        "linear(to-r, teal.400, blue.500)",
                                    borderColor: "green.600",
                                }}
                            >
                                Start Listening...
                            </Button>
                        </Link>
                    </Box>
                </Flex>
            </Flex>
        </Box>
    );
};

export default Home;
