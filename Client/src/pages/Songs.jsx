import React, { useEffect, useState } from "react";
import { Header, Player, Sidebar } from "../components";
import { Avatar, Box, Flex, HStack, Text, VStack, SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import conf from "../conf/conf";
import { useDispatch, useSelector } from "react-redux";
import { playSong } from "../store/playerSlice";

const Songs = () => {
	const [songs, setSongs] = useState([]);
	const [isLoading, setIsLoading] = useState(true); // Add loading state
	const authStatus = useSelector((state) => state.auth.status);
	const searchedSongs = useSelector((state) => state.search.searchData);
	const dispatch = useDispatch();

	useEffect(() => {
		fetchLatestSongs();
	}, []);

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
			setIsLoading(false); // Stop loading after fetching songs
		} catch (error) {
			console.log(error);
			setIsLoading(false); // Stop loading in case of error
		}
	};

	const getImageUrl = (song) => {
		if (song.songThumbnailUrl) {
			return song.songThumbnailUrl;
		}
		const placeholderImage = `https://via.placeholder.com/100.png?text=${encodeURIComponent(song.songName)}`;
		return placeholderImage;
	};

	const handleSongClick = () => {
		if (!authStatus) {
			alert("Please login to listen to the songs");
		}
	};

	return (
		<>
			<Header isSearchPage={true} forPage="songs" />
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
				<VStack spacing={6} w="full">
					{/* Show Skeleton Loader when loading */}
					{isLoading
						? [...Array(5)].map((_, index) => (
								<Flex
									key={index}
									w="full"
									bg="gray.800"
									borderRadius="md"
									p={4}
									boxShadow="lg"
								>
									<SkeletonCircle size="12" />
									<Box flex="1" ml={4}>
										<SkeletonText noOfLines={2} spacing="4" />
									</Box>
								</Flex>
						  ))
						: songs.map((song) => (
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
										transform: "scale(1.02)",
										bg: "gray.700",
									}}
									cursor="pointer"
									onClick={() => {
										if (!authStatus) {
											alert("Please login to listen to the songs");
										} else {
											dispatch(playSong(song));
										}
									}}
									alignItems="center"
									justifyContent="space-between"
								>
									{/* Left section with song image and details */}
									<HStack spacing={4} alignItems="center">
										{/* Song Image */}
										<Avatar src={getImageUrl(song)} size="lg" borderRadius="full" />

										{/* Song Details */}
										<VStack align="start" spacing={1}>
											<Text fontSize="lg" fontWeight="bold" color="teal.300" noOfLines={1}>
												{song.songName}
											</Text>
											<Text fontSize="sm" color="gray.400" noOfLines={1}>
												{song.artist}
											</Text>
											<Text fontSize="xs" color="gray.500">
												{song.album || "Unknown Album"}
											</Text>
										</VStack>
									</HStack>

									{/* Right section with additional actions */}
									<HStack spacing={4} alignItems="center">
										<Box>
											<Text fontSize="sm" color="gray.400">
												Duration: {song.duration || "3:30"}
											</Text>
										</Box>

										{/* Play Icon */}
										<Box
											as="button"
											bg="teal.500"
											p={2}
											borderRadius="full"
											_hover={{
												bg: "teal.400",
											}}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												width="24"
												height="24"
												color="white"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M14.752 11.168l-5.664-3.168A1 1 0 008 8.84v6.32a1 1 0 001.088.84l5.664-3.168a1 1 0 000-1.664z"
												/>
											</svg>
										</Box>
									</HStack>
								</Flex>
						  ))}
				</VStack>
			</Box>

			<Player />
		</>
	);
};

export default Songs;
