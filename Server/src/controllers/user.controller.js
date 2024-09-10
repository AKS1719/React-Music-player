import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {accessTokenOptions, refreshTokenOptions} from "../constants.js"
import { Playlist } from "../models/playlists.models.js";
import { RecentlyPlayed } from "../models/recentlyPlayed.models.js"
import {Song} from "../models/songs.models.js"
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        // console.log("functoin",acessToken)
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating access and refresh token" + error
        );
    }
};


const registerUser = asyncHandler(async (req, res) => {
    const { email, username, name, phoneNumber, password } = req.body;
    if (!email || !username || !password || !phoneNumber || !name) {
        throw new ApiError(404, "Missing Credentials");
    }
    const emailExist = await User.findOne({ email });
    if (emailExist) {
        throw new ApiError(403, "Email already registered with other user");
    }
    const usernameExist = await User.findOne({ username });
    if (usernameExist) {
        throw new ApiError(403, "Username already registered with other user");
    }
    const userExist = await User.findOne({ phoneNumber });
    if (userExist) {
        throw new ApiError(
            403,
            "Phone Number already registered with other user"
        );
    }
    const user = await User.create({
        name,
        email,
        password,
        phoneNumber,
        username,
    });
    if (!user) {
        throw new ApiError(500, "Error occured while Registering user user");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    const finalUser = await User.findById(user._id)
        .select("-password -refreshToken")

    return res
        .status(200)
        .cookie("accessToken", accessToken, accessTokenOptions)
        .cookie("refreshToken", refreshToken, refreshTokenOptions)
        .json(new ApiResponse(200, finalUser, "User creation Success"));
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError(404, "Missing Credentials");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User not Found");
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    
    if (!isPasswordValid) {
        throw new ApiError(403, "Invalid credentials");
    }
    let finalUser = await User.findById(user._id)
        .select("-password -refreshToken")
    
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    return res
        .status(201)
        .cookie("accessToken", accessToken, accessTokenOptions)
        .cookie("refreshToken", refreshToken, refreshTokenOptions)
        .json(new ApiResponse(201, finalUser, "User Login Success"));
});


const registerWithGoogle = asyncHandler(async(req,res)=>{

    const {name, email, emailVerified, avatar, phoneNumber, username, password} = req.body;

    if (!email || !username || !password || !phoneNumber || !name || !password) {
        throw new ApiError(404, "Missing Credentials");
    }
    const emailExist = await User.findOne({ email });
    if (emailExist) {
        throw new ApiError(403, "Email already registered with other user");
    }
    const usernameExist = await User.findOne({ username });
    if (usernameExist) {
        throw new ApiError(403, "Username already registered with other user");
    }
    const userExist = await User.findOne({ phoneNumber });
    if (userExist) {
        throw new ApiError(
            403,
            "Phone Number already registered with other user"
        );
    }
    const user = await User.create({
        name,
        email,
        password,
        phoneNumber,
        username,
        avatar,
        isEmailVerified:emailVerified

    });
    if (!user) {
        throw new ApiError(500, "Error occured while Registering user user");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    const finalUser = await User.findById(user._id)
        .select("-password -refreshToken")

    return res
        .status(200)
        .cookie("accessToken", accessToken, accessTokenOptions)
        .cookie("refreshToken", refreshToken, refreshTokenOptions)
        .json(new ApiResponse(200, finalUser, "User creation Success"));


})

const loginWithGoogle = asyncHandler(async(req,res)=>{

    const {email} = req.body;
    console.log(email)

    const user = await User.findOne({email});

    if(!user){
        throw new ApiError(404, "User not found")
    }

    let finalUser = await User.findById(user._id)
        .select("-password -refreshToken")
    
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    return res
        .status(201)
        .cookie("accessToken", accessToken, accessTokenOptions)
        .cookie("refreshToken", refreshToken, refreshTokenOptions)
        .json(new ApiResponse(201, finalUser, "User Login Success"));


})


const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        {
            new: true,
        }
    );

    return res
        .status(202)
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json(new ApiResponse(202, {}, "User logged out"));
});

const changeUserPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.data;
    if (!oldPassword || !newPassword || !confirmPassword) {
        throw new ApiError(404, "Missing Credentials");
    }
    if (newPassword !== confirmPassword) {
        throw new ApiError(406, "password didn't matched");
    }
    const user = await User.findById(req.user._id);
    const isCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isCorrect) {
        throw new ApiError(401, "Password Incorrect");
    }
    user.password = newPassword;
    user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(201, {}, "Password updated"));
});

// TODO : check all populate once again 
const getCurrentUser = asyncHandler(async (req, res) => {
    let user = await User.findById(req.user._id)
        .select('-password -refreshToken')
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    let finalUser = await User.findById(user._id)
        .select("-password -refreshToken")
        .populate({
            path: 'playlists', // Populate the 'playlists' field
            select: 'playlistName' // Select the playlistName field from Playlist model
        });

    return res
        .status(200)
        .json(
        new ApiResponse(200,finalUser,"Success")
    )
});

const getUserByusername = asyncHandler(async (req, res) => {
    const { username } = req.params;
    if (!username) {
        throw new ApiError(404, "Missing Credentials");
    }
    const user = await User.findOne({ username: username }).select(
        "-password -refreshToken"
    );
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return res.status(200).json(new ApiResponse(201, user, "Users found"));
});


const updateAvatar = asyncHandler(async (req, res) => {
    const user = User.findById(req.user_id)
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    let avatar = user.avatar;
    if (!req.file) {
        throw new ApiError(404, "Avatar file not found")
    }

    const avatarBuffer = req.file.buffer.toString("base64")
    const uploadResponse = await uploadOnCloudinary(avatarBuffer)

    if (!uploadResponse?.secure_url) {
        throw new ApiError(404, "Error uploading avatar to cloudinary")
    }
    avatar = uploadResponse.secure_url

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                avatar,
            },
        },
        {
            new: true,
        }
    )
        .select("-password -refreshToken")
        .populate("playlists")
        .populate("favorites")
        .populate("recentlyPlayed")
        .sort({updatedAt:-1});

    if (!updatedUser) {
        throw new ApiError(500, "Error occurred while updating avatar")
    
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, "Avatar details updated"));
})

const getArtistList = asyncHandler(async (req, res) => {
    const artists = await User.find({
        isSinger: true
    })
    if (!Array.isArray(artists) ||  artists.length === 0) {
        throw new ApiError(404, "No artists found");
    }
    return res.status(200)
        .json(
        new ApiResponse(200, {artists},"Found artists")
    )
})

const addToFavorites = asyncHandler(async (req,res)=>{
    const {songId}  = req.body;
    console.log(req.body)
    console.log(songId)

    if(!songId){
        throw new ApiError(404, "Song not provided")
    }

    const user = await User.findById(req.user._id).select('-password -refreshToken');
    if(!user){
        throw new ApiError(404, "User not found");
    }
    await Song.findByIdAndUpdate(songId,
        {
            $inc:{
                likes:1
            }
        }
    )
    if(user.favorites.includes(songId)){
        throw new ApiError(403,"Already added to Favorites")
    }
    user.favorites.push(songId)
    user.save({validateBeforeSave:false})

    return res.status(200).json(
        new ApiResponse(200, user, "Successfully added to favorites")
    )
})

const deleteFromFavorites = asyncHandler(async (req, res) => {
    const { songId } = req.body;

    // Check if the songId is provided
    if (!songId) {
        throw new ApiError(400, "Song ID not provided");
    }

    // Find the user
    const user = await User.findById(req.user._id).select('-password -refreshToken');
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Check if the song is in the user's favorites
    if (!user.favorites.includes(songId)) {
        throw new ApiError(404, "Song not found in favorites");
    }

    // Remove the songId from the user's favorites
    user.favorites = user.favorites.filter(id => id.toString() !== songId);
    await user.save(); // Save with validation

    // Optionally, decrement the song's likes count
    await Song.findByIdAndUpdate(songId, {
        $inc: { likes: -1 }
    });

    return res.status(200).json(
        new ApiResponse(200, user, "Successfully removed from favorites")
    );
});

const getUserFav = asyncHandler(async (req, res) => {
    let user = await User.findById(req.user._id)
        .select('-password -refreshToken')
        .populate('favorites');  // Correctly populate the 'favorites' field with Song data

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const favorites = user.favorites;

    if (!favorites || favorites.length === 0) {
        throw new ApiError(404, "Nothing in Favorites");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, favorites, "Success"));
});


export default {
    registerUser,
    registerWithGoogle,
    loginUser,
    loginWithGoogle,
    logoutUser,
    changeUserPassword,
    getCurrentUser,
    getUserByusername,
    updateAvatar,
    getArtistList,
    addToFavorites,
    deleteFromFavorites,
    getUserFav
}