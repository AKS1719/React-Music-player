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
import { useSelector } from "react-redux";
import { gsap } from "gsap";
import { trimTolength } from "../conf/utlis";

const Player = ({ playlist }) => {
    const song = useSelector((state) => state.player.song);
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [volume, setVolume] = useState(0.5);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (song !== null) {
            setIsPlaying(true);
            startAnimations();  // Start animations when a song is loaded
        } else {
            setIsPlaying(false);
            stopAnimations();   // Stop animations when no song is loaded
        }
    }, [song]);

    const formatTime = (t) => {
        let mm = '00';
        let ss = '00';
        if (t > 60) {
            mm = Math.floor(t / 60);
            if (mm < 10) {
                mm = '0' + String(mm);
            }
        }
        ss = Math.floor(t % 60);
        if (ss < 10) {
            ss = '0' + String(ss);
        }
        return mm + ":" + ss;
    };

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
            stopAnimations();
        } else {
            audioRef.current.play();
            startAnimations();
        }
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
        setVolume(value / 100);
    };

    const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
    };

    const getImageUrl = (song) => {
        if (song?.songThumbnailUrl) {
            return song?.songThumbnailUrl;
        }
        const placeholderImage = `https://via.placeholder.com/100.png?text=${encodeURIComponent(song?.songName)}`;
        return placeholderImage;
    };

    // GSAP animation methods
    const startAnimations = () => {
        gsap.to(".album-cover", { rotation: 360, repeat: -1, duration: 5, ease: "linear" });
        // gsap.to(".controls", { y: 10, repeat: -1, yoyo: true, duration: 1, ease: "power1.inOut" });
        // gsap.to(".volume-control", { scale: 1.1, repeat: -1, yoyo: true, duration: 1, ease: "power1.inOut" });
    };

    const stopAnimations = () => {
        gsap.to(".album-cover", { rotation: 0, duration: 1 });
        // gsap.to(".controls", { y: 0, duration: 1 });
        // gsap.to(".volume-control", { scale: 1, duration: 1 });
    };

    return (
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

            <Flex mt={2} justifyContent={"space-between"} px={3}>
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
                        <Text fontWeight="bold" color="white">
                            {trimTolength(song?.songName || "Unknown")}
                        </Text>
                        <Text fontSize="sm" color="gray.400" title={song?.artist}>
                            {trimTolength(song?.artist || "Unknown")}
                        </Text>
                    </Box>
                </Box>

                {/* Player Controls */}
                <Flex align="center" className="controls">
                    <IconButton
                        aria-label="Shuffle"
                        icon={<FiShuffle />}
                        variant="ghost"
                        color="white"
                        size="lg"
                    />
                    <IconButton
                        aria-label="Previous"
                        icon={<FiRewind />}
                        variant="ghost"
                        color="white"
                        size="lg"
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
                    />
                    <IconButton
                        aria-label="Repeat"
                        icon={<FiRepeat />}
                        variant="ghost"
                        color="white"
                        size="lg"
                    />
                </Flex>

                {/* Seek Bar */}
                <Flex alignItems={"center"} width="320px" justifyContent="space-between">
                    <Text minWidth="40px">{formatTime(currentTime)}</Text>
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
                    <Text minWidth="40px">{formatTime(duration)}</Text>
                </Flex>

                {/* Volume Control */}
                <Flex align="center" ml={4} className="volume-control">
                    <IconButton
                        aria-label="Like"
                        icon={<FiHeart />}
                        variant="ghost"
                        color="white"
                        size="lg"
                    />
                    <IconButton
                        aria-label="Add"
                        icon={<FiPlus />}
                        variant="ghost"
                        color="white"
                        size="lg"
                    />
                    <IconButton
                        aria-label="Volume"
                        icon={<FiVolume2 />}
                        variant="ghost"
                        color="white"
                        size="lg"
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
    );
};

export default Player;
