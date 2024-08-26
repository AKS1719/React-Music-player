import { Box, Flex, Text, IconButton } from "@chakra-ui/react";
import React from "react";
import PlaylistComponent from "./PlaylistComponent";
import { IoLibrarySharp } from "react-icons/io5";
import { MdLibraryAdd } from "react-icons/md";

const LibraryComponent = () => {
    return (
        <Flex
            direction={"column"}
            rounded={"10px"}
            h={"full"}
            as="section"
            bg={"gray.800"}
            borderWidth={"1px"}
            borderStyle={"solid"}
            borderColor={"gray.700"}
            w={"90%"}
            p={4}
            mb={4}
            boxShadow="md"
            _hover={{ boxShadow: "lg" }}
        >
            <Box
                as="header"
                p={2}
                borderBottomWidth={"1px"}
                borderBottomColor={"gray.700"}
                mb={4}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
            >
                <Text
                    fontSize={"xl"}
                    fontWeight={"bold"}
                    color={"white"}
                    display={'flex'}
                    alignItems={'center'}
                >
                    <IoLibrarySharp /> &nbsp;Library
                </Text>
                <IconButton
                    aria-label="Add Playlist"
                    icon={<MdLibraryAdd />}
                    colorScheme="teal"
                    variant="outline"
                    _hover={{ bg: "teal.600", color: "white" }}
                />
            </Box>
            <PlaylistComponent />
        </Flex>
    );
};

export default LibraryComponent;
