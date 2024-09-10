import React, { useEffect, useState } from "react";
import { Header, Player, Sidebar } from "../components";
import {
	Avatar,
	Box,
	Flex,
	HStack,
	Text,
	VStack,
	SkeletonCircle,
	SkeletonText,
	IconButton,
	useBreakpoint,
	useToast,
	useBreakpointValue,
} from "@chakra-ui/react";
import conf from "../conf/conf";
import { useDispatch, useSelector } from "react-redux";
import { playSong } from "../store/playerSlice";
import { trimTolength } from "../conf/utils.js";
import { AiFillHeart } from "react-icons/ai";
import { FiHeart } from "react-icons/fi";
import { login } from "../store/authSlice.js";

const Songs = () => {
	const [songs, setSongs] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const authStatus = useSelector((state) => state.auth.status);
	const searchedSongs = useSelector((state) => state.search.searchData);
	const dispatch = useDispatch();
	const favorites = useSelector((state) => state.auth.favorites) || [];
	const isMobile = useBreakpointValue({ base: true, md: true, lg: false });
	const toast = useToast();

	useEffect(() => {
		fetchLatestSongs();
	}, []);

	useEffect(() => {}, [favorites]);

	const checkInFavorites = (songId) => {
		return Array.isArray(favorites) && favorites.includes(songId);
	};

	useEffect(() => {
		if (searchedSongs !== null) {
			setSongs(searchedSongs);
		}
	}, [searchedSongs]);

	const fetchLatestSongs = async () => {
		try {
			const response = await fetch(`${conf.backendUrl}/songs/getSongs`, {
				credentials: "include",
			});
			const res = await response.json();
			if (res.statusCode >= 400) {
				console.log(res);
				throw new Error(res.message);
			}
			setSongs(res.data);
			setIsLoading(false);
		} catch (error) {
			console.log(error);
			setIsLoading(false);
		}
	};

	const getImageUrl = (song) => {
		if (song.songThumbnailUrl) {
			return song.songThumbnailUrl;
		}
		const placeholderImage = `https://via.placeholder.com/100.png?text=${encodeURIComponent(
			song.songName
		)}`;
		return placeholderImage;
	};

	const handleSongClick = () => {
		if (!authStatus) {
			alert("Please login to listen to the songs");
		}
	};

	const handleLike = async (e, songId) => {
		e.stopPropagation();
		if (!checkInFavorites(songId)) {
			try {
				const response = await fetch(
					`${conf.backendUrl}/users/addToFav`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						credentials: "include",
						body: JSON.stringify({ songId }),
					}
				);

				if (!response.ok) {
					const err = await response.json();
					throw new Error(err.message);
				}

				const { data } = await response.json();
				dispatch(login(data));
				toast({
					title: "Success ✅",
					description: "Added to favorites",
					status: "success",
					duration: 5000,
					isClosable: true,
				});
			} catch (error) {
				console.error(error);
				toast({
					title: "OOPS Something went wrong ❌",
					description: "There was some problem with network",
					status: "error",
					duration: 5000,
					isClosable: true,
				});
			}
		} else {
			try {
				const response = await fetch(
					`${conf.backendUrl}/users/delFromFav`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						credentials: "include",
						body: JSON.stringify({ songId }),
					}
				);

				if (!response.ok) {
					const err = await response.json();
					throw new Error(err.message);
				}

				const { data } = await response.json();
				dispatch(login(data));
				toast({
					title: "Success ✅",
					description: "Removed from favorites",
					status: "success",
					duration: 5000,
					isClosable: true,
				});
			} catch (error) {
				console.error(error);
				toast({
					title: "OOPS Something went wrong ❌",
					description: "There was some problem with network",
					status: "error",
					duration: 5000,
					isClosable: true,
				});
			}
		}
	};

	return (
		<>
			<Header
				isSearchPage={true}
				forPage="songs"
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
							alignItems={'center'}
						>
							<SkeletonCircle size="12" />
							<Box flex="1" ml={'2'}>
								<SkeletonText
									noOfLines={2}
									spacing="4"
								/>
							</Box>
						</Flex>
						  ))
						: songs?.map((song) => (
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
											size={{ base: "md", md: "lg" }}
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
													: song.songName }
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
													? trimTolength(song.artist)
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
												{isMobile ? trimTolength(song.album || "Unknown Album") : song.album || "Unknown Album"}
											</Text>
										</VStack>
									</HStack>

									<HStack
										spacing={4}
										alignItems="center"
										mt={{ base: 4, md: 0 }}
									>
										{/* <IconButton
											aria-label="Like"
											icon={checkInFavorites(song._id) ? <AiFillHeart /> : <FiHeart />}
											variant="ghost"
											color={checkInFavorites(song._id) ? 'red.300' : 'white'}
											size="lg"
											onClick={(e) => handleLike(e, song._id)}
											_hover={{ bg: "transparent" }}
											_focus={{ bg: "transparent" }}
										/> */}
									</HStack>
								</Flex>
						  ))}
				</VStack>
			</Box>
		</>
	);
};

export default Songs;
