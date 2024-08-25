import mongoose, {Schema} from 'mongoose';


const recentlyPlayedSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref:"User"
        },
        song: {
            type: Schema.Types.ObjectId,
            ref:"Song"
        }
    },{timestamps:true}
)


export const RecentlyPlayed = mongoose.model('RecentlyPlayed', recentlyPlayedSchema);