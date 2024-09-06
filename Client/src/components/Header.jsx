import React, { useState } from "react";
import { Box, Button, Flex, HStack, Input, Text } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { CiSearch } from "react-icons/ci";
import conf from "../conf/conf";
import { searched } from "../store/searchSlice";
const Header = ({ isSearchPage, playlistName, artist, album, forPage }) => {
    const authStatus = useSelector((state) => state.auth.status);
    const [searchTerm, setsearchTerm] = useState("")


    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(forPage && forPage==="songs"){
            try {
                const res = await fetch(`${conf.backendUrl}/songs/searchSongByName?searchTerm=${searchTerm}`,
                    {
                        credentials:'include'
                    }
                )
                
                if(!res.ok){
                    const er = await res.json();
                    throw new Error(er.message)
                }
                const reponse = await res.json();

                if(reponse && reponse.data){
                    dispatch(searched({
                        forPage,
                        searchData:[...reponse.data]
                    }))
                }
                
            } catch (error) {
                console.log(error)
            }
        }
    }
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
            {isSearchPage && (
                <Box width={"40%"}>
                    <form onSubmit={handleSubmit}>
                        <Flex
                            bg={"white"}
                            borderRadius={"20px"}
                        >
                            <Input
                                w={"100%"}
                                bg={"white"}
                                placeholder="Search"
                                onChange={(e)=>{setsearchTerm(e.target.value)}}
                                color={"black"}
                                _placeholder={{ color: "gray.500" }}
                                borderRadius="20px"
                                p={5}
                                border={"0px"}
                                _hover={{
                                    border: "0px",
                                    borderColor: "white",
                                }}
                                _focus={{
                                    boxShadow: "none",
                                    outline: "none",
                                }}
                                focusBorderColor="transparent" // To ensure no border color is applied
                            />

                            <Button
                                type="submit"
                                bg={"blue.500"}
                                color={"white"}
                                _hover={{ bg: "blue.400" }}
                                borderRadius="20px"
                            >
                                <CiSearch />
                            </Button>
                        </Flex>
                    </form>
                </Box>
            )}

            {(playlistName || artist || album) && (
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
