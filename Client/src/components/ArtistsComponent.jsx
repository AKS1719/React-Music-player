import React, { useState, useEffect } from "react";
import { Box, Image, Text, Flex, Avatar } from "@chakra-ui/react";
import conf from "../conf/conf.js";

const ArtistsComponent = () => {
    const [artists, setArtists] = useState([]);

    useEffect(() => {
        fetchArtists();
    }, []);

    const fetchArtists = async () => {
        try {
            const response = await fetch(
                `${conf.backendUrl}/users/getArtistList`,
                {
                    credentials: "include",
                }
            );
            const res = await response.json();
            if (res.statusCode >= 400) {
                console.log(res);
                throw new Error(res.message);
          }
          setArtists(res.data.artists);
          console.log(artists)
        } catch (error) {
            console.log(error);
        }
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
            {artists.length > 0 ? (
                <Flex
                    direction={"row"}
                    gap={4}
                    minWidth={"fit-content"}
                >
                    {artists.slice(0, 5).map((artist) => (
                        <Box
                            key={artist._id}
                            bg={"gray.700"}
                            borderRadius={"md"}
                            shadow={"md"}
                            overflow={"hidden"}
                            transition={"transform 0.2s"}
                            _hover={{ transform: "scale(1.05)" }}
                            textAlign={"center"}
                            p={2}
                            minW={"160px"}
                            flexShrink={0}
                        >
                            <Avatar
                                src={artist.avatar}
                                alt={artist.name}
                                name={artist.name}
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
                                {artist.name}
                            </Text>
                        </Box>
                    ))}
                </Flex>
            ) : (
                <Text>No artists available</Text>
            )}
        </Box>
    );
};

export default ArtistsComponent;
