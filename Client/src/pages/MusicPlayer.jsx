import React from "react";
import Sidebar from "../components/Sidebar";
import { Box, Flex, Text } from "@chakra-ui/react";
import {useSelector} from 'react-redux'
import { ArtistsComponent, Header, NewlyAddedSongs, Player } from "../components";

const MusicPlayer = () => {


    return (
        <Flex
            w={"100vw"}
            height={"100vh"}

            bg={'gray.900'}

        >
            <Sidebar />
            <Flex flexDirection={'column'} py={5} w={'79%'}>
                <Header />
                <ArtistsComponent />
                <NewlyAddedSongs />
                <Player/>
            </Flex>
        </Flex>
    );
};

export default MusicPlayer;
