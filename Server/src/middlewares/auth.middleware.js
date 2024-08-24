import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.models.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken;
    if (!token) {
        throw new ApiError(401, "Unauthorized Access");
    }
    const decodedToken = jwt.verify(token, process.env.ACESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id).select(
        "-password -refreshToken"
    );

    if (!user) {
        throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;

    next();
});
