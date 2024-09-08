import mongoose, {Schema} from 'mongoose';


const songsSchema = new Schema(
    {
        songName: {
            type: "String",
            required: true,
            trim:true,
        },
        artist: {
            type: "String",
        },
        album: {
            type: "String",
            trim:true,
        },
        genre: {
            type: "String",
            required: true,
            trim: true,
        },
        likes: {
            type: "Number",
            default: 0,
        },
        duration: {
            type: "String",
            required: true,
            trim: true,
        },
        singerId: {
            type: Schema.Types.ObjectId,
            ref:"User"
        },
        songUrl: {
            type: "String",
            required: true,
            trim: true,
        },
        songThumbnailUrl: {
            type: String,
        }
    },{timestamps:true}
)


export const Song = mongoose.model('Song', songsSchema);