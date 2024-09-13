import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
	Box,
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Text,
	Flex,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { markNotAddToPlaylist } from "../store/addToPlaylistSlice";

import { MdLibraryAdd } from "react-icons/md";
import PlaylistComponent from "./PlaylistComponent";
import conf from "../conf/conf";
import {login} from "../store/authSlice.js"
const AddToPlaylistForm = () => {
	const dispatch = useDispatch();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const [error, seterror] = useState("");
	const onSubmit = async (data) => {
		seterror("");
		try {
			const respo = await fetch(`${conf.backendUrl}/playlist/createPlaylist`,
				{
					method:"POST",
					headers:{
						"Content-Type":"application/json"
					},
					credentials:'include',
					body:JSON.stringify(data)
				}
			)
			if(!respo.ok){
				const er = await respo.json()
				throw new Error(er.message)
			}

			const res = await respo.json()
			dispatch(login(res.data))
			
		} catch (error) {
			seterror(error.message)
		}
	};
	const isPlaylistAvailable = useSelector(state=> state.auth.userData?.playlists) || []

	const song = useSelector(state=> state.addToPlaylist.song)

	return (
		<Box
			w="100%"
			maxW="100%"
			p={10}
			borderWidth="1px"
			borderRadius="lg"
			borderColor="gray.600"
			boxShadow="lg"
			bg="rgba(0, 0, 0, 0.6)"
			color="white"
		>
			<Flex
				position="fixed"
				top="5%"
				right="10%"
				cursor="pointer"
				onClick={() => {
					dispatch(markNotAddToPlaylist());
				}}
			>
				<CloseIcon style={{ color: "white" }} />
			</Flex>
			{error && (
				<Text color={"crimson"}>
					{error.message} &nbsp;{" "}
					{error.message === "User not found" ? "Try Registering" : ""}
				</Text>
			)}
			<Text mb={3} fontSize={{ base: "1.5rem", md: "2.3rem" }} fontWeight={"bold"}>
				Add to playlist
			</Text>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Flex gap={4} flexDirection={{base:'column', md:'row',lg:'row'}} alignItems={{base:'center',md:'flex-end',lg:'flex-end'}} >
					<FormControl isInvalid={errors.playlistName} flex="1">
						<FormLabel></FormLabel>
						<Input
							type="text"
							{...register("playlistName", {
								required: "Playlist Name is Required",
							})}
							rounded={'20px'}
							placeholder="Playlist Name"
						/>
						<FormErrorMessage>
							{errors.playlistName && errors.playlistName.message}
						</FormErrorMessage>
					</FormControl>
					<Button
						type="submit"
						bg={"teal.500"}
						color={"black"}
						borderRadius={"20px"}
						width="auto"

						_hover={{
							bg: "lightseagreen",
							transform: "scale(1.03)",
						}}
						transition={"all 0.3s"}
					>
						Create
					</Button>
				</Flex>
			</form>
			<Box
					h="75%"
					mt={5}
					bg="gray.800"
					rounded="md"
					borderWidth="2px"
					borderColor="teal.400"
					textAlign="center"
					color="white"
                    maxH={'204px'}
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
			{
				Array.isArray(isPlaylistAvailable) && isPlaylistAvailable.length >0 ? 
				
					(
						 isPlaylistAvailable?.map((playlist)=>(
								<Box
                                    key={playlist?._id}
                                    p={"1%"}
                                    bg="gray.700"
                                    rounded="md"
                                    mb={"1%"}
                                    _hover={{
                                        bg: "gray.600",
                                        transform: "scale(1.03)",
                                    }}
                                    transition="all 0.2s ease-in-out"
                                    cursor="pointer"
                                >
                                    <PlaylistComponent
                                        playlistName={playlist?.playlistName}
										toAdd={song}
										playlistId ={playlist?._id}
                                    />
                                </Box>
						))
					)
				:
				
					null
				
			}
			
			</Box>
		</Box>
	);
};

export default AddToPlaylistForm;
