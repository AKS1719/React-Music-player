import React, { useRef, useState, useEffect } from "react";
import {
	Box,
	IconButton,
	Slider,
	SliderTrack,
	SliderFilledTrack,
	SliderThumb,
	Text,
	Flex,
	Image,
	Drawer,
	DrawerBody,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	useDisclosure,
	useBreakpointValue,
	useToast,
} from "@chakra-ui/react";
import {
	FiPlay,
	FiPause,
	FiRewind,
	FiFastForward,
	FiRepeat,
	FiShuffle,
	FiHeart,
	FiPlus,
	FiVolume2,
} from "react-icons/fi";

import { AiFillHeart } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { gsap } from "gsap";
import { trimTolength } from "../conf/utils.js";
import { setVolume } from "../store/playerSlice.js";
import { FaVolumeMute } from "react-icons/fa";
import conf from "../conf/conf.js";
import { login } from "../store/authSlice.js";
import { markAddToPlaylistWithSong } from "../store/addToPlaylistSlice.js";
import AddToPlaylistForm from "./AddToPlaylistForm.jsx";

const Player = () => {
	const currSong = useSelector((state) => state.player.song);
	const audioRef = useRef(null);
	const [isPlaying, setIsPlaying] = useState(true);
	const [volume, setVolumeState] = useState(0.5);
	const [currentTime, setCurrentTime] = useState(0);
	const [isMute, setIsMute] = useState(false);
	const [duration, setDuration] = useState(0);
	const dispatch = useDispatch();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const isMobile = useBreakpointValue({ base: true, md: true, lg: false });
	const [addedToFave, setAddedToFave] = useState(false);
	const favorites = useSelector((state) => state.auth.userData?.favorites);
	const toast = useToast();
	const authStatus = useSelector((state) => state.auth.status);
	const playlist = useSelector((state) => state.player.playlist);
	const ShowAddToPlaylist = useSelector(
		(state) => state.addToPlaylist?.isAddToPlaylist
	);
	const [song, setSong] = useState({});
	const [allSongs, setAllSongs] = useState([]);

	const formatTime = (t) => {
		let mm = Math.floor(t / 60)
			.toString()
			.padStart(2, "0");
		let ss = Math.floor(t % 60)
			.toString()
			.padStart(2, "0");
		return `${mm}:${ss}`;
	};

	const togglePlayPause = (e) => {
		if (!song) {
			alert("Select a song to play");
			e.stopPropagation();
			return;
		}
		if (isPlaying) {
			audioRef.current.pause();
			stopAnimations();
		} else {
			audioRef.current.play();
			startAnimations();
		}
		setIsPlaying(!isPlaying);
		e.stopPropagation();
	};

	const handleTimeUpdate = () => {
		setCurrentTime(audioRef.current.currentTime);
	};

	const handleSeek = (value) => {
		audioRef.current.currentTime = value;
		setCurrentTime(value);
	};

	const handleVolumeChange = (value) => {
		setVolumeState(value / 100);
	};

	const handleLoadedMetadata = () => {
		setDuration(audioRef.current.duration);
	};

	const getImageUrl = (song) => {
		return (
			song?.songThumbnailUrl ||
			`https://via.placeholder.com/100.png?text=${encodeURIComponent(
				song?.songName || "Unknown"
			)}`
		);
	};

	const startAnimations = () => {
		gsap.to(".album-cover", {
			rotation: 360,
			repeat: -1,
			duration: 5,
			ease: "linear",
		});
	};

	const stopAnimations = () => {
		gsap.to(".album-cover", { rotation: 0, duration: 1 });
	};

	const handleLike = async () => {
		if (!song) {
			alert("Select one song to like !! ");
			return;
		}
		if (!addedToFave) {
			try {
				const response = await fetch(
					`${conf.backendUrl}/users/addToFav`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						credentials: "include",
						body: JSON.stringify({ songId: song._id }),
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
				setAddedToFave(true);
			} catch (error) {
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
						body: JSON.stringify({ songId: song._id }),
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
				setAddedToFave(false);
			} catch (error) {
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

	const handleAddToPlaylist = () => {
		if (!authStatus) {
			alert("Login to add a song");
			return;
		}
		if (!song) {
			alert("select a song to add to playlist");
			return;
		}

		dispatch(markAddToPlaylistWithSong(song));
	};

	const toggleMute = () => {
		if (audioRef.current) {
			if (isMute) {
				audioRef.current.volume = volume;
				setIsMute(false);
			} else {
				audioRef.current.volume = 0;
				setIsMute(true);
			}
		}
	};

	const handleNext = () => {
		if (Array.isArray(allSongs) && allSongs.length > 0) {
			let ind = allSongs.findIndex(function (aSong) {
				return song._id === aSong._id;
			});
			setSong(allSongs[(ind + 1) % allSongs.length]);
		} else {
			setSong(currSong);
		}
	};

	const handlePrev = ()=>{
		if (Array.isArray(allSongs) && allSongs.length > 0) {
			let ind = allSongs.findIndex(function (aSong) {
				return song._id === aSong._id;
			});
			if(ind == 0 ){
				ind = allSongs.length
			}
			setSong(allSongs[ind-1])
		} 
	}

	const fetchPlaylistSongs = async () => {
		try {
			const respo = await fetch(
				`${conf.backendUrl}/playlist/getAllSongs`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ playlistId: playlist }),
					credentials: "include",
				}
			);

			if (!respo.ok) {
				const err = await respo.json();
				throw new Error(err.message);
			}
			const list = await respo.json();
			setAllSongs(list.data.songs);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (currSong) {
			setSong(currSong);
			setIsPlaying(true);
			startAnimations();
		} else {
			setIsPlaying(false);
			stopAnimations();
		}
	}, [currSong]);

	useEffect(() => {
		if (Array.isArray(favorites) && favorites.length > 0 && song) {
			const exists = favorites.some((favSong) => favSong === song._id);
			setAddedToFave(exists);
		}
	}, [favorites, song]);

	useEffect(() => {
		if (playlist) {
			fetchPlaylistSongs();
		}
		else{
			setAllSongs([])
		}
	}, [playlist]);

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = volume;
			dispatch(setVolume({ volume }));
		}
	}, [volume, dispatch]);

	return (
		<>
			<audio
				ref={audioRef}
				src={song?.songUrl}
				onTimeUpdate={handleTimeUpdate}
				onLoadedMetadata={handleLoadedMetadata}
				autoPlay
				hidden
				loop
				onPlay={() => setIsPlaying(true)}
				onAbort={() => {
					setIsPlaying(false);
				}}
				onPause={() => {
					setIsPlaying(false);
				}}
				onEnded={() => {
					setIsPlaying(false);
				}}
			/>

			{ShowAddToPlaylist && (
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
						<AddToPlaylistForm />
					</Box>
				</>
			)}

			{!isMobile ? (
				<>
					<Box
						h={"100%"}
						w={"full"}
						bg={"gray.800"}
						p={2}
						borderWidth={"1px"}
						borderStyle={"solid"}
						borderTopRadius="20px"
						borderColor={"gray.700"}
						color={"white"}
					>
						<Flex
							mt={2}
							justifyContent={"space-between"}
							px={3}
						>
							{/* Album Cover */}
							<Box display={"flex"} w={'20%'}>
								<Image
									src={getImageUrl(song)}
									alt={song?.songName || "Unknown"}
									boxSize="50px"
									borderRadius="md"
									className="album-cover"
								/>

								{/* Song Details */}
								<Box ml={4}>
									<Text
										fontWeight="bold"
										color="white"
									>
										{trimTolength(
											song?.songName || "Unknown"
										)}
									</Text>
									<Text
										fontSize="sm"
										color="gray.400"
										title={song?.artist}
									>
										{trimTolength(
											song?.artist || "Unknown"
										)}
									</Text>
								</Box>
							</Box>

							{/* Player Controls */}
							<Flex
								align="center"
								className="controls"
							>
								<IconButton
									aria-label="Shuffle"
									icon={<FiShuffle />}
									variant="ghost"
									color="white"
									size="lg"
									_hover={{
										bg: "transparent",
									}}
									_focus={{
										bg: "transparent",
									}}
								/>
								<IconButton
									aria-label="Previous"
									icon={<FiRewind />}
									variant="ghost"
									color="white"
									size="lg"
									_hover={{
										bg: "transparent",
									}}
									_focus={{
										bg: "transparent",
									}}
									onClick={handlePrev}
								/>
								<IconButton
									aria-label={isPlaying ? "Pause" : "Play"}
									icon={isPlaying ? <FiPause /> : <FiPlay />}
									variant="solid"
									colorScheme="orange"
									borderRadius="full"
									size="lg"
									onClick={togglePlayPause}
								/>
								<IconButton
									aria-label="Next"
									icon={<FiFastForward />}
									variant="ghost"
									color="white"
									size="lg"
									_hover={{
										bg: "transparent",
									}}
									_focus={{
										bg: "transparent",
									}}
									onClick={handleNext}
								/>
								<IconButton
									aria-label="Repeat"
									icon={<FiRepeat />}
									variant="ghost"
									color="white"
									size="lg"
									_hover={{
										bg: "transparent",
									}}
									_focus={{
										bg: "transparent",
									}}
								/>
							</Flex>

							{/* Seek Bar */}
							<Flex
								alignItems={"center"}
								width="320px"
								justifyContent="space-between"
							>
								<Text minWidth="40px">
									{formatTime(currentTime)}
								</Text>
								<Slider
									aria-label="Seek"
									value={currentTime}
									min={0}
									max={duration}
									onChange={handleSeek}
									w="200px"
								>
									<SliderTrack bg="gray.600">
										<SliderFilledTrack bg="orange.400" />
									</SliderTrack>
									<SliderThumb boxSize={4} />
								</Slider>
								<Text minWidth="40px">
									{formatTime(duration)}
								</Text>
							</Flex>

							{/* Volume Control */}
							<Flex
								align="center"
								ml={4}
								className="volume-control"
							>
								<IconButton
									aria-label="Like"
									icon={
										addedToFave ? (
											<AiFillHeart />
										) : (
											<FiHeart />
										)
									}
									variant="ghost"
									color={addedToFave ? "red.300" : "white"}
									size="lg"
									onClick={handleLike}
									_hover={{
										bg: "transparent",
									}}
									_focus={{
										bg: "transparent",
									}}
								/>
								<IconButton
									aria-label="Add"
									icon={<FiPlus />}
									variant="ghost"
									color="white"
									size="lg"
									onClick={handleAddToPlaylist}
									_hover={{
										bg: "transparent",
									}}
									_focus={{
										bg: "transparent",
									}}
								/>
								<IconButton
									aria-label="Volume"
									icon={
										!isMute ? (
											<FiVolume2 />
										) : (
											<FaVolumeMute />
										)
									}
									variant="ghost"
									color="white"
									_hover={{
										bg: "transparent",
									}}
									_focus={{
										bg: "transparent",
									}}
									size="lg"
									onClick={toggleMute}
								/>
								<Slider
									aria-label="Volume"
									defaultValue={50}
									w="100px"
									ml={2}
									onChange={handleVolumeChange}
								>
									<SliderTrack bg="gray.600">
										<SliderFilledTrack bg="orange.400" />
									</SliderTrack>
									<SliderThumb boxSize={4} />
								</Slider>
							</Flex>
						</Flex>
					</Box>
				</>
			) : (
				<>
					<Box
						h={"15%"}
						w={"full"}
						bg={"gray.800"}
						p={2}
						borderWidth={"1px"}
						borderStyle={"solid"}
						borderTopRadius={"30px"}
						borderColor={"gray.700"}
						color={"white"}
						display={isMobile && !isOpen ? "flex" : "none"}
						alignItems="center"
						justifyContent="space-between"
						px={3}
						position="fixed"
						bottom={0}
						left={0}
						zIndex={1000}
						onClick={onOpen}
					>
						<Image
							src={getImageUrl(song)}
							alt={song?.songName || "Unknown"}
							boxSize="50px"
							borderRadius="md"
							className="album-cover"
						/>
						<Text
							fontWeight="bold"
							color="white"
						>
							{trimTolength(song?.songName || "Unknown")}
						</Text>
						<IconButton
							aria-label={isPlaying ? "Pause" : "Play"}
							icon={isPlaying ? <FiPause /> : <FiPlay />}
							variant="solid"
							colorScheme="orange"
							borderRadius="full"
							size="lg"
							onClick={togglePlayPause}
						/>
					</Box>

					<Drawer
						isOpen={isOpen}
						placement="bottom"
						onClose={onClose}
						size="md"
					>
						<DrawerOverlay />
						<DrawerContent
							w={"100%"}
							bg={"rgba(26, 32, 44, 0.5)"}
							backdropFilter={"blur(10px)"}
							borderTopRadius="20px"
							overflowY={"auto"}
						>
							<DrawerCloseButton color="teal.500" />
							<DrawerBody p={0}>
								<Box
									py={10}
									borderWidth={"1px"}
									borderStyle={"solid"}
									// borderRadius={"10px"}
									borderTopRadius={"20px"}
									borderColor={"gray.700"}
									color={"white"}
								>
									<Flex
										flexDirection={"column"}
										alignItems="center"
									>
										<Image
											src={getImageUrl(song)}
											alt={song?.songName || "Unknown"}
											boxSize={{ base: "40%", md: "20%" }}
											borderRadius="md"
										/>
										<Text
											fontWeight="bold"
											color="white"
											mt={4}
										>
											{trimTolength(
												song?.songName || "Unknown"
											)}
										</Text>
										<Text
											fontSize="sm"
											color="gray.400"
											title={song?.artist}
										>
											{trimTolength(
												song?.artist || "Unknown"
											)}
										</Text>

										<Flex
											mt={4}
											align="center"
											className="controls"
										>
											<IconButton
												aria-label="Shuffle"
												icon={<FiShuffle />}
												variant="ghost"
												color="white"
												size="lg"
												_hover={{
													bg: "transparent",
												}}
												_focus={{
													bg: "transparent",
												}}
											/>
											<IconButton
												aria-label="Previous"
												icon={<FiRewind />}
												variant="ghost"
												color="white"
												size="lg"
												_hover={{
													bg: "transparent",
												}}
												_focus={{
													bg: "transparent",
												}}
												onClick={handlePrev}
											/>
											<IconButton
												aria-label={
													isPlaying ? "Pause" : "Play"
												}
												icon={
													isPlaying ? (
														<FiPause />
													) : (
														<FiPlay />
													)
												}
												variant="solid"
												colorScheme="orange"
												borderRadius="full"
												size="lg"
												onClick={togglePlayPause}
											/>
											<IconButton
												aria-label="Next"
												icon={<FiFastForward />}
												variant="ghost"
												color="white"
												size="lg"
												_hover={{
													bg: "transparent",
												}}
												_focus={{
													bg: "transparent",
												}}
												onClick={handleNext}
											/>
											<IconButton
												aria-label="Repeat"
												icon={<FiRepeat />}
												variant="ghost"
												color="white"
												size="lg"
												_hover={{
													bg: "transparent",
												}}
												_focus={{
													bg: "transparent",
												}}
											/>
										</Flex>

										{/* Seek Bar */}
										<Flex
											mt={4}
											alignItems={"center"}
											width="100%"
											justifyContent="space-evenly"
										>
											<Text minWidth="40px">
												{formatTime(currentTime)}
											</Text>
											<Slider
												aria-label="Seek"
												value={currentTime}
												min={0}
												max={duration}
												onChange={handleSeek}
												w="50%"
											>
												<SliderTrack bg="gray.600">
													<SliderFilledTrack bg="orange.400" />
												</SliderTrack>
												<SliderThumb boxSize={4} />
											</Slider>
											<Text minWidth="40px">
												{formatTime(duration)}
											</Text>
										</Flex>
									</Flex>
									{/* Volume Control */}
									<Flex
										align="center"
										// ml={4}
										justify={"center"}
										className="volume-control"
										mt={4}
									>
										<IconButton
											aria-label="Like"
											icon={
												addedToFave ? (
													<AiFillHeart />
												) : (
													<FiHeart />
												)
											}
											variant="ghost"
											color={
												addedToFave
													? "red.300"
													: "white"
											}
											size="lg"
											_hover={{
												bg: "transparent",
											}}
											_focus={{
												bg: "transparent",
											}}
											onClick={handleLike}
										/>
										<IconButton
											aria-label="Add"
											icon={<FiPlus />}
											variant="ghost"
											color="white"
											size="lg"
											_hover={{
												bg: "transparent",
											}}
											_focus={{
												bg: "transparent",
											}}
											onClick={handleAddToPlaylist}
										/>
										<IconButton
											aria-label="Volume"
											icon={
												!isMute ? (
													<FiVolume2 />
												) : (
													<FaVolumeMute />
												)
											}
											variant="ghost"
											color="white"
											size="lg"
											_hover={{
												bg: "transparent",
											}}
											_focus={{
												bg: "transparent",
											}}
											onClick={toggleMute}
										/>
										<Slider
											aria-label="Volume"
											defaultValue={50}
											w="100px"
											ml={2}
											onChange={handleVolumeChange}
										>
											<SliderTrack bg="gray.600">
												<SliderFilledTrack bg="orange.400" />
											</SliderTrack>
											<SliderThumb boxSize={4} />
										</Slider>
									</Flex>
								</Box>
							</DrawerBody>
						</DrawerContent>
					</Drawer>
				</>
			)}
		</>
	);
};

export default Player;
