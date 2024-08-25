import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        phoneNumber: { type: String, required: true },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },
        avatar: {
            type: String,
        },
        isSinger: {
            type: Boolean,
            default: false,
        },
        refreshToken: {
            type: String,
        },
        playlists: [{ type: Schema.Types.ObjectId, ref: "Playlist" }],
        favorites: [{ type: Schema.Types.ObjectId, ref: "Song" }],
        recentlyPlayed: [{ type: Schema.Types.ObjectId, ref: "RecentlyPlayed" }],
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});



userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    // syntax
    return jwt.sign(
        {
            // this is the payload
            _id: this._id,
            email: this.email,
            username: this.username,
            name: this.name,
        },
        process.env.ACESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACESS_TOKEN_EXPIRY,
        }
    );
};
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            // this is the payload
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const User = mongoose.model("User", userSchema);