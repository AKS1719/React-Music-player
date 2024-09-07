import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

const MusicLoader = () => {
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bg="gray.900"
      color="white"
    >
      <Box display="flex" alignItems="center" justifyContent="center">
        {/* Individual bars */}
        <Box className="bar" style={{ animationDelay: "0.1s" }} />
        <Box className="bar" style={{ animationDelay: "0.2s" }} />
        <Box className="bar" style={{ animationDelay: "0.3s" }} />
        <Box className="bar" style={{ animationDelay: "0.4s" }} />
        <Box className="bar" style={{ animationDelay: "0.5s" }} />
      </Box>
      <Text mt={4} fontSize="lg">
        Loading your tunes...
      </Text>

      {/* Add styling for the animation */}
      <style>{`
        .bar {
          width: 10px;
          height: 30px;
          background-color: #ffa500;
          margin: 0 5px;
          animation: bounce 1s infinite;
        }

        @keyframes bounce {
          0%, 100% {
            transform: scaleY(1);
          }
          50% {
            transform: scaleY(2);
          }
        }
      `}</style>
    </Flex>
  );
};

export default MusicLoader;
