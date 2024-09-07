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
import { useSelector, useDispatch } from "react-redux";
import { gsap } from "gsap";
import { trimTolength } from "../conf/utlis";
import { setVolume } from "../store/playerSlice.js";
import { FaVolumeMute } from "react-icons/fa";
import conf from "../conf/conf.js"
import {login} from "../store/authSlice.js"

const Player = ({ playlist }) => {
	const song = useSelector((state) => state.player.song);
	const audioRef = useRef(null);
	const [isPlaying, setIsPlaying] = useState(true);
	const [volume, setVolumeState] = useState(0.5);
	const [currentTime, setCurrentTime] = useState(0);
	const [isMute, setIsMute] = useState(false)
	const [duration, setDuration] = useState(0);
	const dispatch = useDispatch();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const isMobile = useBreakpointValue({ base: true, md: false });

	const toast  = useToast()


	useEffect(() => {
		if (song !== null) {
			setIsPlaying(true);
			startAnimations(); // Start animations when a song is loaded
		} else {
			setIsPlaying(false);
			stopAnimations(); // Stop animations when no song is loaded
		}
	}, [song]);

	const formatTime = (t) => {
		let mm = "00";
		let ss = "00";
		if (t > 60) {
			mm = Math.floor(t / 60);
			if (mm < 10) {
				mm = "0" + String(mm);
			}
		}
		ss = Math.floor(t % 60);
		if (ss < 10) {
			ss = "0" + String(ss);
		}
		return mm + ":" + ss;
	};

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = volume;
			dispatch(setVolume({ volume }));
		}
	}, [volume]);

	const togglePlayPause = (e) => {
		if (song === null) {
			alert("Select a song to play");
			return;
		}
		if (isPlaying) {
			audioRef.current.pause();
			stopAnimations();
		} else {
			audioRef.current.play();
			startAnimations();
		}
		e.stopPropagation()
		setIsPlaying(!isPlaying);
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
		if (song?.songThumbnailUrl) {
			return song?.songThumbnailUrl;
		}
		const placeholderImage = `https://via.placeholder.com/100.png?text=${encodeURIComponent(
			song?.songName || "Unknown"
		)}`;
		return placeholderImage;
	};

	// GSAP animation methods
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

	const handleLike  = async()=>{
		if(song===null)
		{
			alert('Select one song to like !! ')
			return;
		}
		try {
			const data1 = {
				songId : song?._id
			}
			const respo = await fetch(`${conf.backendUrl}/users/addToFav`,
				{
					method : "POST",
					headers:{
						"Content-Type":"applicaton/json"
					},
					credentials:'include',
					body:JSON.stringify(data1)
				}
			)
	
			if(!respo.ok){
				const err = await respo.json()
				throw new Error(err.message)
			}
			const {data} = await respo.json()
			dispatch(login(data))
			toast({
				title : "Success ✅",
				description:"Added to favorites",
				status:"success",
				duration:5000,
				isClosable:true
			})

		} catch (error) {
			console.log(error)
		}

	}
	const handleAddToPlaylist = ()=>{
		
	}

	const toggleMute = () => {
		if (audioRef.current) {
			if (isMute) {
				audioRef.current.volume = volume;  // Restore previous volume
				setIsMute(false);
			} else {
				audioRef.current.volume = 0;  // Mute the audio
				setIsMute(true);
			}
		}
	};
	


	return (
		<>
			{!isMobile ? (
				<>
					<Box
						h={"15%"}
						w={"full"}
						bg={"gray.800"}
						p={2}
						borderWidth={"1px"}
						borderStyle={"solid"}
						borderRadius={"10px"}
						borderColor={"gray.700"}
						color={"white"}
					>
						<audio
							ref={audioRef}
							src={song?.songUrl}
							onTimeUpdate={handleTimeUpdate}
							onLoadedMetadata={handleLoadedMetadata}
							autoPlay
							hidden
						/>

						<Flex
							mt={2}
							justifyContent={"space-between"}
							px={3}
						>
							{/* Album Cover */}
							<Box display={"flex"}>
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
										bg:"transaprent"
									}}
									_focus={{
										bg:"transparent"
									}}
								/>
								<IconButton
									aria-label="Previous"
									icon={<FiRewind />}
									variant="ghost"
									color="white"
									size="lg"
									
									_hover={{
										bg:"transaprent"
									}}
									_focus={{
										bg:"transparent"
									}}
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
										bg:"transaprent"
									}}
									_focus={{
										bg:"transparent"
									}}
								/>
								<IconButton
									aria-label="Repeat"
									icon={<FiRepeat />}
									variant="ghost"
									color="white"
									size="lg"
									
									_hover={{
										bg:"transaprent"
									}}
									_focus={{
										bg:"transparent"
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
									icon={<FiHeart />}
									variant="ghost"
									color="white"
									size="lg"
									onClick={handleLike}
									
									_hover={{
										bg:"transaprent"
									}}
									_focus={{
										bg:"transparent"
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
										bg:"transaprent"
									}}
									_focus={{
										bg:"transparent"
									}}
								/>
								<IconButton
									aria-label="Volume"
									icon={!isMute ? <FiVolume2 /> : <FaVolumeMute /> }
									variant="ghost"
									color="white"
									_hover={{
										bg:"transaprent"
									}}
									_focus={{
										bg:"transparent"
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
						borderRadius={"20px"}
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
						size="lg"
                        >
						<DrawerOverlay />
						<DrawerContent w={'100%'}
                        
                        borderRadius="20px"
                        overflowY={'auto'}
                        >
							<DrawerCloseButton
								color="teal.500"
							/>
							<DrawerBody p={0} >
								<Box
									bg={"gray.800"}
									py={20}
									borderWidth={"1px"}
									borderStyle={"solid"}
									borderRadius={"10px"}
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
											boxSize="60%"
											borderRadius="md"
											className="album-cover"
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
													bg:"transaprent",
												}}
												_focus={{
													bg:"transparent",
												}}
											/>
											<IconButton
												aria-label="Previous"
												icon={<FiRewind />}
												variant="ghost"
												color="white"
												size="lg"
												_hover={{
													bg:"transaprent"
												}}
												_focus={{
													bg:"transparent"
												}}
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
													bg:"transaprent"
												}}
												_focus={{
													bg:"transparent"
												}}
											/>
											<IconButton
												aria-label="Repeat"
												icon={<FiRepeat />}
												variant="ghost"
												color="white"
												size="lg"
												_hover={{
													bg:"transaprent"
												}}
												_focus={{
													bg:"transparent"
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
										justify={'center'}
										className="volume-control"
										mt={4}
									>
										<IconButton
											aria-label="Like"
											icon={<FiHeart />}
											variant="ghost"
											color="white"
											size="lg"
											_hover={{
												bg:"transaprent"
											}}
											_focus={{
												bg:"transparent"
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
												bg:"transaprent"
											}}
											_focus={{
												bg:"transparent"
											}}
											onClick={handleAddToPlaylist}
										/>
										<IconButton
											aria-label="Volume"
											icon={!isMute ? <FiVolume2 /> : <FaVolumeMute/>}
											variant="ghost"
											color="white"
											size="lg"
											_hover={{
												bg:"transaprent"
											}}
											_focus={{
												bg:"transparent"
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

					<audio
						ref={audioRef}
						src={song?.songUrl}
						onTimeUpdate={handleTimeUpdate}
						onLoadedMetadata={handleLoadedMetadata}
						autoPlay
						hidden
					/>
				</>
			)}
		</>
	);
};

export default Player;
