import { Playlist } from "../models/playlists.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { Song } from "../models/songs.models.js";
import { RecentlyPlayed } from "../models/recentlyPlayed.models.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const { playlistName } = req.body;

    if (!playlistName) {
        throw new ApiError(404, "Name of the playlist is required");
    }
    const user = await User.findById(req.user._id).select(
        "-password -refreshToken"
    );
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const playlist = await Playlist.create({
        playlistName,
        userId: user._id,
    });
    


    if (!playlist) {
        throw new ApiError(500, "Creation of playlist failed");
    }

    user.playlists.push(playlist)
    user.save({ validateBeforeSave: false });

    return res
        .status(201)
        .json(new ApiResponse(201, playlist, "Playlist created successfully"));
});
const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId, playlistName, songsId } = req.body;

    if (!playlistId || !songsId || !playlistName) {
        throw new ApiError(404, "Missing playlist ID or Name or songs missing");
    }

    const user = await User.findById(req.user._id).select(
        "-password -refreshToken"
    );

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not exist");
    }

    playlist.playlistName = playlistName;
    playlist.userId = user._id;
    playlist.songs = songsId;
    playlist.save({ validateBeforeSave: false });

    let finalPl = await Playlist.findById(playlistId)
        .populate("songs")
    
    return res
        .status(200)
        .json(new ApiResponse(200, finalPl, "Playlist updated successfully"));
});
const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.body;
    if (!playlistId) {
        throw new ApiError(404, "Missing playlist ID");
    }
    const user = await User.findById(req.user._id).select("-password -refreshToken")
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    if (user.playlists?.length === 0) {
        throw new ApiError(404, "No playlists found to delete");
    }
    user.playlists = user.playlists.filter((playlist) => playlist._id.toString() !== playlistId)

    user.save({ validateBeforeSave: false });
    const playlist = await Playlist.findByIdAndDelete(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }


    return res
        .status(203)
        .json(new ApiResponse(203, {}, "Playlist deleted successfully"));
});

// for specific user
const getAllPlaylists = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id).select(
        "-password -refreshToken"
    );
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const playlists = await Playlist.find({ userId: user._id }).populate(
        "songs"
    );
    if (!playlists || playlists.length === 0) {
        throw new ApiError(404, "No playlists found");
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, playlists, "Playlists fetched successfully")
        );
});

export default {
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    getAllPlaylists,
};
