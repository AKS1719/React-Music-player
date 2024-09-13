import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { Song } from "../models/songs.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {Playlist} from "../models/playlists.models.js"

const addSong = asyncHandler(async (req, res) => {
	const { songName, genre } = req.body;
	// console.log(req.user)

	if (!songName) {
		throw new ApiError(404, "Song name not provided");
	}
	if (!genre) {
		throw new ApiError(404, "Genre not provided");
	}
	// console.log(req.files)
	if (!req.files?.thumbnail) {
		throw new ApiError(404, "Thumbnail not provided");
	}
	if (!req.files?.song) {
		throw new ApiError(404, "Song not found");
	}
	const thumbnailBuffer = req.files.thumbnail[0].buffer.toString("base64");
	const songBuffer = req.files.song[0].buffer.toString("base64");

	const thumbnailResponse = await uploadOnCloudinary(
		thumbnailBuffer,
		`thumbnails/${songName}`
	);
	if (!thumbnailResponse?.secure_url) {
		throw new ApiError(404, "Error uploading thumbnail to cloudinary");
	}
	const songResponse = await uploadOnCloudinary(
		songBuffer,
		`songs/${songName}`
	);
	if (!songResponse?.secure_url) {
		throw new ApiError(404, "Error uploading song to cloudinary");
	}

	const { duration } = songResponse;

	const user = await User.findById(req.user._id).select(
		"-password -refreshToken"
	);

	if (!user) {
		throw new ApiError(404, "User not found");
	}
	const song = await Song.create({
		songName,
		genre,
		duration,
		songThumbnailUrl: thumbnailResponse.secure_url,
		songUrl: songResponse.secure_url,
		singerId: user._id,
	});

	if (!song) {
		throw new ApiError(404, "Error creating song");
	}

	return res
		.status(200)
		.json(new ApiResponse(200, song, "Songs uploaded successfully"));
});

const uploadSongsBatch = asyncHandler(async (req, res) => {
	const { songs } = req.body;

	if (!songs || !Array.isArray(songs)) {
		throw new ApiError(404, "Songs not provided or not an array");
	}

	const createdSongs = [];

	for (const song of songs) {
		const { songName, artist, album, genre, duration, songUrl } = song;

		if (!songName) {
			console.warn(
				`Skipping song due to missing 'songName': ${JSON.stringify(
					song
				)}`
			);

			console.log("");
			console.log("");
			continue;
		}
		if (!genre) {
			console.warn(
				`Skipping song due to missing 'genre': ${JSON.stringify(song)}`
			);
			console.log("");
			console.log("");
			continue;
		}
		if (!songUrl) {
			console.warn(
				`Skipping song due to missing 'songUrl': ${JSON.stringify(
					song
				)}`
			);
			console.log("");
			console.log("");
			continue;
		}

		const newSong = await Song.create({
			songName,
			artist: artist || "Unknown Artist",
			album: album || "Unknown Album",
			genre,
			duration,
			songUrl,
		});

		createdSongs.push(newSong);
	}

	return res
		.status(200)
		.json(new ApiResponse(200, createdSongs, "Success created songs"));
});

const getSongsList = asyncHandler(async (req, res) => {
	const songs = await Song.find().sort({ createdAt: -1 }).limit(30);

	if (!Array.isArray(songs) || songs.length === 0) {
		throw new ApiError(404, "No Songs Found");
	}
	return res.status(200).json(new ApiResponse(200, songs, "Songs found"));
});

const getSongs = asyncHandler(async (req, res) => {
	const songs = await Song.find().sort({ createdAt: -1 }).limit(30);
	if (!Array.isArray(songs) || songs.length === 0) {
		throw new ApiError(404, "No songs Found");
	}
	return res.status(200).json(new ApiResponse(200, songs, "Songs found"));
});

const getSongsByName = asyncHandler(async (req, res) => {
    const { searchTerm } = req.query;
    const term = new RegExp(searchTerm, "i");

    // Find songs matching the search term
    let songs = await Song.find({
        $or: [{ songName: { $regex: term } }, { artist: { $regex: term } }],
    });

    // If no songs are found, fetch random songs
    if (!Array.isArray(songs) || songs.length === 0) {
        songs = await Song.aggregate([
            { $sample: { size: 30 } } // Select 10 random songs
        ]);
        
        // If still no songs are found, throw a not found error
        if (songs.length === 0) {
            throw new ApiError(404, "No songs available");
        }

        return res.status(200).json(new ApiResponse(200, songs, "No matching songs found, showing random songs"));
    }

    return res.status(200).json(new ApiResponse(200, songs, "Songs found"));
});

const getRandomSongs = asyncHandler(async(req,res)=>{
	const { playlistId } = req.body
	if (!playlistId) {
		throw new ApiError(400, "Playlist ID is required");
	  }
  
	  // Find the playlist
	  const playlist = await Playlist.findById(playlistId);
	  if (!playlist) {
		throw new ApiError(404, "Playlist not found");
	  }
  
	  // Get song IDs from the playlist
	  const playlistSongIds = playlist.songs;
  
	  // Find random songs excluding the ones in the playlist
	  const randomSongs = await Song.aggregate([
		{
		  $match: {
			_id: { $nin: playlistSongIds },
		  },
		},
		{
		  $sample: { size: 40 },
		},
	  ]);
  
	  res.status(200).json({
		success: true,
		songs: randomSongs,
	  });
})


export default {
	addSong,
	uploadSongsBatch,
	getSongsList,
	getSongs,
	getSongsByName,
	getRandomSongs
};
