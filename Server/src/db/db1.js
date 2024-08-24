import mongoose from "mongoose";
import { DB_Name } from "../constants.js";
import colors from "colors";
const connectDb = async () => {
    try {
        const connection = await mongoose.connect(
            `${process.env.MONGODB_URL}/${DB_Name}`
        );
        if (connection) {
            console.log(
                `MongoDb connection success for ${connection}`.cyan.underline
            );
        } else
            throw new Error(
                `MongoDb connection error :: connectDb() ,${err.message}`.red.bold
            );
    } catch (error) {
        console.log(error.message.red.bold);
    }
};
export default connectDb;
