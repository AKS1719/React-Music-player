import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
	Box,
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	VStack,
	Text,
	Flex
} from "@chakra-ui/react";

import {CloseIcon} from "@chakra-ui/icons"



import { useDispatch } from "react-redux";

const CreatePlaylistForm = () => {
	const dispatch = useDispatch()
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const [error, seterror] = useState('')
	const onSubmit = async (data) => {
		seterror("")
		
	};



	return (
		<Box
			w="100%"
			maxW="100%"
			p={10}
			borderWidth="1px"
			borderRadius="lg"
			borderColor="gray.600"
			boxShadow="lg"
			bg="rgb(0,0,0,0.6)"
			css={{
				color: "white",
			}}
		>
			<Flex position='fixed' top='5%' right='10%' cursor='pointer' onClick={()=>{
				dispatch(markNotLogin())
			}}>
				<CloseIcon style={{color:'white'}}/>
			</Flex>
			{
				error && 
				<Text color={'crimson'}>{error.message} &nbsp; {error.message==="User not found"? "Try Registering" : ""} </Text>
			}
			<Text
				mb={3}
				fontSize={{base:"1.5rem",md:"2.3rem"}}
				fontWeight={"bold"}
			>
				Hello Again,<br/> Pal
			</Text>
			<Text
				mb={3}
				fontSize={{base:"0.87rem", md:"1.2rem"}}
			>
				Logging in first time ? 
				<Button
					p={2}
					ml={1}
					onClick={()=>{
						dispatch(markNotLogin())
						dispatch(marksigningIn())
					}}
				>
					Register here
				</Button>{" "}
			</Text>
			<form onSubmit={handleSubmit(onSubmit)}>
				<VStack spacing={4}>
					<FormControl isInvalid={errors.email}>
						<FormLabel>Email</FormLabel>
						<Input
							type="email"
							{...register("email", {
								required: "Email is required",
							})}
							placeholder="Enter your email"
						/>
						<FormErrorMessage>
							{errors.email && errors.email.message}
						</FormErrorMessage>
					</FormControl>
					<Button
						type="submit"
						bg={"seagreen"}
						color={"black"}
						borderRadius={"20px"}
						width="full"
						_hover={{
							bg: "lightseagreen",
							transform: "scale(1.03)",
						}}
						transition={"all 0.3s"}
					>
						Sign In
					</Button>
				</VStack>
			</form>
		</Box>
	);
};

export default CreatePlaylistForm;
