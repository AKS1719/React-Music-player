import React, { useEffect, useState } from "react";
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
	Flex,
} from "@chakra-ui/react";

import { CloseIcon } from "@chakra-ui/icons";

import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../Service/Firebase/firbase.js";

import { useDispatch } from "react-redux";
import { markLogin} from "../store/loginSlice.js";
import { markNotsigninIn } from "../store/signupSlice.js";
import conf from "../conf/conf.js";
import { login } from "../store/authSlice.js";

const Signup = () => {
	const dispatch = useDispatch();
	const {
		register: registerRegular,
		handleSubmit: handleSubmitRegular,
		formState: { errors: errorsRegular },
	} = useForm();
	
	const [error, seterror] = useState('')

	// Form hooks for Google sign-in form
	const {
		register: registerGoogle,
		handleSubmit: handleSubmitGoogle,
		formState: { errors: errorsGoogle },
	} = useForm();
	const [googleRecivedData, setGoogleRecivedData] = useState(null);
	const onSubmit = async (data) => {
		seterror("")
		try {
			const res = await fetch(`${conf.backendUrl}/users/register`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
				credentials: "include",
			});
			if (!res.ok) {
				const err = await res.json();
				console.log(err.message);
				throw new Error(err.message);
			}
			const respo = await res.json();
			if (respo && respo.data) {
				dispatch(login(respo.data));
				console.log("logged in succesully");
				dispatch(markNotsigninIn());
			}
		} catch (error) {
			seterror(error.message)
			console.error("Error during sign-up:", error);
		}
	};

	const onSubmit2 = async (data) => {
		seterror("")
		const meged = {...googleRecivedData, ...data}
		try {
			const res = await fetch(`${conf.backendUrl}/users/registerWithGoogle`,
				{
					method:"POST",
					headers:{
						"Content-Type":"application/json"
					},
					body:JSON.stringify(meged),
					credentials:'include'
				}
			)
			if(!res.ok){
				const err = await res.json()
				throw new Error(err.message)
			}
			const data = await res.json()
			dispatch(login(data.data))
			dispatch(markNotsigninIn());
		} catch (error) {
			seterror(error.message)
			console.log(error)
		}
	};

	const handleSignInWithGoogle = async () => {
		seterror("")
		try {
			const provider = new GoogleAuthProvider();
			const result = await signInWithPopup(auth, provider);

			setGoogleRecivedData({
				name: result.user.displayName,
				email: result.user.email,
				emailVerified: result.user.emailVerified,
				avatar: result.user.photoURL,
				phoneNumber: result.user.phoneNumber,
			});
		} catch (error) {
			seterror(error.message)
			console.log(error);
		}
	};

	useEffect(() => {
		console.log(googleRecivedData);
	}, [googleRecivedData]);


	return (
		<Box
			w="100%"
			maxW="100%"
			px={10}
			py={{ base: 5, md: 7 }}
			borderWidth="1px"
			borderRadius="lg"
			borderColor="gray.600"
			boxShadow="lg"
			bg="rgb(0,0,0,0.6)"
			css={{
				color: "white",
			}}
		>
			<Flex
				position="fixed"
				top="5%"
				right="5%"
				cursor="pointer"
				onClick={() => {
					dispatch(markNotsigninIn());
				}}
			>
				<CloseIcon style={{ color: "white" }} />
			</Flex>

			{
				error && 
				<Text color={'crimson'}>{error?.message || error}</Text>
			}
			{!googleRecivedData && (
				<>
					<Text
						mb={1}
						fontSize={{ base: "1.5rem", md: "2.3rem" }}
						fontWeight={"bold"}
					>
						Hello Pal ! <br /> Register Here
					</Text>
					<Text
						mb={1}
						fontSize={{ base: "0.87rem", md: "1.2rem" }}
					>
						Logging in first time ?
						<Button
							p={2}
							ml={1}
							onClick={() => {
								dispatch(markNotsigninIn());
								dispatch(markLogin());
							}}
						>
							Login Here
						</Button>{" "}
					</Text>
					<form onSubmit={handleSubmitRegular(onSubmit)}>
						<VStack spacing={{ base: "2", md: "2.5" }}>
							<FormControl isInvalid={errorsRegular.email}>
								<FormLabel>Email</FormLabel>
								<Input
									type="email"
									{...registerRegular("email", {
										required: "Email is required",
										validate: {
											matchPattern: (value) =>
												/^([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}$/.test(
													value
												) ||
												"Email Address Must be valid email address",
										},
									})}
									placeholder="Enter your email"
								/>
								<FormErrorMessage>
									{errorsRegular.email &&
										errorsRegular.email.message}
								</FormErrorMessage>
							</FormControl>
							<FormControl isInvalid={errorsRegular.password}>
								<FormLabel>Password</FormLabel>
								<Input
									type="password"
									{...registerRegular("password", {
										required: "Password is required",
										minLength: { value: 8, message: "Minimum 8 characters required" }

									})}
									placeholder="Enter your password"
								/>
								<FormErrorMessage>
									{errorsRegular.password &&
										errorsRegular.password.message}
								</FormErrorMessage>
							</FormControl>
							<FormControl isInvalid={errorsRegular.name}>
								<FormLabel>Full Name</FormLabel>
								<Input
									type="text"
									{...registerRegular("name", {
										required: "name is required",
									})}
									placeholder="Enter your Name"
								/>
								<FormErrorMessage>
									{errorsRegular.name &&
										errorsRegular.name.message}
								</FormErrorMessage>
							</FormControl>
							<FormControl isInvalid={errorsRegular.username}>
								<FormLabel>Username</FormLabel>
								<Input
									type="text"
									{...registerRegular("username", {
										required: "username is required",
									})}
									placeholder="Enter your Username"
								/>
								<FormErrorMessage>
									{errorsRegular.username &&
										errorsRegular.username.message}
								</FormErrorMessage>
							</FormControl>
							<FormControl isInvalid={errorsRegular.phoneNumber}>
								<FormLabel>Number</FormLabel>
								<Input
									type="tel"
									{...registerRegular("phoneNumber", {
										required: "Phone number is required",
										validate: {
											matchPattern: (value) =>
												/^(\+\d{1,3}[- ]?)?\d{10}$/.test(
													value
												) ||
												"Phone number must be 10 digits",
										},
									})}
									placeholder="Enter your Phone Number"
								/>
								<FormErrorMessage>
									{errorsRegular.phoneNumber &&
										errorsRegular.phoneNumber.message}
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
									style={{
										fontSize: "25px",
										marginRight: "5px",
									}}
								/>{" "}
								Sign in with Google
							</Button>
						</VStack>
					</form>
				</>
			)}

			{googleRecivedData && (
				<>
					<Text
						mb={1}
						fontSize={{ base: "1.5rem", md: "2.3rem" }}
						fontWeight={"bold"}
					>
						Welcome {googleRecivedData.name || "New User"}!
					</Text>
					<Text
						mb={1}
						fontSize={{ base: "0.87rem", md: "1.2rem" }}
					>
						Please complete your registration
					</Text>
					<form onSubmit={handleSubmitGoogle(onSubmit2)}>
						<VStack spacing={{ base: "2", md: "2.5" }}>
							{/* Email Field - Disabled as it's received from Google */}
							{!googleRecivedData.email && (
								<FormControl isInvalid={errorsGoogle.email}>
									<FormLabel>Email</FormLabel>
									<Input
										type="email"
										value={googleRecivedData.email}
										{...registerGoogle("email", {
											required: "Email is required",
											validate: {
												matchPattern: (value) =>
													/^([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}$/.test(
														value
													) ||
													"Email Address Must be valid email address",
											},
										})}
									/>
									<FormErrorMessage>
										{errorsGoogle &&
											errorsGoogle.username.message}
									</FormErrorMessage>
								</FormControl>
							)}

							{/* Username Field */}
							<FormControl isInvalid={errorsGoogle.username}>
								<FormLabel>Username</FormLabel>
								<Input
									type="text"
									{...registerGoogle("username", {
										required: "Username is required",
									})}
									placeholder="Enter your Username"
								/>
								<FormErrorMessage>
									{errorsGoogle.username &&
										errorsGoogle.username.message}
								</FormErrorMessage>
							</FormControl>

							{/* Name Field (only show if not provided by Google) */}
							{!googleRecivedData.name && (
								<FormControl isInvalid={errorsGoogle.name}>
									<FormLabel>Name</FormLabel>
									<Input
										type="text"
										{...registerGoogle("name", {
											required: "Name is required",
										})}
										placeholder="Enter your Name"
									/>
									<FormErrorMessage>
										{errorsGoogle.name &&
											errorsGoogle.name.message}
									</FormErrorMessage>
								</FormControl>
							)}

							{/* Phone Number Field */}
							{!googleRecivedData.phoneNumber && (
								<FormControl
									isInvalid={errorsGoogle.phoneNumber}
								>
									<FormLabel>Phone Number</FormLabel>
									<Input
										type="tel"
										{...registerGoogle("phoneNumber", {
											required:
												"Phone number is required",
											validate: {
												matchPattern: (value) =>
													/^(\+\d{1,3}[- ]?)?\d{10}$/.test(
														value
													) ||
													"Phone number must be 10 digits",
											},
										})}
										placeholder="Enter your Phone Number"
										// Correct the default value application for phoneNumber
										defaultValue={
											googleRecivedData?.phoneNumber || ""
										}
									/>
									<FormErrorMessage>
										{errorsGoogle.phoneNumber &&
											errorsGoogle.phoneNumber.message}
									</FormErrorMessage>
								</FormControl>
							)}

							<FormControl isInvalid={errorsGoogle.password}>
								<FormLabel>Password</FormLabel>
								<Input
									type="password"
									{...registerGoogle("password", {
										required: "Password is required",
										minLength: { value: 8, message: "Minimum 8 characters required" }

									})}
									placeholder="Set your password"
								/>
								<FormErrorMessage>
									{errorsGoogle.password &&
										errorsGoogle.password.message}
								</FormErrorMessage>
							</FormControl>

							{/* Submit Button */}
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
								Complete Registration
							</Button>
						</VStack>
					</form>
				</>
			)}
		</Box>
	);
};

export default Signup;
