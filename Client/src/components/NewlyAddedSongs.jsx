import React, { useState, useEffect } from "react";
import { Box, Image, Text, SimpleGrid } from "@chakra-ui/react";
import conf from "../conf/conf.js";

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
        >
            {songs.length > 0 ? (
                <SimpleGrid
                    columns={[2, 3, 4]}
                    spacing={4}
                >
                    {songs.map((song) => (
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
                                {song.songName}
                            </Text>
                            <Text
                                fontSize={"sm"}
                                color={"gray.300"}
                            >
                                {song.artist || "Unknown Artist"}
                            </Text>
                        </Box>
                    ))}
                </SimpleGrid>
            ) : (
                <Text>No songs available</Text>
            )}
        </Box>
    );
};

export default NewlyAddedSongs;
