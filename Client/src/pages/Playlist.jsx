import React from "react";
import Sidebar from "../components/Sidebar";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { Header, Player } from "../components";

const Playlist = () => {
	return (
		<>
			<Header />
			<Player />
		</>
	);
};

export default Playlist;
