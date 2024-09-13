import { Playlist } from "../models/playlists.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { Song } from "../models/songs.models.js";

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

    const playlistExist = await Playlist.findOne(
        {
            $and:{
                playlistName,
                userId : user._id
            }

        }
    )

    if(playlistExist){
        throw new ApiError(403, "You already have a playlist with same name")
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

    const finalUser = await User.findById(user._id).select('-password -refreshToken')
    .populate('playlists','playlistName')

    return res
        .status(201)
        .json(new ApiResponse(201, finalUser, "Playlist created successfully"));
});
const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId, playlistName, songsId } = req.body;
    
    if (!playlistId || !songsId) {
        throw new ApiError(400, "Missing playlist ID or songs ID");
    }

    const user = await User.findById(req.user._id).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist does not exist");
    }

    if (playlistName) {
        playlist.playlistName = playlistName;
    }

    // Retrieve existing song IDs in the playlist
    const existingSongIds = playlist.songs.map(song => song.toString());

    // Filter out songs that are already in the playlist
    const newSongsId = songsId.filter(songId => !existingSongIds.includes(songId));

    if (newSongsId.length > 0) {
        // Add new songs to the playlist
        playlist.songs.push(...newSongsId);
    }

    playlist.userId = user._id;

    await playlist.save({ validateBeforeSave: false });

    // Populate the playlist with songs
    const finalPl = await Playlist.findById(playlistId).populate("songs");

    return res.status(200).json(new ApiResponse(200, finalPl, "Playlist updated successfully"));
});

const addToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, songId } = req.body;

    if (!playlistId || !songId) {
        throw new ApiError(404, "Missing playlist ID or song ID");
    }

    const user = await User.findById(req.user._id).select(
        "-password -refreshToken"
    );

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist does not exist");
    }

    // Check if the song is already in the playlist
    if (playlist.songs.includes(songId)) {
        throw new ApiError(400, "Song already in the playlist");
    }

    // Add the new song to the playlist if it's not already there
    playlist.songs.push(songId);

    // Save the updated playlist
    await playlist.save({ validateBeforeSave: false });

    // Fetch the updated playlist with populated song details
    const finalPl = await Playlist.findById(playlistId).populate("songs");

    return res
        .status(200)
        .json(new ApiResponse(200, finalPl, "Song added to playlist successfully"));
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


    const finalUser = await User.findById(user._id).select("-password -refreshToken").populate('playlists','playlistName');

    return res
        .status(203)
        .json(new ApiResponse(203, finalUser, "Playlist deleted successfully"));
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

const getAllSongsFromPlaylist = asyncHandler(async (req,res)=>{
    const {playlistId} = req.body;

    let playlist = await Playlist.findById(playlistId)
    

    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }

    playlist = await Song.populate(playlist,
        {
            path:"songs",
            select:"-duration"
        }
    )

    return res.status(200)
    .json(
        new ApiResponse(200, playlist, "success")
    )
})

export default {
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    getAllPlaylists,
    addToPlaylist,
    getAllSongsFromPlaylist
};
