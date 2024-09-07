import React, { useState } from "react";
import {
	Avatar,
	Box,
	Text,
	Button,
	VStack,
	Divider,
	useToast,
	useBreakpointValue,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import LibraryComponent from "./LibraryComponent";
import { SlLogout } from "react-icons/sl";
import { NavLink } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import Login from "../components/Login";
import Signup from "../components/Signup.jsx";
import { markLogin, markNotLogin } from "../store/loginSlice.js";
import { markNotsigninIn, marksigningIn } from "../store/signupSlice.js";
import conf from "../conf/conf.js";
import { logout } from "../store/authSlice.js";
import { LuHome } from "react-icons/lu";
import { GiMusicalScore } from "react-icons/gi";

const Sidebar = () => {
	
	const authStatus = useSelector((state) => state.auth.status);
	const dispatch = useDispatch();
	const ShowLogin = useSelector((state) => state.loginPage.isLoginComponent);
	const ShowSingup = useSelector(
		(state) => state.signupPage.isSignInComponent
	);

	const toast = useToast();

	const handleLogin = async () => {
		dispatch(markNotsigninIn());
		dispatch(markLogin());
	};

	const handleSingup = async () => {
		dispatch(markNotLogin());
		dispatch(marksigningIn());
	};

	const handleLogout = async () => {
		try {
			const response = await fetch(`${conf.backendUrl}/users/logout`, {
				method: "POST",
				credentials: "include",
			});
			if (!response.ok) {
				const er = await response.json();
				throw new Error(er.message);
			}
			dispatch(logout());
			toast({
				title: "Logout Successful",
				description: "It's bad to see you go 🥹.",
				status: "success",
				duration: 5000,
				isClosable: true,
			});
		} catch (error) {
			console.log(error);
			toast({
				title: "Oops! Something Went wrong",
				description:
					"Due to some technical issue we are not able to log you out! SORRY for the trouble",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		}
	};

	return (
		<Box
			overflowY={"aut "}
			bg={"gray.900"}
			w={{base:'100%', md:'20%'}}
			height={"100%"}
			display={"flex"}
			alignItems={"center"}
			py={4}
			flexDirection={"column"}
		>
			{ShowLogin && (
				<>
					<Box
						position="fixed"
						top="0"
						left="0"
						width="100vw"
						height="100vh"
						bg="rgba(0, 0, 0, 0.5)"
						backdropFilter="blur(10px)"
						zIndex={98}
					/>
					<Box
						position="fixed"
						zIndex={99}
						top={"50%"}
						left={"50%"}
						transform={"translate(-50%,-50%)"}
					>
						<Login />
					</Box>
				</>
			)}
			{ShowSingup && (
				<>
					<Box
						position="fixed"
						top="0"
						left="0"
						width="100vw"
						height="100vh"
						bg="rgba(0, 0, 0, 0.5)"
						backdropFilter="blur(10px)"
						zIndex={98}
					/>
					<Box
						position="fixed"
						zIndex={99}
						top={"50%"}
						left={"50%"}
						transform={"translate(-50%,-50%)"}
					>
						<Signup />
					</Box>
				</>
			)}
			{!authStatus ? (
				<Box
					as="section"
					bg={"gray.800"}
					borderWidth={"2px"}
					borderColor={"gray.700"}
					w={"90%"} // Responsive width
					rounded={"4%"}
					p={"4%"}
					mb={"4%"}
					textAlign="center"
					h={"30%"}
				>
					<Text
						fontSize={["4vw", "2.5vw", "1.5vw"]} // Responsive font size
						fontWeight={"bold"}
						color={"white"}
						mb={"2%"}
					>
						Welcome!
					</Text>
					<VStack spacing={"3"}>
						<Button
							onClick={handleLogin}
							w="full"
							bgGradient="linear(to-r, teal.400, blue.500)"
							color="white"
							_hover={{
								bgGradient: "linear(to-r, teal.300, blue.400)",
							}}
						>
							Login
						</Button>
						<Button
							onClick={handleSingup}
							w="full"
							bgGradient="linear(to-r, orange.400, pink.500)"
							color="white"
							_hover={{
								bgGradient:
									"linear(to-r, orange.300, pink.400)",
							}}
						>
							Signup
						</Button>
					</VStack>
					<Divider
						my={"4%"}
						borderColor="gray.600"
					/>
					<Text
						fontSize={"2vh"}
						color={"gray.400"}
					>
						Join us to explore exclusive content!
					</Text>
				</Box>
			) : (
				<Box
					as="section"
					bg={"gray.800"}
					borderWidth={"2px"}
					borderColor={"gray.700"}
					w={"90%"} // Responsive width
					rounded={"4%"}
					p={"4%"}
					py={"8%"}
					mb={"4%"}
					textAlign="center"
					h={"30%"}
				>
					<Button
						as={NavLink}
						to={"/music-player"}
						w="full"
						bgGradient={"linear(to-r,blue.400,purple.500)"}
						// bgGradient="linear(to-r, red.400, pink.500)"
						color="white"
						_hover={{
							bgGradient: "linear(to-r, blue.300,purple.400)",
						}}
						mb={"2"}
					>
						<LuHome /> &nbsp; Home
					</Button>
					<Button
						as={NavLink}
						to={"/songs"}
						w="full"
						bgGradient={"linear(to-r,blue.400,purple.500)"}
						// bgGradient="linear(to-r, red.400, pink.500)"
						color="white"
						_hover={{
							bgGradient: "linear(to-r, blue.300,purple.400)",
						}}
						mb={"2"}
					>
						<GiMusicalScore /> &nbsp; Songs
					</Button>
					<Button
						as={NavLink}
						to={"/search"}
						w="full"
						bgGradient={"linear(to-r,blue.400,purple.500)"}
						// bgGradient="linear(to-r, red.400, pink.500)"
						color="white"
						_hover={{
							bgGradient: "linear(to-r, blue.300,purple.400)",
						}}
						mb={"2"}
					>
						<FiSearch /> &nbsp; Search
					</Button>
					<Button
					display={{base:'none', md:'flex'}}
						onClick={handleLogout}
						w="full"
						bgGradient="linear(to-r, red.400, pink.500)"
						color="white"
						_hover={{
							bgGradient: "linear(to-r, red.300, pink.400)",
						}}
					>
						<SlLogout /> &nbsp; Logout
					</Button>
				</Box>
			)}
			<LibraryComponent />
		</Box>
	);
};

export default Sidebar;
