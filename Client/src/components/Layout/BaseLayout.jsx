import { Flex, Drawer, DrawerBody, DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure, IconButton, Box } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useBreakpointValue } from '@chakra-ui/react';
import { closeDrawer } from '../../store/drawerOpen';
import { useDispatch, useSelector } from 'react-redux';
import MusicLoader from '../Loaders/MusicLoader';

const BaseLayout = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();  // Manage the drawer state
  const isMobileOrTablet = useBreakpointValue({ base: true, md: true, lg: false });  // Show drawer for base and md sizes
  const dispatch = useDispatch();
  const drawerOpen = useSelector(state => state.drawerOpen.isDrawerOpen);  // Redux state for drawer

  const [isLoader, setIsLoader] = useState(true);  // Start with true to simulate initial loading

  useEffect(() => {
    // Simulate content loading with a timeout (you can replace this with actual data fetching logic)
    const timer = setTimeout(() => {
      setIsLoader(false);
    }, 1000);  // Loader will show for 2 seconds

    // Cleanup the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []);

  return (
    <Flex w={"100vw"} height={"100vh"} bg={'gray.900'}>
      {/* Sidebar for larger screens or Drawer for mobile/tablet */}
      {isMobileOrTablet ? (
        <>
          {/* Drawer */}
          <Drawer isOpen={drawerOpen} placement="left" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton color="teal.500" position="fixed" top="3%" right="18%" onClick={() => { dispatch(closeDrawer()) }} />
              <DrawerBody p={0} w={'100%'}>
                <Sidebar />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      ) : (
        <Sidebar />  
      )}

      {/* Main content area */}
      <Flex flexDirection={'column'} py={{ base: 2, md: 2, lg:4 }} w={isMobileOrTablet ? '100%' : '79%'} >
        {isLoader ? <MusicLoader /> : children}
      </Flex>
    </Flex>
  );
};

export default BaseLayout;
