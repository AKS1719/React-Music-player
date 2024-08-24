import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (fileBuffer, fileName) => {
    try {
        if (!fileBuffer) {
            return null;
        }

        if (typeof fileBuffer === "string") {
            fileBuffer = Buffer.from(fileBuffer, "base64"); // Convert base64 string to Buffer
        }

        const { fileTypeFromBuffer } = await import("file-type");
        const detectedType = await fileTypeFromBuffer(fileBuffer);

        // If file type is not detected, throw an error
        if (!detectedType) {
            throw new Error("Unsupported file type");
        }

        const { mime } = detectedType;

        // Convert buffer to base64 string
        const base64File = fileBuffer.toString("base64");

        // Determine the resource type based on MIME type
        let resourceType = "auto"; // Default to 'auto' which lets Cloudinary determine the type

        if (mime.startsWith("image/")) {
            resourceType = "image";
        } else if (mime.startsWith("audio/")) {
            resourceType = "video"; // Cloudinary treats audio files as video resources
        } else if (mime.startsWith("video/")) {
            resourceType = "video";
        }

        // Upload the file on Cloudinary with chunked upload for large files
        const response = await cloudinary.uploader.upload_large(
            `data:${mime};base64,${base64File}`,
            {
                resource_type: resourceType,
                public_id: fileName,
                chunk_size: 6 * 1024 * 1024, // 6MB chunks
            }
        );

        console.log(`Successful upload of ${resourceType}`);
        return response;
    } catch (error) {
        console.log("Error", error);
        return null;
    }
};

export { uploadOnCloudinary };
