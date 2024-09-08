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
	};
	const isPlaylistAvailable = useSelector(state=> state.auth.userData?.playlists) || []

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
				<Flex gap={4} alignItems="flex-end">
					<FormControl isInvalid={errors.playlistName} flex="1">
						<FormLabel></FormLabel>
						<Input
							type="email"
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
						bg={"seagreen"}
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

			{ isPlaylistAvailable && isPlaylistAvailable.length > 0 ? <Box py={2}
				my={5} 
				bg={'gray.900'}
				border={'1px solid'}
				borderColor={'gray.600'}

			>
				hi hter
			</Box>
			: null}
		</Box>
	);
};

export default AddToPlaylistForm;
