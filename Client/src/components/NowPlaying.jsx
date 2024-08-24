import { VStack, HStack, Text, Image, Spacer } from "@chakra-ui/react";

function NowPlaying() {
    const tracks = [
        {
            name: "Cruel",
            artist: "Jackson Wang",
            duration: "03:28",
            imageUrl: "url-to-image",
        },
        {
            name: "Gum",
            artist: "Jessie",
            duration: "02:42",
            imageUrl: "url-to-image",
        },
        // Add more tracks...
    ];

    return (
        <VStack
            align="start"
            spacing={3}
        >
            <Text fontSize="2xl">Now Playing</Text>
            <VStack
                align="start"
                spacing={3}
            >
                {tracks.map((track) => (
                    <HStack
                        key={track.name}
                        spacing={3}
                    >
                        <Image
                            boxSize="40px"
                            src={track.imageUrl}
                            borderRadius="md"
                        />
                        <VStack align="start">
                            <Text>{track.name}</Text>
                            <Text fontSize="sm">{track.artist}</Text>
                        </VStack>
                        <Spacer />
                        <Text>{track.duration}</Text>
                    </HStack>
                ))}
            </VStack>
        </VStack>
    );
}
export default NowPlaying;