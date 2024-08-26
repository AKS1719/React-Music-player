import { Box, Text } from "@chakra-ui/react";
import React from "react";

const PlaylistComponent = () => {
    return (
        <Box
            as="section"
            width={'90%'}
            rounded={'10px'}
            bg={'red'}
        >
            <Box
                as="header"
                bg={'gray.800'}
                p={2}
                roundedTopLeft={'10px'}
                roundedTopRight={'10px'}

            >
                Titile
            </Box>
        </Box>
    );
};

export default PlaylistComponent;
