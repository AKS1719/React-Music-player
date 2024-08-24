import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { Admin } from "../models/admin.models.js";

export const verifyAdminJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken;
    if (!token) {
        throw new ApiError(401, "Unauthorized Access");
    }
    const decodedToken = jwt.verify(token, process.env.ACESS_TOKEN_SECRET);

    const admin = await Admin.findById(decodedToken._id).select(
        "-password -refreshToken"
    );

    if (!admin) {
        throw new ApiError(401, "Invalid Access Token");
    }

    req.admin = admin;

    next();
});
