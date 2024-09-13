import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import {
	Avatar,
	Box,
	Flex,
	HStack,
	SkeletonCircle,
	SkeletonText,
	Text,
	useBreakpointValue,
	VStack,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { Header, Player } from "../components";
import { useParams } from "react-router-dom";
import conf from "../conf/conf";
import { getImageUrl, trimTolength } from "../conf/utils";
import { playSong } from "../store/playerSlice";
import { showList, hideList } from "../store/showList.js";
import ShowSongList from "../components/ShowSongList";

const Playlist = () => {
	const { playlistId } = useParams();

	const [PlaylistData, setPlaylistData] = useState();
	const [pSongs, setPSongs] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const isMobile = useBreakpointValue({ base: true, md: true, lg: false });
	const dispatch = useDispatch();
	const toShow = useSelector((state) =>  state.showList.toShowSong);
	const fetchAllSongs = async () => {
		setIsLoading(true);
		try {
			const respo = await fetch(
				`${conf.backendUrl}/playlist/getAllSongs`,
				{
					credentials: "include",
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ playlistId }),
				}
			);
			if (!respo.ok) {
				const err = await respo.json();
				throw new Error(err.message);
			}
			const { data } = await respo.json();
			setPSongs(data.songs);
			setPlaylistData(data);
		} catch (error) {
			console.log(error.message);
		}
		setIsLoading(false);
	};

	useEffect(() => {
		if (playlistId) {
			fetchAllSongs();
		}
	}, [playlistId]);

	return (
		<>
			{
				toShow && (
					<>
						<Box
						position="fixed"
						top="0"
						left="0"
						width="100vw"
						height="100vh"
						bg="rgba(0, 0, 0, 0.5)"
						backdropFilter="blur(10px)"
						zIndex={98}
					/>
					<Box
						position="fixed"
						zIndex={99}
						top={"50%"}
						left={"50%"}
						transform={"translate(-50%,-50%)"}
					>
						<ShowSongList/>
					</Box>
					</>
				)
			}

			{PlaylistData ? (
				<>
					<Header
						forPage={"Playlist"}
						playlistName={PlaylistData?.playlistName}
					/>
					<Box
						as="section"
						color={"white"}
						h={"85%"}
						w={"100%"}
						p={{ base: 1, md: 4 }}
						overflowY={"auto"}
						overflowX={"hidden"}
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
						<VStack
							spacing={6}
							w="full"
							p={0}
						>
							{isLoading
								? [...Array(5)].map((_, index) => (
										<Flex
											key={index}
											w="full"
											bg="gray.800"
											borderRadius="md"
											p={4}
											boxShadow="lg"
											alignItems={"center"}
										>
											<SkeletonCircle size="12" />
											<Box
												flex="1"
												ml={"2"}
											>
												<SkeletonText
													noOfLines={2}
													spacing="4"
												/>
											</Box>
										</Flex>
								  ))
								: pSongs?.map((song) => (
										<Flex
											key={song._id}
											w="full"
											bg="gray.800"
											borderRadius="md"
											border="1px solid"
											borderColor="gray.600"
											p={4}
											boxShadow="lg"
											transition="all 0.3s"
											_hover={{
												transform: "scale(1.01)",
												bg: "gray.700",
											}}
											cursor="pointer"
											onClick={() => {
												if (!authStatus) {
													alert(
														"Please login to listen to the songs"
													);
												} else {
													dispatch(playSong(song));
												}
											}}
											alignItems="center"
											justifyContent="space-between"
											flexDirection={{
												base: "column",
												md: "row",
											}}
										>
											<HStack
												spacing={4}
												alignItems="center"
												w="full"
											>
												<Avatar
													src={getImageUrl(song)}
													size={{
														base: "md",
														md: "lg",
													}}
													borderRadius="full"
												/>

												<VStack
													align="start"
													spacing={1}
													w="full"
												>
													<Text
														fontSize={{
															base: "md",
															md: "lg",
														}}
														fontWeight="bold"
														color="teal.300"
														noOfLines={1}
														isTruncated
													>
														{isMobile
															? trimTolength(
																	song.songName
															  )
															: song.songName}
													</Text>
													<Text
														fontSize={{
															base: "sm",
															md: "md",
														}}
														color="gray.400"
														noOfLines={1}
														isTruncated
													>
														{isMobile
															? trimTolength(
																	song.artist
															  )
															: song.artist}
													</Text>
													<Text
														fontSize={{
															base: "xs",
															md: "sm",
														}}
														color="gray.500"
														noOfLines={1}
														isTruncated
													>
														{isMobile
															? trimTolength(
																	song.album ||
																		"Unknown Album"
															  )
															: song.album ||
															  "Unknown Album"}
													</Text>
												</VStack>
											</HStack>
										</Flex>
								  ))}
						</VStack>
					</Box>
				</>
			) : (
				<>
					<Text>Playlist Not Exists</Text>
				</>
			)}
		</>
	);
};

export default Playlist;
