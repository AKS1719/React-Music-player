import {
    HStack,
    IconButton,
    Box,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
} from "@chakra-ui/react";
import { FaPlay, FaPause, FaForward, FaBackward } from "react-icons/fa";

function Footer() {
    return (
        <HStack
            bg="blackAlpha.900"
            p={5}
            align="center"
            justify="space-between"
            color="white"
            width="100%"
        >
            <HStack spacing={3}>
                <IconButton
                    icon={<FaBackward />}
                    aria-label="Previous"
                />
                <IconButton
                    icon={<FaPlay />}
                    aria-label="Play"
                />
                <IconButton
                    icon={<FaForward />}
                    aria-label="Next"
                />
            </HStack>
            <Box flex="1">
                <Slider defaultValue={30}>
                    <SliderTrack bg="gray.700">
                        <SliderFilledTrack bg="white" />
                    </SliderTrack>
                    <SliderThumb boxSize={3} />
                </Slider>
            </Box>
        </HStack>
    );
}


export default Footer