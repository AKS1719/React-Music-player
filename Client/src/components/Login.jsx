import React from "react";
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
} from "@chakra-ui/react";
import axios from "axios";

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post(
                "http://localhost:5000/api/users/register",
                data
            );
            alert(response.data.message);
        } catch (error) {
            console.error("Error during sign-up:", error.response.data.message);
        }
    };

    return (
        <Box
            w="100%"
            maxW="md"
            mx="auto"
            mt="6"
            p="6"
            borderWidth="1px"
            borderRadius="lg"
            borderColor="gray.300"
            boxShadow="lg"
            bg="white"
        >
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
                        colorScheme="blue"
                        type="submit"
                        width="full"
                    >
                        Sign Up / Sign In
                    </Button>
                </VStack>
            </form>
        </Box>
    );
};

export default Login;
