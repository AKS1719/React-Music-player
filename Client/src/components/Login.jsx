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

import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../Service/Firebase/firbase.js";


import { useDispatch } from "react-redux";
import { markNotLogin} from "../store/loginSlice.js"
import { marksigningIn} from "../store/signupSlice.js"
import conf from "../conf/conf.js";
import {login} from "../store/authSlice.js"

const Login = () => {
	const dispatch = useDispatch()
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const [error, seterror] = useState('')
	const onSubmit = async (data) => {
		seterror("")
		console.log(data)
		try {
		    const res = await fetch(`${conf.backendUrl}/users/login`,
				{
					method:"POST",
					headers:{
						"Content-Type" : "application/json"
					},
					body:JSON.stringify(data),
					credentials:'include'
				}
			)
			if(!res.ok){
				const err = await res.json();
				throw new Error(err.message)
			}
			const respo = await res.json();
			if(respo && respo.data){
				dispatch(login(respo.data))
				console.log('logged in succesully')
				dispatch(markNotLogin())
			}
		} catch (error) {
			seterror(error)
		    console.error("Error during sign-up:", error);
		}
	};

	const handleSignInWithGoogle = async () => {
		seterror("")
		try {
			const provider = new GoogleAuthProvider();
			const result = await signInWithPopup(auth, provider);
			const data1 = {email:result.user.email}
			const response = await fetch(`${conf.backendUrl}/users/loginWithGoogle`,
                {
                    method :"POST",
                    headers:{
                        "Content-Type":"application/json",
                    },
                    body:JSON.stringify(data1),
					credentials:'include'
                }
            )
            if(!response.ok){
                const err = await response.json();
                throw new Error(err.message)
            }
            const data = await response.json();

            dispatch(login(data.data));
            dispatch(markNotLogin())
		} catch (error) {
			seterror(error)
			console.log(error);
		}
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
					<FormControl isInvalid={errors.password}>
						<FormLabel>Password</FormLabel>
						<Input
							type="password"
							{...register("password", {
								required: "Password is required",
							})}
							placeholder="Enter your password"
						/>
						<FormErrorMessage>
							{errors.password && errors.password.message}
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
					<Button
						width="full"
						borderRadius={"20px"}
						bg={"white"}
						onClick={handleSignInWithGoogle}
						color={"black"}
						_hover={{
							bg: "gray.200",
							transform: "scale(1.03)",
						}}
						transition={"all 0.3s"}
					>
						<FcGoogle
							style={{ fontSize: "25px", marginRight: "5px" }}
						/>{" "}
						Sign in with Google
					</Button>
				</VStack>
			</form>
		</Box>
	);
};

export default Login;
