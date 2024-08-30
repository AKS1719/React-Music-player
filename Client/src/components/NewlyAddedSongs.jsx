import React, { useState, useEffect } from "react";
import { Box, Image, Text, Flex } from "@chakra-ui/react";
import conf from "../conf/conf.js";
import { trimTolength } from "../conf/utlis.js"

const NewlyAddedSongs = () => {
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        fetchLatestSongs();
    }, []);

    const fetchLatestSongs = async () => {
        try {
            const response = await fetch(
                `${conf.backendUrl}/songs/getSongList`,
                {
                    credentials: "include",
                }
            );
            const res = await response.json();
            if (res.statusCode >= 400) {
                console.log(res);
                throw new Error(res.message);
            }
            setSongs(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    // Function to get the image URL, either from the thumbnail or a generated placeholder
    const getImageUrl = (song) => {
        if (song.songThumbnailUrl) {
            return song.songThumbnailUrl;
        }
        // Generate a placeholder image using a service like via.placeholder.com or other dynamic services
        const placeholderImage = `https://via.placeholder.com/100.png?text=${encodeURIComponent(
            song.songName
        )}`;
        return placeholderImage;
    };


    return (
        <Box
            h={"37%"}
            w={"full"}
            color={"white"}
            p={4}
            overflowX={"auto"}
            css={{
                "&::-webkit-scrollbar": {
                    height: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#4A5568",
                    borderRadius: "8px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: "#2D3748",
                },
            }}
        >
            {songs.length > 0 ? (
                <Flex
                    direction={"row"}
                    gap={4}
                    // w={'40%'}
                    justifyContent={'space-around'}
                    // minWidth={"fit-content"} // Ensures the content won't shrink below its content size
                >
                    {songs.slice(0, 5).map((song) => (
                        <Box
                            key={song._id}
                            bg={"gray.700"}
                            borderRadius={"md"}
                            shadow={"md"}
                            overflow={"hidden"}
                            transition={"transform 0.2s"}
                            _hover={{ transform: "scale(1.05)" }}
                            textAlign={"center"}
                            p={2}
                            minW={"160px"} // Minimum width of each song card
                            flexShrink={0} // Prevents the box from shrinking
                        >
                            <Image
                                src={getImageUrl(song)}
                                alt={song.songName}
                                boxSize={"100px"}
                                objectFit={"cover"}
                                mx={"auto"}
                            />
                            <Text
                                mt={2}
                                fontSize={"lg"}
                                fontWeight={"bold"}
                                noOfLines={1}
                            >
                                {trimTolength(song.songName,15)}
                            </Text>
                            <Text
                                fontSize={"sm"}
                                color={"gray.300"}
                                noOfLines={1} // Ensures artist name also doesn't overflow
                            >
                                {trimTolength(song.artist,15) || "Unknown Artist"}
                            </Text>
                        </Box>
                    ))}
                </Flex>
            ) : (
                <Text>No songs available</Text>
            )}
        </Box>
    );
};

export default NewlyAddedSongs;
