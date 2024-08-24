import { Flex, Input, Avatar, Spacer, Text } from "@chakra-ui/react";

function Header() {
    return (
        <Flex
            p={5}
            bg="blackAlpha.800"
            align="center"
        >
            <Input
                placeholder="Search"
                variant="filled"
                width="40%"
            />
            <Spacer />
            <Avatar
                name="Tasha E."
                src="profile-image-url"
            />
            <Text
                ml={3}
                color="white"
            >
                Tasha E.
            </Text>
        </Flex>
    );
}

export default Header;