import { VStack, Text, Link } from "@chakra-ui/react";

function Sidebar() {
    return (
        <VStack
            align="start"
            p={5}
            bg="blackAlpha.900"
            color="whiteAlpha.800"
            height="100vh"
            spacing={5}
            w={'300px'}
        >
            <Text
                fontSize="xl"
                mt={10}
            >
                Playlists
            </Text>
            {
                
            }
        </VStack>
    );
}

export default Sidebar