import React from "react";
import { Avatar, Box, Center, Text , Icon, Button, VStack, Link, Divider } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import LibraryComponent from "./LibraryComponent";
import { SlLogout } from "react-icons/sl";

const Sidebar = () => {
    const authStatus = useSelector((state) => state.auth.status);
    const userData = useSelector(state=> state.auth.userData)

    return (
        <Box
            bg={"gray.900"}
            w={"20%"}
            height={"100%"}
            display={"flex"}
            // justifyContent={"center"}
            alignItems={"center"}
            py={"5"}
            flexDirection={"column"}
        >
            {!authStatus && (
                <Box
                    as="section"
                    bg={"gray.800"}
                    borderWidth={"1px"}
                    borderStyle={"solid"}
                    borderColor={"gray.700"}
                    w={"90%"}
                    rounded={"10px"}
                    p={4}
                    mb={4}
                    textAlign="center"
                >
                    <Text
                        fontSize={"xl"}
                        fontWeight={"bold"}
                        color={"white"}
                        mb={4}
                    >
                        Welcome!
                    </Text>
                    <VStack spacing={3}>
                            <Button
                                w="full"
                                bgGradient="linear(to-r, teal.400, blue.500)"
                                color="white"
                                _hover={{
                                    bgGradient:
                                        "linear(to-r, teal.300, blue.400)",
                                }}
                                _focus={{
                                    outline: "none",
                                    boxShadow: "outline",
                                }}
                            >
                                Login
                            </Button>
                            <Button
                                w="full"
                                bgGradient="linear(to-r, orange.400, pink.500)"
                                color="white"
                                _hover={{
                                    bgGradient:
                                        "linear(to-r, orange.300, pink.400)",
                                }}
                                _focus={{
                                    outline: "none",
                                    boxShadow: "outline",
                                }}
                            >
                                Signup
                            </Button>
                    </VStack>
                    <Divider
                        my={4}
                        borderColor="gray.600"
                    />
                    <Text
                        fontSize={"sm"}
                        color={"gray.400"}
                    >
                        Join us to explore exclusive content!
                    </Text>
                </Box>
            )}
            {authStatus && (
                <Box
                    as="section"
                    bg={"gray.800"}
                    borderWidth={"1px"}
                    borderStyle={"solid"}
                    borderColor={"gray.700"}
                    w={"90%"}
                    rounded={"10px"}
                    p={4}
                    mb={4}
                    textAlign="center"
                >
                    <Box
                        display={"flex"}
                        alignItems={"center"}
                        mb={3}
                    >
                        <Avatar
                            name={userData?.name}
                            src={userData?.avatar}
                            size={"md"}
                        />
                        <Text
                            fontSize={"xl"}
                            ml={4}
                            color="white"
                        >
                            {userData?.name}
                        </Text>
                    </Box>
                    <Button
                        onClick={handleLogout}
                            w="full"
                            bgGradient="linear(to-r, red.400, pink.500)"
                            color="white"
                            _hover={{
                                bgGradient: "linear(to-r, red.300, pink.400)",
                            }}
                            _focus={{
                                outline: "none",
                                boxShadow: "outline",
                            }}
                        >
                            <SlLogout /> &nbsp; Logout
                        </Button>
                </Box>
            )}

            <LibraryComponent />
        </Box>
    );
};

export default Sidebar;
