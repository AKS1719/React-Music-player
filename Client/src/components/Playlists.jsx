import { Box, VStack, HStack, Text, Image } from "@chakra-ui/react";

function Playlists() {
    const playlists = [
        { name: "Dejavu", tracks: 30, imageUrl: "url-to-image" },
        { name: "Playlist of the day", tracks: 28, imageUrl: "url-to-image" },
        { name: "Something new", tracks: 37, imageUrl: "url-to-image" },
        { name: "Exclusive shows", tracks: 17, imageUrl: "url-to-image" },
    ];

    return (
        <VStack
            align="start"
            spacing={5}
        >
            <Text fontSize="2xl">Playlists for you</Text>
            <HStack spacing={5}>
                {playlists.map((playlist) => (
                    <Box
                        key={playlist.name}
                        width="150px"
                    >
                        <Image
                            src={playlist.imageUrl}
                            borderRadius="md"
                        />
                        <Text
                            mt={2}
                            fontSize="lg"
                        >
                            {playlist.name}
                        </Text>
                        <Text fontSize="sm">{playlist.tracks} tracks</Text>
                    </Box>
                ))}
            </HStack>
        </VStack>
    );
}

export default Playlists;