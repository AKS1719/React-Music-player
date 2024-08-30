import React from 'react'
import { Box } from '@chakra-ui/react';
const Player = () => {
  return (
    <Box
      h={'15%'}
          w={"full"}
          bg={"gray.800"}
          p={2}
          borderWidth={"1px"}
          borderStyle={"solid"}
      borderRadius={'10px'}
      borderColor={'gray.700'}
      color={'white'}
      >
          Player
      </Box>
  );
}

export default Player
