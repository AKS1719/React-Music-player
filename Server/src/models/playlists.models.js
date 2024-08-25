import mongoose, {Schema} from 'mongoose'


const playlistsSchema = new Schema(
    {
        playlistName: {
            type: String,
            required: true,
            trim:true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref:"User"
        },
        songs: [
            {
                type: Schema.Types.ObjectId,
                ref:"Song"
            }
        ]
    },{timestamps:true}
)

export const Playlist = mongoose.model('Playlist', playlistsSchema)

