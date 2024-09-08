import React, { useState, useEffect } from "react";
import {
	Box,
	Image,
	Text,
	Flex,
	Button,
	Avatar,
	Skeleton,
	SkeletonText,
	SkeletonCircle,
} from "@chakra-ui/react";
import conf from "../conf/conf.js";
import { trimTolength } from "../conf/utils.js";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaCirclePlay } from "react-icons/fa6";
import { playSong } from "../store/playerSlice.js";

const NewlyAddedSongs = () => {
	const [songs, setSongs] = useState([]);
	const [isLoading, setIsLoading] = useState(true); // Add loading state
	const navigate = useNavigate();
	const authStatus = useSelector((state) => state.auth.status);
	const dispatch = useDispatch();

	useEffect(() => {
		fetchLatestSongs();
	}, []);

	const fetchLatestSongs = async () => {
		try {
			const response = await fetch(
				`${conf.backendUrl}/songs/getSongList`,
				{
					credentials: "include",
				}
			);
			const res = await response.json();
			if (res.statusCode >= 400) {
				console.log(res);
				throw new Error(res.message);
			}
			setSongs(res.data);
			setIsLoading(false); // Stop loading when data is fetched
		} catch (error) {
			console.log(error);
			setIsLoading(false); // Stop loading even if there's an error
		}
	};

	// Function to get the image URL, either from the thumbnail or a generated placeholder
	const getImageUrl = (song) => {
		if (song.songThumbnailUrl) {
			return song.songThumbnailUrl;
		}
		const placeholderImage = `https://via.placeholder.com/100.png?text=${encodeURIComponent(
			song.songName
		)}`;
		return placeholderImage;
	};

	return (
		<Box
			h={"37%"}
			w={"full"}
			color={"white"}
			p={2}
			overflowY={"auto"}
			css={{
				"&::-webkit-scrollbar": {
					width: "5px",
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
			<Flex justifyContent={"space-between"}>
				<Text
					fontSize={"2xl"}
					fontWeight={"bold"}
					mb={2}
				>
					Songs
				</Text>
				<Text
					as={"button"}
					onClick={() => {
						navigate("/songs");
					}}
					display={"flex"}
					alignItems={"center"}
				>
					see more <MdOutlineKeyboardArrowDown />
				</Text>
			</Flex>

			{/* Show Skeleton Loader when loading */}
			{isLoading ? (
				<Flex
					direction={"row"}
					gap={4}
					justifyContent={"space-around"}
					overflowX={"auto"}
					css={{
						"&::-webkit-scrollbar": {
							width: "5px",
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
					{[...Array(5)].map((_, index) => (
						<Box
							key={index}
							bg={"gray.800"}
							borderRadius={"md"}
							borderWidth={"1px"}
							shadow={"md"}
							borderColor={"gray.700"}
							overflow={"hidden"}
							transition={"transform 0.2s"}
							textAlign={"center"}
							p={2}
							minW={"160px"}
							flexShrink={0}
						>
							<SkeletonCircle
								size={"100px"}
								mx={"auto"}
							/>
							<SkeletonText
								mt={2}
								noOfLines={2}
								spacing={4}
							/>
						</Box>
					))}
				</Flex>
			) : songs?.length > 0 ? (
				<Flex
					direction={"row"}
					gap={4}
					justifyContent={"space-around"}
					overflowX={"auto"}
					css={{
						"&::-webkit-scrollbar": {
							width: "5px",
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
					{songs?.slice(0, 5).map((song) => (
						<Box
							key={song._id}
							position={"relative"}
							bg={"gray.800"}
							borderRadius={"md"}
							borderWidth={"1px"}
							shadow={"md"}
							borderColor={"gray.700"}
							overflow={"hidden"}
							transition={"transform 0.2s"}
							onClick={() => {
								if (!authStatus) {
									alert(
										"Please login to listen to the songs"
									);
								} else {
									dispatch(playSong(song));
								}
							}}
							_hover={{
								cursor: "pointer",
								transform: "scale(1.05)", // Slightly scale the entire box on hover
								"& .play-icon": {
									opacity: 1,
									transform: "translate(-30%, -80%)",
								},
							}}
							textAlign={"center"}
							p={2}
							minW={"160px"}
							flexShrink={0}
						>
							<Avatar
								src={getImageUrl(song)}
								alt={song.songName}
								boxSize={"100px"}
								objectFit={"cover"}
								mx={"auto"}
							/>
							<Text
								mt={2}
								fontSize={"lg"}
								fontWeight={"bold"}
								noOfLines={1}
							>
								{trimTolength(song.songName, 15)}
							</Text>
							<Text
								fontSize={"sm"}
								color={"gray.300"}
								noOfLines={1}
							>
								{trimTolength(song.artist, 15) ||
									"Unknown Artist"}
							</Text>

							{/* Play Icon */}
							<Box
								className="play-icon" // Target this in the _hover above
								position={"absolute"}
								color={"teal.400"}
								fontSize={"6xl"}
								bg={"white"}
								borderRadius={"100%"}
								right={"0%"}
								bottom={"0%"}
								opacity={0} // Initially hidden
								transition="opacity 0.3s ease, transform 0.3s ease" // Smooth transition
							>
								<FaCirclePlay />
							</Box>
						</Box>
					))}
				</Flex>
			) : (
				<Text>No songs available</Text>
			)}
		</Box>
	);
};

export default NewlyAddedSongs;
