import React, { useState } from "react";
import { Box, Flex, Text, IconButton, HStack, Button } from "@chakra-ui/react";
import { IoLibrarySharp } from "react-icons/io5";
import { MdLibraryAdd } from "react-icons/md";
import { FcLike } from "react-icons/fc";
import { GoIssueTracks } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PlaylistComponent from "./PlaylistComponent";
const LibraryComponent = () => {
    const [Playlists, setPlaylists] = useState([]);
    const navigate = useNavigate();
    const authStatus = useSelector((state) => state.auth.status);

    const handleCreatePlaylist = async () => {
        if (!authStatus) {
            alert("Login to create a playlist");
        }
    };

    return (
        <Flex
            direction="column"
            rounded="10px"
            h="70%"
            as="section"
            bg="gray.800"
            borderWidth="2px"
            borderColor="gray.700"
            w="90%"
            p={"4%"}
            mb={"4%"}
            boxShadow="md"
            _hover={{ boxShadow: "lg" }}
            transition="box-shadow 0.3s ease-in-out"
        >
            <Box
                as="header"
                py={"1%"}
                px={"2%"}
                borderBottomWidth="1px"
                borderBottomColor="gray.700"
                mb={"4%"}
                p={"2%"}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
            >
                <Text
                    fontSize="1.2vw"
                    fontWeight="bold"
                    color="white"
                    display="flex"
                    alignItems="center"
                    gap={"2%"}
                >
                    <IoLibrarySharp /> Library
                </Text>
                <IconButton
                    aria-label="Add Playlist"
                    icon={<MdLibraryAdd />}
                    colorScheme="teal"
                    variant="outline"
                    _hover={{ bg: "teal.600", color: "white" }}
                    transition="background-color 0.2s ease-in-out"
                    onClick={handleCreatePlaylist}
                />
            </Box>

            <HStack
                as="section"
                p={"3%"}
                bg="gray.700"
                rounded="10px"
                mb={"3%"}
                borderWidth="2px"
                borderColor="gray.600"
                spacing={"3%"}
                alignItems="center"
                _hover={{ bg: "gray.600", transform: "scale(1.02)" }}
                transition="all 0.2s ease-in-out"
                cursor="pointer"
            >
                <FcLike size="1.2vw" />
                <Text
                    fontSize={"1vw"}
                    color="white"
                    fontWeight="semibold"
                >
                    Liked Songs
                </Text>
            </HStack>

            <HStack
                as="section"
                p={"3%"}
                bg="gray.700"
                rounded="10px"
                mb={"3%"}
                borderWidth="2px"
                borderColor="gray.600"
                spacing={"3%"}
                alignItems="center"
                _hover={{ bg: "gray.600", transform: "scale(1.02)" }}
                transition="all 0.2s ease-in-out"
                cursor="pointer"
            >
                <GoIssueTracks
                    size="1.2vw"
                    color="white"
                />
                <Text
                    fontSize={"1vw"}
                    color="white"
                    fontWeight="semibold"
                >
                    Recently Played
                </Text>
            </HStack>

            <Box
                as="section"
                h="full"
                p={"1%"}
                bg="gray.800"
                borderRadius="md"
                boxShadow="md"
            >
                <Text
                    fontWeight="bold"
                    fontSize="1.2vw"
                    mb={"4%"}
                    pb={"2%"}
                    color={"white"}
                    borderBottomWidth="1px"
                    borderBottomColor="gray.700"
                >
                    Playlists
                </Text>
                <Box
                    h="75%"
                    bg="gray.700"
                    borderRadius="md"
                    overflowY={"auto"}
                    css={{
                        "&::-webkit-scrollbar": {
                            width: "7px",
                            borderRadius: "10px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                            background: "#319795", // teal.500 equivalent
                            borderRadius: "10px",
                        },
                        "&::-webkit-scrollbar-track": {
                            background: "#ffffff",
                            borderRadius: "10px",
                        },
                    }}
                >
                    <Box h={"100%"}>
                        {Playlists?.length > 0 ? (
                            Playlists.map((playlist) => (
                                <Box
                                    key={playlist?.id}
                                    p={"1%"}
                                    bg="gray.700"
                                    rounded="md"
                                    mb={"1%"}
                                    _hover={{
                                        bg: "gray.600",
                                        transform: "scale(1.03)",
                                    }}
                                    transition="all 0.2s ease-in-out"
                                    cursor="pointer"
                                >
                                    <PlaylistComponent
                                        playlistName={playlist?.playlistName}
                                    />
                                </Box>
                            ))
                        ) : (
                            <Box
                                p={"2%"}
                                bg="gray.800"
                                rounded="md"
                                borderWidth="2px"
                                borderColor="teal.400"
                                textAlign="center"
                                color="white"
                                h={"100%"}
                            >
                                <Text
                                    mb={"3%"}
                                    fontSize="1.2vw"
                                    textAlign={"center"}
                                >
                                    No playlists available. Create a new
                                    playlist!
                                </Text>
                                <Button
                                    onClick={handleCreatePlaylist}
                                    leftIcon={<MdLibraryAdd />}
                                    colorScheme="teal"
                                    variant="outline"
                                    _hover={{
                                        bg: "teal.600",
                                        color: "white",
                                    }}
                                    size="sm"
                                >
                                    Create Playlist
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>
        </Flex>
    );
};



export default LibraryComponent;
