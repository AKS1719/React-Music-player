import React from "react";
import { Box, Button, HStack, Input, Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";

const Header = ({ isSearchPage, playlistName, artist, album }) => {
    const authStatus = useSelector((state) => state.auth.status);

    return (
        <Box
            as="header"
            h={"10%"}
            w={"100%"}
            bg={"gray.800"}
            p={"2%"}
            color={"white"}
            borderWidth={"1px"}
            borderColor={"gray.700"}
            borderRadius={"12px"}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            boxShadow="lg"
        >
            {authStatus && isSearchPage && (
                <Box width={"40%"}>
                    <form>
                        <HStack spacing={"2%"}>
                            <Input
                                w={"70%"}
                                bg={"white"}
                                placeholder="Search"
                                color={"black"}
                                _placeholder={{ color: "gray.500" }}
                                borderRadius="8px"
                                focusBorderColor="blue.500"
                            />
                            <Button
                                type="submit"
                                bg={"blue.500"}
                                color={"white"}
                                _hover={{ bg: "blue.400" }}
                                borderRadius="8px"
                            >
                                Search
                            </Button>
                        </HStack>
                    </form>
                </Box>
            )}

            {authStatus && (playlistName || artist || album) && (
                <Box
                    textAlign="right"
                    flex="1"
                    pr={"2%"}
                    fontSize={"1.1vw"}
                    lineHeight={"1.5"}
                >
                    {playlistName && <Text>{playlistName}</Text>}
                    {artist && <Text>{artist}</Text>}
                    {album && <Text>{album}</Text>}
                </Box>
            )}

            {!authStatus && (
                <Text
                    fontSize={"1.2vw"}
                    textAlign="center"
                    w={"100%"}
                >
                    Login for a better music experience
                </Text>
            )}
        </Box>
    );
};

export default Header;
