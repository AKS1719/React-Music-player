import React from "react";
import Sidebar from "../components/Sidebar";
import { Box, Flex, Text } from "@chakra-ui/react";
import {useSelector} from 'react-redux'

const MusicPlayer = () => {


    return (
        <Flex
            w={"100vw"}
            height={"100vh"}
            flexDirection={'column'}

        >
            <Sidebar />
        </Flex>
    );
};

export default MusicPlayer;
