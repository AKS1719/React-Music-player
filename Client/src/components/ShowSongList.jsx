import React, { useEffect, useState } from "react";
import { Box, Image, Text, Flex, Spinner, VStack, IconButton, Button } from "@chakra-ui/react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import conf from "../conf/conf.js";
import { useDispatch } from "react-redux";
import { hideList } from "../store/showList.js"; // Adjust this path as needed

const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + "...";
    }
    return text;
};

const ShowSongList = ({ playlistId }) => {
    const [randomSongs, setRandomSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedSongs, setSelectedSongs] = useState([]);
    const [showSaveCancel, setShowSaveCancel] = useState(false);
    const dispatch = useDispatch();

    const fetchRandomSongs = async () => {
        try {
            const response = await fetch(
                `${conf.backendUrl}/songs/getRandomSongs`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ playlistId }),
                }
            );
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message);
            }
            const { songs } = await response.json();
            setRandomSongs(songs);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRandomSongs();
    }, [playlistId]);

    const handleAddSong = (song) => {
        if (!selectedSongs.some((s) => s._id === song._id)) { // Assuming song has an id
            setSelectedSongs((prev) => [...prev, song]);
            setShowSaveCancel(true);
        }
    };

    const handleSave = async () => {
        const songIds = selectedSongs.map(song => song._id);

        try {
            const response = await fetch(
                `${conf.backendUrl}/playlist/updatePlaylist`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ playlistId, songsId: songIds }),
                }
            );
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message);
            }
            const d = await response.json()
            console.log(d)
            setSelectedSongs([]);
            setShowSaveCancel(false);
            dispatch(hideList());
        } catch (error) {
            setError(error.message);
        }
    };

    const handleCancel = () => {
        setSelectedSongs([]);
        setShowSaveCancel(false);
        dispatch(hideList());
    };

    return (
        <Box
            w="100%"
            maxW="100%"
            h="400px"
            p={4}
            position="relative"
            borderWidth="1px"
            borderRadius="lg"
            borderColor="gray.600"
            boxShadow="lg"
            bg="rgb(0,0,0,0.6)"
            css={{
                "&::-webkit-scrollbar": {
                    width: "7px",
                    borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb": {
                    background: "#319795",
                    borderRadius: "10px",
                },
                "&::-webkit-scrollbar-track": {
                    background: "#ffffff",
                    borderRadius: "10px",
                },
            }}
            overflowY="auto"
            paddingBottom={showSaveCancel ? "60px" : "4"}
        >
            <IconButton
                icon={<CloseIcon />}
                bg="transparent"
                position="absolute"
                top={2}
                right={2}
                aria-label="Close"
                onClick={() => dispatch(hideList())}
            />
            {error && (
                <Text color="crimson" mb={4}>
                    {error}
                </Text>
            )}
            {loading ? (
                <Flex
                    justifyContent="center"
                    alignItems="center"
                    h="100%"
                >
                    <Spinner size="lg" color="orange.400" />
                </Flex>
            ) : randomSongs.length > 0 ? (
                <VStack spacing={4}>
                    {randomSongs.map((song, index) => (
                        <Flex
                            key={index}
                            align="center"
                            p={4}
                            bg="gray.800"
                            borderRadius="md"
                            w="full"
                            boxShadow="lg"
                            _hover={{ bg: "gray.700" }}
                            cursor="pointer"
                            justify="space-between"
                        >
                            <Flex align="center">
                                <Image
                                    src={song.albumCover || "default-image-url.jpg"}
                                    alt={song.songName || "Unknown"}
                                    boxSize="50px"
                                    borderRadius="md"
                                    mr={4}
                                />
                                <Box>
                                    <Text fontWeight="bold" color="white">
                                        {truncateText(song.songName || "Unknown", 20)}
                                    </Text>
                                    <Text fontSize="sm" color="gray.400">
                                        {truncateText(song.artist || "Unknown", 20)}
                                    </Text>
                                </Box>
                            </Flex>
                            <IconButton
                                aria-label="Add to playlist"
                                icon={<AddIcon />}
                                onClick={() => handleAddSong(song)}
                                colorScheme="teal"
                            />
                        </Flex>
                    ))}
                </VStack>
            ) : (
                <Text color="white" border="2px solid" borderColor="gray.800" p={4}>
                    No songs found.
                </Text>
            )}
            {showSaveCancel && (
                <Flex justify="space-between" position="fixed" left="0" bottom={0} w="full" p={4} bg="rgba(0,0,0,0.7)">
                    <Button onClick={handleCancel} colorScheme="red">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} colorScheme="teal">
                        Save
                    </Button>
                </Flex>
            )}
        </Box>
    );
};

export default ShowSongList;
