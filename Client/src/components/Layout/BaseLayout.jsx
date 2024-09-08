import {
	Flex,
	Drawer,
	DrawerBody,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	useDisclosure,
	IconButton,
	Box,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useBreakpointValue } from "@chakra-ui/react";
import { closeDrawer } from "../../store/drawerOpen";
import { useDispatch, useSelector } from "react-redux";
import MusicLoader from "../Loaders/MusicLoader";
import Player from "../Player";
import { Outlet } from "react-router-dom";
import PageTransition from "../PageTransition.jsx";

const BaseLayout = ({ children }) => {
	const { isOpen, onOpen, onClose } = useDisclosure(); // Manage the drawer state
	const isMobileOrTablet = useBreakpointValue({
		base: true,
		md: true,
		lg: false,
	}); // Show drawer for base and md sizes
	const dispatch = useDispatch();
	const drawerOpen = useSelector((state) => state.drawerOpen.isDrawerOpen); // Redux state for drawer

	const [isLoader, setIsLoader] = useState(true); // Start with true to simulate initial loading

	useEffect(() => {
		// Simulate content loading with a timeout (you can replace this with actual data fetching logic)
		const timer = setTimeout(() => {
			setIsLoader(false);
		}, 1000); // Loader will show for 1 second

		// Cleanup the timer if the component unmounts
		return () => clearTimeout(timer);
	}, []);

	return (
		<Flex
			w={"100vw"}
			height={"100vh"}
			bg={"gray.900"}
			flexDirection={"column"}
		>
			<Flex
				flex={1}
				direction="row"
			>
				{/* Sidebar for larger screens or Drawer for mobile/tablet */}
				{isMobileOrTablet ? (
					<Drawer
						isOpen={drawerOpen}
						placement="left"
						onClose={onClose}
					>
						<DrawerOverlay />
						<DrawerContent bg={"gray.900"}>
							<DrawerCloseButton
								color="teal.500"
								onClick={() => {
									dispatch(closeDrawer());
								}}
							/>
							<DrawerBody
								p={0}
								w={"100%"}
							>
								<Sidebar />
							</DrawerBody>
						</DrawerContent>
					</Drawer>
				) : (
					<Sidebar />
				)}

				{/* Main content area */}
				<Box
					flex={1}
					py={{ base: 2, md: 2, lg: 4 }}
					w={isMobileOrTablet ? "100%" : "78%"}
					h={"100vh"}
					overflowY="hidden"
          overflowX={'hidden'}
				>
					{/* Pass the correct width to PageTransition */}
					<PageTransition aksW={isMobileOrTablet ? "100%" : "98%"}>
						{isLoader ? <MusicLoader /> : <Outlet />}
					</PageTransition>
				</Box>
			</Flex>

			{/* Player at the bottom */}
			<Box
				position="fixed"
				bottom={0}
				w="100%"
				zIndex={10}
        h={'12%'}
			>
				<Player />
			</Box>
		</Flex>
	);
};

export default BaseLayout;
