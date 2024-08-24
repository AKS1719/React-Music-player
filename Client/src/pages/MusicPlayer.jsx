import { Flex, Box, VStack } from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Banner from "../components/Banner";
import Playlists from "../components/Playlists";
import NowPlaying from "../components/NowPlaying";
import Footer from "../components/Footer";

function MusicPlayerPage() {
    return (
        <Flex>
            <Sidebar />
            <Box
                flex="1"
                bg="blackAlpha.800"
                color="white"
            >
                <Header />
                <VStack
                    align="start"
                    p={5}
                    spacing={5}
                >
                    <Banner />
                    <Playlists />
                    <NowPlaying />
                </VStack>
                <Footer />
            </Box>
        </Flex>
    );
}

export default MusicPlayerPage;
