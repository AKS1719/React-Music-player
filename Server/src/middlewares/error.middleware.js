import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const errorHandler = (err, req, res, next) => {
    // Log the error for debugging
    console.error(err);

    if (err.code === 11000 && err.keyPattern) {
        let field = Object.keys(err.keyPattern)[0]; // Get the field that caused the duplicate error

        // Prepare a custom error message
        let errorMessage;
        if (field === "username") {
            errorMessage = "Username already exists";
        } else if (field === "phoneNumber") {
            errorMessage = "Phone number already exists";
        } else if (field === "email") {
            errorMessage = "Email already exists";
        } else {
            errorMessage = "Duplicate key error";
        }
        res.send(err.code).json(
            new ApiResponse(
                err.code,
                {
                    sucess: false,
                    message: errorMessage,
                },
                errorMessage
            )
        );
    }

    // Check if the error is an instance of ApiError
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json(
            new ApiResponse(
                err.statusCode,
                {
                    success: err.success,
                    errors: err.errors,
                },
                err.message
            )
        );
    }

    // Handle other types of errors (e.g., basic JavaScript errors)
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: {
            name: err.name,
            message: err.message,
        },
    });
};

export default errorHandler;
