import React from "react";
import Sidebar from "../components/Sidebar";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import {
	ArtistsComponent,
	Header,
	NewlyAddedSongs,
	Player,
} from "../components";

const MusicPlayer = () => {
	return (
		<>
			<Header />
			<ArtistsComponent />
			<NewlyAddedSongs />
			<Player />
		</>
	);
};

export default MusicPlayer;
