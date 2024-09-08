import React, { useState, useEffect } from "react";
import { Box, Text, Flex, Avatar, Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import conf from "../conf/conf.js";

const ArtistsComponent = () => {
    const [artists, setArtists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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
            setArtists(res?.data?.artists);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false); // Stop loading when data is fetched
        }
    };

    const renderSkeletons = () => {
        return Array(5).fill("").map((_, index) => (
            <Box
                key={index}
                bg={"gray.800"}
                borderRadius={"md"}
                shadow={"md"}
                p={2}
                textAlign={"center"}
                minW={"160px"}
                flexShrink={0}
                borderWidth={'1px'}
                borderColor={'gray.700'}
            >
                <SkeletonCircle size="100px" mx={"auto"} />
                <SkeletonText mt="4" noOfLines={1} />
            </Box>
        ));
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
            <Text fontSize={'2xl'} fontWeight={'bold'} mb={2}>Artists</Text>

            {isLoading ? (
                // Show skeleton loader when data is still loading
                <Flex direction={"row"} gap={4} minWidth={"fit-content"} justifyContent={'space-around'}>
                    {renderSkeletons()}
                </Flex>
            ) : artists?.length > 0 ? (
                <Flex
                    direction={"row"}
                    gap={4}
                    minWidth={"fit-content"}
                    justifyContent={'space-around'}
                >
                    {artists?.slice(0, 5).map((artist) => (
                        <Box
                            key={artist._id}
                            bg={"gray.800"}
                            borderRadius={"md"}
                            borderWidth={'1px'}
                            borderColor={'gray.700'}
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
                                src={artist?.avatar}
                                alt={artist?.name}
                                name={artist?.name}
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
                                {artist?.name}
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
