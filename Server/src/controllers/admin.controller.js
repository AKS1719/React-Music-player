import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Admin } from "../models/admin.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import { accessTokenOptions, refreshTokenOptions } from "../constants.js";
import { User } from "../models/user.models.js";

const generateTokens = async (adminId) => {
    try {
        const admin = await Admin.findById(adminId);
        const accessToken = admin.generateAccessToken();
        const refreshToken = admin.generateRefreshToken();

        admin.refreshToken = refreshToken;

        admin.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};

const registerAdmin = asyncHandler(async (req, res) => {
    console.log(req.body)
    const { username, password } = req.body;
    if (!username || !password) {
        throw new ApiError(404, "Missing Credentials");
    }
    const adminExist = await Admin.findOne({ username });
    if (adminExist) {
        throw new ApiError(403, "Admin already Exists");
    }
    const admin = await Admin.create({
        username,
        password,
    });

    if (!admin) {
        throw new ApiError(500, "Something went wrong while registering admin");
    }

    const finalAdmin = await Admin.findById(admin.id).select(
        "-password -refreshToken"
    );
    const { accessToken, refreshToken } = await generateTokens(admin._id);

    return res
        .status(201)
        .cookie("accessToken", accessToken, accessTokenOptions)
        .cookie("refreshToken", refreshToken, refreshTokenOptions)
        .json(new ApiResponse(201, finalAdmin, "Admin creation successful"));
});

const loginAdmin = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        throw new ApiError(404, "Missing Credentials");
    }
    const admin = await Admin.findOne({ username });
    if (!admin) {
        throw new ApiError(404, `${username} is not registered`);
    }
    const isMatch = await admin.validatePassword(password);
    if (!isMatch) {
        throw new ApiError(401, "Invalid credentials");
    }
    const finalAdmin = await Admin.findById(admin._id).select('-password -refreshToken');
    const { accessToken, refreshToken } = await generateTokens(admin._id);
    return res
        .status(200)
        .cookie("accessToken", accessToken, accessTokenOptions)
        .cookie("refreshToken", refreshToken, refreshTokenOptions)
        .json(new ApiResponse(200, finalAdmin, "Login Successful"));
});

const logoutAdmin = asyncHandler(async (req, res) => {
    const admin = await Admin.findByIdAndUpdate(req.admin._id, {
        $unset: {
            refreshToken: 1,
        },
    });
    if (!admin) {
        throw new ApiError(404, "Admin not found");
    }
    return res.status(200).json(new ApiResponse(200, {}, "Logout Successful"));
});

const getAdmin = asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.admin._id).select(
        "-password -refreshToken"
    );
    if (!admin) {
        throw new ApiError(404, "Admin not found");
    }
    return res.status(200).json(new ApiResponse(200, admin, "Admin details"));
});



export default {
    registerAdmin,
    loginAdmin,
    logoutAdmin,
    getAdmin,
}
