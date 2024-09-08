import React, { useState, useEffect } from "react";
import {
	Box,
	Button,
	Flex,
	IconButton,
	Input,
	Text,
	Avatar,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	useDisclosure,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { CiSearch } from "react-icons/ci";
import conf from "../conf/conf";
import { searched } from "../store/searchSlice";
import { HamburgerIcon } from "@chakra-ui/icons";
import { openDrawer } from "../store/drawerOpen.js";
import {useNavigate} from "react-router-dom"

const Header = ({ isSearchPage, playlistName, artist, album, forPage }) => {
	const authStatus = useSelector((state) => state.auth.status);
	const [searchTerm, setSearchTerm] = useState("");
	const { isOpen, onOpen, onClose } = useDisclosure();
	const userData = useSelector((state) => state.auth.userData);
	const dispatch = useDispatch();
    const navigate = useNavigate();
	useEffect(() => {
		console.log("rerender ");
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (forPage && forPage === "songs") {
			try {
				const res = await fetch(
					`${conf.backendUrl}/songs/searchSongByName?searchTerm=${searchTerm}`,
					{
						credentials: "include",
					}
				);

				if (!res.ok) {
					const er = await res.json();
					throw new Error(er.message);
				}
				const response = await res.json();

				if (response && response.data) {
					dispatch(
						searched({
							forPage,
							searchData: [...response.data],
						})
					);
				}
			} catch (error) {
				console.log(error);
			}
		}
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
			as="header"
			h={"10%"}
			w={"100%"}
			bg={"gray.800"}
			p={"2%"}
			px={'4%'}
			color={"white"}
			borderWidth={"1px"}
			borderColor={"gray.700"}
			borderRadius={"12px"}
			display="flex"
			alignItems="center"
			justifyContent="space-between"
			boxShadow="lg"
		>
			<IconButton
				icon={<HamburgerIcon />}
				onClick={() => {
					dispatch(openDrawer());
				}}
				aria-label="Open menu"
				m={4}
				colorScheme="teal"
				display={{ base: "block",md:"block", lg: "none" }}
			/>
			{isSearchPage && (
				<Box width={{ md: "40%" }}>
					<form onSubmit={handleSubmit}>
						<Flex
							bg={"white"}
							borderRadius={"20px"}
						>
							<Input
								w={"100%"}
								bg={"white"}
								placeholder="Search"
								onChange={(e) => {
									setSearchTerm(e.target.value);
								}}
								color={"black"}
								_placeholder={{ color: "gray.500" }}
								borderRadius="20px"
								p={5}
								border={"0px"}
								_hover={{
									border: "0px",
									borderColor: "white",
								}}
								_focus={{
									boxShadow: "none",
									outline: "none",
								}}
								focusBorderColor="transparent" // To ensure no border color is applied
							/>

							<Button
								type="submit"
								bg={"blue.500"}
								color={"white"}
								_hover={{ bg: "blue.400" }}
								borderRadius="20px"
							>
								<CiSearch />
							</Button>
						</Flex>
					</form>
				</Box>
			)}

			{(playlistName || artist || album) && (
				<Box
					textAlign="right"
					flex="1"
					pr={"2%"}
					fontSize={"1.1vw"}
					lineHeight={"1.5"}
				>
					{playlistName && <Text>{playlistName}</Text>}
					{artist && <Text>{artist}</Text>}
					{album && <Text>{album}</Text>}
				</Box>
			)}

			{!authStatus && !isSearchPage && (
				<Text
					fontSize={"md"}
					textAlign="center"
					w={"100%"}
				>
					Login for a better music experience
				</Text>
			)}
			{authStatus && (
				<Menu>
					<MenuButton
						// as={IconButton}
						size="sm"
						// variant="outline"
						// colorScheme="teal"
						aria-label="User menu"
					>
						<Avatar
						ml={'2'}
							name={userData?.name}
							src={userData?.avatar}
							w={'40px'}
							h={'40px'}
						/>
					</MenuButton>
					<MenuList
						bg={"gray.700"}
						borderRadius={"20px"}
                        borderColor={'gray.600'}
                        p={2}
					>
						<MenuItem
							onClick={() => {navigate(`/profile/${userData?._id}`)}}
							bg={"transparent"}
                            w={'full'}
                            borderRadius={'10px'}
                            _hover={{
                                bg:'gray.600'
                            }}
						>
							Profile
						</MenuItem>
						<MenuItem
							onClick={handleLogout}
							bg={"transparent"}
						>
							Logout
						</MenuItem>
					</MenuList>
				</Menu>
			)}
		</Box>
	);
};

export default Header;
