import React from "react";
import { Avatar, Box, Text, Button, VStack, Divider } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import LibraryComponent from "./LibraryComponent";
import { SlLogout } from "react-icons/sl";

const Sidebar = () => {
    const authStatus = useSelector((state) => state.auth.status);
    const userData = useSelector((state) => state.auth.userData);

    const handleLogin = () => {};
    const handleSignup = () => {};
    const handleLogout = async () => {};

    return (
        <Box
            bg={"gray.900"}
            w={"20%"}
            height={"100%"}
            display={"flex"}
            alignItems={"center"}
            py={"2%"}
            flexDirection={"column"}
        >
            {!authStatus ? (
                <Box
                    as="section"
                    bg={"gray.800"}
                    borderWidth={"2px"}
                    borderColor={"gray.700"}
                    w={["95%", "90%"]} // Responsive width
                    rounded={"4%"}
                    p={"4%"}
                    mb={"4%"}
                    textAlign="center"
                    h={"30%"}
                >
                    <Text
                        fontSize={["4vw", "2.5vw", "1.5vw"]} // Responsive font size
                        fontWeight={"bold"}
                        color={"white"}
                        mb={"4%"}
                    >
                        Welcome!
                    </Text>
                    <VStack spacing={"3"}>
                        <Button
                            onClick={handleLogin}
                            w="full"
                            bgGradient="linear(to-r, teal.400, blue.500)"
                            color="white"
                            _hover={{
                                bgGradient: "linear(to-r, teal.300, blue.400)",
                            }}
                        >
                            Login
                        </Button>
                        <Button
                            onClick={handleSignup}
                            w="full"
                            bgGradient="linear(to-r, orange.400, pink.500)"
                            color="white"
                            _hover={{
                                bgGradient:
                                    "linear(to-r, orange.300, pink.400)",
                            }}
                        >
                            Signup
                        </Button>
                    </VStack>
                    <Divider
                        my={"4%"}
                        borderColor="gray.600"
                    />
                    <Text
                        fontSize={["2.5vw", "1.5vw", "1vw"]}
                        color={"gray.400"}
                    >
                        Join us to explore exclusive content!
                    </Text>
                </Box>
            ) : (
                <Box
                    as="section"
                    bg={"gray.800"}
                    borderWidth={"2px"}
                    borderColor={"gray.700"}
                    w={["95%", "90%"]} // Responsive width
                    rounded={"4%"}
                    p={"4%"}
                    mb={"4%"}
                    textAlign="center"
                    h={"30%"}
                >
                    <Box
                        display={"flex"}
                        alignItems={"center"}
                        mb={"3%"}
                        onClick={() => {
                            console.log("Make a profile page.");
                        }}
                    >
                        <Avatar
                            name={userData?.name}
                            src={userData?.avatar}
                            size={["sm", "md"]} // Responsive size
                        />
                        <Text
                            fontSize={["3vw", "1.5vw", "1.2vw"]} // Responsive font size
                            ml={"2%"}
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
