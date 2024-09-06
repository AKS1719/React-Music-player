import React, { useEffect, useState } from "react";
import { Header, Player, Sidebar } from "../components";
import { Avatar, Box, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import conf from "../conf/conf";
import { useSelector } from "react-redux";

const Songs = () => {
    const [songs, setSongs] = useState([]);
    const authStatus = useSelector(state=>state.auth.status)
    const searchedSongs = useSelector(state=>state.search.searchData)

    
    useEffect(() => {
        fetchLatestSongs();
    }, []);

    useEffect(()=>{
        if(searchedSongs!== null){
            setSongs(searchedSongs)
        }
    },[searchedSongs])

    const fetchLatestSongs = async () => {
        try {
            const response = await fetch(
                `${conf.backendUrl}/songs/getSongs`,
                {
                    credentials: "include",
                }
            );
            const res = await response.json();
            if (res.statusCode >= 400) {
                console.log(res);
                throw new Error(res.message);
            }
            // console.log(res.data);
            setSongs(res.data);
        } catch (error) {
            console.log(error);
        }
    };

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

    const handleSongClick = () => {
        if (!authStatus) {
            alert("Please login to listen the songs")
        }
    }

    return (
        <Flex
            w={"100vw"}
            height={"100vh"}
            bg={"gray.900"}
        >
            <Sidebar />
            <Flex
                flexDirection={"column"}
                py={5}
                w={"79%"}
            >
                <Header
                    isSearchPage={true}
                    forPage="songs"
                />
                <Box
                    as="section"
                    color={"white"}
                    h={"74%"}
                    w={"100%"}
                    p={4}
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
                    <VStack spacing={4}>
                        {songs.map((song) => (
                            <Box
                                as="section"
                                border={"1px solid"}
                                borderColor={"gray.700"}
                                bg={"gray.800"}
                                w={"100%"}
                                p={4}
                                mx={'auto'}
                                borderRadius={'10px'}
                                key={song._id}
                                onClick={handleSongClick}
                            >
                                <HStack>
                                    <Avatar
                                        src={getImageUrl(song)}
                                        alt={song.songName}
                                    />
                                    <Text>{song.songName}</Text>
                                    <Text>{song.artist}</Text>
                                </HStack>
                            </Box>
                        ))}
                    </VStack>
                </Box>
                <Player />
            </Flex>
        </Flex>
    );
};

export default Songs;
