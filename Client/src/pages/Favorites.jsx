import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Header } from "../components";
import {
	Box,
	useBreakpointValue,
	VStack,
	Flex,
	SkeletonCircle,
	SkeletonText,
    Text,
    HStack,
    Avatar,
} from "@chakra-ui/react";
import conf from "../conf/conf";
import { getImageUrl, trimTolength } from "../conf/utils";

import { playSong } from "../store/playerSlice";
import { useDispatch } from "react-redux";

const Favorites = () => {
	const [favorites, setFavorites] = useState([])
	const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch()

	const isMobile = useBreakpointValue({ base: true, md: true, lg: false });


    const fetchAllFavorites = async()=>{
        setIsLoading(true)
        try {
            const respo = await fetch(`${conf.backendUrl}/users/getAllFav`,
                {
                    method:"GET",
                    credentials:"include"
                }
            )
            if(!respo.ok)
            {
                const err = await respo.json()
                throw new Error(err.message)
            }
    
            const {data}= await respo.json();
            // console.log(data)
            setFavorites(data)
        } catch (error) {
            console.log(error.message)
        }
        setIsLoading(false)

    }

    const userFav= useSelector((state)=> state.auth.userData?.favorites)
    // console.log(userFav)
    useEffect(()=>{
        if(userFav){
            fetchAllFavorites()
        }
    },[userFav])



	return Array.isArray(favorites) ? (
		<>
			<Header forPage={"Playlist"} />
			<Box
				as="section"
				color={"white"}
				h={"85%"}
				w={"100%"}
				p={{ base: 1, md: 4 }}
				overflowY={"auto"}
				overflowX={"hidden"}
				css={{
					"&::-webkit-scrollbar": {
						width: "7px",
						borderRadius: "10px",
					},
					"&::-webkit-scrollbar-thumb": {
						background: "#319795", // teal.500 equivalent
						borderRadius: "10px",
					},
					"&::-webkit-scrollbar-track": {
						background: "#ffffff",
						borderRadius: "10px",
					},
				}}
			>
				<VStack
					spacing={6}
					w="full"
					p={0}
				>
					{isLoading
						? [...Array(5)].map((_, index) => (
								<Flex
									key={index}
									w="full"
									bg="gray.800"
									borderRadius="md"
									p={4}
									boxShadow="lg"
									alignItems={"center"}
								>
									<SkeletonCircle size="12" />
									<Box
										flex="1"
										ml={"2"}
									>
										<SkeletonText
											noOfLines={2}
											spacing="4"
										/>
									</Box>
								</Flex>
						  ))
						: favorites?.map((song) => (
								<Flex
									key={song._id}
									w="full"
									bg="gray.800"
									borderRadius="md"
									border="1px solid"
									borderColor="gray.600"
									p={4}
									boxShadow="lg"
									transition="all 0.3s"
									_hover={{
										transform: "scale(1.01)",
										bg: "gray.700",
									}}
									cursor="pointer"
									onClick={() => {
										if (!authStatus) {
											alert(
												"Please login to listen to the songs"
											);
										} else {
											dispatch(playSong(song));
										}
									}}
									alignItems="center"
									justifyContent="space-between"
									flexDirection={{
										base: "column",
										md: "row",
									}}
								>
									<HStack
										spacing={4}
										alignItems="center"
										w="full"
									>
										<Avatar
											src={getImageUrl(song)}
											size={{ base: "md", md: "lg" }}
											borderRadius="full"
										/>

										<VStack
											align="start"
											spacing={1}
											w="full"
										>
											<Text
												fontSize={{
													base: "md",
													md: "lg",
												}}
												fontWeight="bold"
												color="teal.300"
												noOfLines={1}
												isTruncated
											>
												{isMobile
													? trimTolength(
															song.songName
													  )
													: song.songName}
											</Text>
											<Text
												fontSize={{
													base: "sm",
													md: "md",
												}}
												color="gray.400"
												noOfLines={1}
												isTruncated
											>
												{isMobile
													? trimTolength(song.artist)
													: song.artist}
											</Text>
											<Text
												fontSize={{
													base: "xs",
													md: "sm",
												}}
												color="gray.500"
												noOfLines={1}
												isTruncated
											>
												{isMobile
													? trimTolength(
															song.album ||
																"Unknown Album"
													  )
													: song.album ||
													  "Unknown Album"}
											</Text>
										</VStack>
									</HStack>

									<HStack
										spacing={4}
										alignItems="center"
										mt={{ base: 4, md: 0 }}
									>
										{/* <IconButton
                                        aria-label="Like"
                                        icon={checkInFavorites(song._id) ? <AiFillHeart /> : <FiHeart />}
                                        variant="ghost"
                                        color={checkInFavorites(song._id) ? 'red.300' : 'white'}
                                        size="lg"
                                        onClick={(e) => handleLike(e, song._id)}
                                        _hover={{ bg: "transparent" }}
                                        _focus={{ bg: "transparent" }}
                                    /> */}
									</HStack>
								</Flex>
						  ))}
				</VStack>
			</Box>
		</>
	) : (
		<Text>No songs added to favorites</Text>
	);
};

export default Favorites;
