import { Box, Text, Button } from "@chakra-ui/react";

function Banner() {
    return (
        <Box
            bg="green.500"
            borderRadius="lg"
            p={5}
            color="white"
            textAlign="center"
        >
            <Text fontSize="xl">Billie Eilish</Text>
            <Text fontSize="2xl">What Was I Made For?</Text>
            <Button
                mt={3}
                colorScheme="whiteAlpha"
            >
                Listen now
            </Button>
        </Box>
    );
}


export default Banner