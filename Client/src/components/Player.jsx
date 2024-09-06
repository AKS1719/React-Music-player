import React from "react";
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
    Spacer,
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

const Player = ({imgUrl, song, playlist}) => {
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
            <Flex mt={2} justifyContent={"space-between"} px={3}>
                {/* Album Cover */}
                <Box display={'flex'}>
                    <Image
                        src={imgUrl}
                        alt={song?.songName || "Unknown"}
                        boxSize="50px"
                        borderRadius="md"
                    />

                    {/* Song Details */}
                    <Box ml={4}>
                        <Text
                            fontWeight="bold"
                            color="white"
                        >
                            {song?.songName || "Unknown"}
                        </Text>
                        <Text
                            fontSize="sm"
                            color="gray.400"
              >
                        {song?.artist || "Unknown"}
                        </Text>
                    </Box>
                </Box>

                {/* Player Controls */}
                <Flex align="center">
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
                        aria-label="Play"
                        icon={<FiPlay />}
                        variant="solid"
                        colorScheme="orange"
                        borderRadius="full"
                        size="lg"
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

                {/* Volume Control */}
                <Flex
                    align="center"
                    ml={4}
                >
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
                        defaultValue={30}
                        w="100px"
                        ml={2}
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
