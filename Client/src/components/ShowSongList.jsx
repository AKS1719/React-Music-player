import React, { useEffect, useState } from 'react';
import { Box, Image, Text, Flex, Spinner } from '@chakra-ui/react'; // Assuming you're using Chakra UI
import conf from '../conf/conf.js';

const ShowSongList = () => {
  const [randomSongs, setRandomSongs] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  const fetchRandomSongs = async () => {
    try {
      const response = await fetch(`${conf.backendUrl}/songs/getRandomSongs`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message);
      }
      const random = await response.json();
      setRandomSongs(random);
      setLoading(false); // Set loading to false after fetching
    } catch (error) {
      console.log(error);
      setLoading(false); // Set loading to false in case of an error
    }
  };

  useEffect(() => {
    fetchRandomSongs();
  }, []);

  return (
    <Box p={4}>
      {loading ? (
        <Flex justifyContent="center" alignItems="center">
          <Spinner size="lg" color="orange.400" />
        </Flex>
      ) : (
        randomSongs.length > 0 ? (
          randomSongs.map((song, index) => (
            <Flex
              key={index}
              align="center"
              p={4}
              mb={2}
              bg="gray.800"
              borderRadius="md"
              boxShadow="lg"
            >
              {/* Album Cover */}
              <Image
                src={song.albumCover || 'default-image-url.jpg'} // Use default image if not available
                alt={song.songName || 'Unknown'}
                boxSize="50px"
                borderRadius="md"
                mr={4}
              />
              {/* Song Details */}
              <Box>
                <Text fontWeight="bold" color="white">
                  {song.songName || 'Unknown'}
                </Text>
                <Text fontSize="sm" color="gray.400">
                  {song.artist || 'Unknown'}
                </Text>
              </Box>
            </Flex>
          ))
        ) : (
          <Text color="white" border={'2px solid'} borderColor={'gray.800'} p={4}>No songs found.</Text>
        )
      )}
    </Box>
  );
};

export default ShowSongList;
